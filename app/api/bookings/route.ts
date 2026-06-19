import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUser } from '@/app/utils/user'

type BookingPayload = {
  courtId: string
  date: string
  startHour: number
  endHour: number
  totalPrice: number
  paymentIntentId: string
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function buildBookingResponse(data: any, courtLabel: string, user: any) {
  return {
    booking: {
      id:          data.id,
      bookingCode: data.booking_code,
      date:        data.date,
      startHour:   data.start_hour,
      endHour:     data.end_hour,
      totalPrice:  data.total_price / 100,
      status:      data.status,
      court:       data.court_id,
    },
    court: { name: courtLabel },
    user:  { fullName: user.full_name ?? null, email: user.email ?? null },
  }
}

async function getCourtLabel(courtId: string): Promise<string> {
  const { data } = await supabase
    .from('courts')
    .select('label')
    .eq('id', courtId)
    .single()
  return data?.label ?? 'Court'
}

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = (await req.json()) as Partial<BookingPayload>
  const { courtId, date, startHour, endHour, paymentIntentId } = body

  // ── Field validation ───────────────────────────────────────────────────────
  if (
    !courtId || !date || !paymentIntentId ||
    typeof startHour !== 'number' ||
    typeof endHour   !== 'number'
  ) {
    return NextResponse.json({ error: 'Missing booking fields' }, { status: 400 })
  }

  if (startHour >= endHour || startHour < 7 || endHour > 22) {
    return NextResponse.json({ error: 'Invalid time range' }, { status: 400 })
  }

  const todayStr = new Date().toLocaleDateString('en-CA')
  if (date < todayStr) {
    return NextResponse.json({ error: 'Cannot book in the past' }, { status: 400 })
  }

  // ── Idempotency check FIRST — return existing booking if already created ───
  // This handles the case where the webhook already fired before the client
  // redirect reached this route (the happy path with webhook)
  const { data: existing } = await supabase
    .from('bookings')
    .select('*')
    .eq('payment_intent_id', paymentIntentId)
    .single()

  if (existing) {
    const label = await getCourtLabel(existing.court_id)
    return NextResponse.json(buildBookingResponse(existing, label, user))
  }

  // ── Verify payment intent with Stripe ─────────────────────────────────────
  const intent = await stripe.paymentIntents.retrieve(paymentIntentId)

  if (intent.status !== 'succeeded') {
    return NextResponse.json({ error: 'Payment not completed' }, { status: 402 })
  }

  if (intent.metadata.userId !== user.id) {
    return NextResponse.json({ error: 'Payment does not belong to this user' }, { status: 403 })
  }

  if (
    intent.metadata.courtId   !== courtId           ||
    intent.metadata.date      !== date              ||
    intent.metadata.startHour !== String(startHour) ||
    intent.metadata.endHour   !== String(endHour)
  ) {
    return NextResponse.json({ error: 'Booking details do not match payment' }, { status: 400 })
  }

  // ── Conflict check (fast early reject before DB constraint fires) ──────────
  const { data: conflicts } = await supabase
    .from('bookings')
    .select('id')
    .eq('court_id', courtId)
    .eq('date', date)
    .eq('status', 'confirmed')
    .lt('start_hour', endHour)
    .gt('end_hour', startHour)

  if (conflicts && conflicts.length > 0) {
    return NextResponse.json({ error: 'Slot already booked' }, { status: 409 })
  }

  // ── Insert — webhook may not have fired yet so we do it here as fallback ───
  const bookingCode = 'AC-' + crypto.randomUUID().replace(/-/g, '').substring(0, 6).toUpperCase()

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      booking_code:      bookingCode,
      court_id:          courtId,
      user_id:           user.id,
      date,
      start_hour:        startHour,
      end_hour:          endHour,
      total_price:       intent.amount,
      status:            'confirmed',
      payment_intent_id: paymentIntentId,
    })
    .select()
    .single()

  if (error) {
    // Unique constraint on payment_intent_id fired — webhook beat us to it
    // Fetch and return the webhook-created booking
    if (error.code === '23505') {
      const { data: raceWinner } = await supabase
        .from('bookings')
        .select('*')
        .eq('payment_intent_id', paymentIntentId)
        .single()

      if (raceWinner) {
        const label = await getCourtLabel(raceWinner.court_id)
        return NextResponse.json(buildBookingResponse(raceWinner, label, user))
      }
    }

    // Overlap constraint fired
    if (error.code === '23P01') {
      return NextResponse.json({ error: 'Slot was just taken by another user' }, { status: 409 })
    }

    console.error('Booking insert failed:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  const label = await getCourtLabel(data.court_id)
  return NextResponse.json(buildBookingResponse(data, label, user))
}