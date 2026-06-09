import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUser } from '@/app/utils/user'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

type CheckoutPayload = {
  courtId: string
  date: string
  startHour: number
  endHour: number
}

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = (await req.json()) as Partial<CheckoutPayload>
  const { courtId, date, startHour, endHour } = body

  if (!courtId || !date || typeof startHour !== 'number' || typeof endHour !== 'number') {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  if (startHour >= endHour || startHour < 7 || endHour > 22) {
    return NextResponse.json({ error: 'Invalid time range' }, { status: 400 })
  }

  if (isNaN(new Date(date).getTime())) {
    return NextResponse.json({ error: 'Invalid date' }, { status: 400 })
  }

  const todayStr = new Date().toLocaleDateString('en-CA')
  if (date < todayStr) {
    return NextResponse.json({ error: 'Cannot book in the past' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // ── Court validation ───────────────────────────────────────────────────────
  const { data: court, error: courtError } = await supabase
    .from('courts')
    .select('id, label, price_per_slot, status')
    .eq('id', courtId)
    .single()

  if (courtError || !court) {
    return NextResponse.json({ error: 'Court not found' }, { status: 404 })
  }

  if (court.status !== 'available') {
    return NextResponse.json({ error: 'Court is not available' }, { status: 409 })
  }

  // ── Fresh availability check at the last possible moment ──────────────────
  // This is P3: re-check right before charging, not just when the UI loaded
  const { data: conflicts } = await supabase
    .from('bookings')
    .select('id')
    .eq('court_id', courtId)
    .eq('date', date)
    .eq('status', 'confirmed')
    .lt('start_hour', endHour)
    .gt('end_hour', startHour)

  if (conflicts && conflicts.length > 0) {
    return NextResponse.json({
      error: 'This slot was just booked by someone else. Please select a different time.',
    }, { status: 409 })
  }

  // ── Compute price server-side — never trust client ─────────────────────────
  const durationHours   = endHour - startHour
  const totalPriceCents = durationHours * court.price_per_slot

  // ── Create Payment Intent ──────────────────────────────────────────────────
  const intent = await stripe.paymentIntents.create({
    amount:   totalPriceCents,
    currency: 'usd',
    metadata: {
      courtId,
      courtLabel:      court.label,
      date,
      startHour:       String(startHour),
      endHour:         String(endHour),
      userId:          user.id,
      totalPriceCents: String(totalPriceCents),
    },
  })

  return NextResponse.json({
    clientSecret:    intent.client_secret,
    totalPriceCents,
    totalPrice:      totalPriceCents / 100,
  })
}