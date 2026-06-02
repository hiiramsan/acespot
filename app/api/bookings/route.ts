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

export async function POST(req: NextRequest) {
  console.log('--- /api/bookings POST start ---')

  const user = await getUser()
  console.log('user:', user?.id ?? 'null')
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = (await req.json()) as Partial<BookingPayload>
  console.log('body received:', JSON.stringify(body))

  const { courtId, date, startHour, endHour, paymentIntentId } = body
  console.log('parsed fields:', { courtId, date, startHour, endHour, paymentIntentId })

  if (
    !courtId || !date || !paymentIntentId ||
    typeof startHour !== "number" ||
    typeof endHour !== "number"
  ) {
    console.log('REJECTED: missing fields')
    return NextResponse.json({ error: "Missing booking fields" }, { status: 400 })
  }

  if (startHour >= endHour || startHour < 7 || endHour > 22) {
    console.log('REJECTED: invalid time range')
    return NextResponse.json({ error: "Invalid time range" }, { status: 400 })
  }

  const bookingDate = new Date(date)
  const todayStr = new Date().toLocaleDateString('en-CA')
  console.log('date check:', { date, todayStr, isPast: date < todayStr })

  if (date < todayStr) {
    console.log('REJECTED: past date')
    return NextResponse.json({ error: "Cannot book in the past" }, { status: 400 })
  }

  console.log('retrieving payment intent:', paymentIntentId)
  const intent = await stripe.paymentIntents.retrieve(paymentIntentId)
  console.log('intent status:', intent.status)
  console.log('intent metadata:', intent.metadata)

  if (intent.status !== 'succeeded') {
    console.log('REJECTED: payment not succeeded, status:', intent.status)
    return NextResponse.json({ error: "Payment not completed" }, { status: 402 })
  }

  if (intent.metadata.userId !== user.id) {
    console.log('REJECTED: userId mismatch', { intentUserId: intent.metadata.userId, userId: user.id })
    return NextResponse.json({ error: "Payment does not belong to this user" }, { status: 403 })
  }

  if (
    intent.metadata.courtId !== courtId ||
    intent.metadata.date !== date ||
    intent.metadata.startHour !== String(startHour) ||
    intent.metadata.endHour !== String(endHour)
  ) {
    console.log('REJECTED: metadata mismatch', {
      courtId: { meta: intent.metadata.courtId, body: courtId },
      date: { meta: intent.metadata.date, body: date },
      startHour: { meta: intent.metadata.startHour, body: String(startHour) },
      endHour: { meta: intent.metadata.endHour, body: String(endHour) },
    })
    return NextResponse.json({ error: "Booking details do not match payment" }, { status: 400 })
  }

  console.log('checking conflicts...')
  const { data: conflicts } = await supabase
    .from("bookings")
    .select("id")
    .eq("court_id", courtId)
    .eq("date", date)
    .eq("status", "confirmed")
    .lt("start_hour", endHour)
    .gt("end_hour", startHour)

  console.log('conflicts found:', conflicts?.length ?? 0)

  if (conflicts && conflicts.length > 0) {
    console.log('REJECTED: slot already booked')
    return NextResponse.json({ error: "Slot already booked" }, { status: 409 })
  }

  console.log('inserting booking...')
  const bookingCode = 'AC-' + Math.random().toString(36).substring(2, 8).toUpperCase()

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      booking_code: bookingCode,
      court_id: courtId,
      user_id: user.id,
      date,
      start_hour: startHour,
      end_hour: endHour,
      total_price: intent.amount,
      status: "confirmed",
      payment_intent_id: paymentIntentId,
    })
    .select()
    .single()

  console.log('insert result:', { data: data?.id, error: error?.message })

  if (error) {
    console.error("Booking insert failed", error)
    if (error.code === '23P01') {
      return NextResponse.json({ error: "Slot was just taken by another user" }, { status: 409 })
    }
    return NextResponse.json(
      { error: error.message, details: error.details, hint: error.hint, code: error.code },
      { status: 500 }
    )
  }

  const { data: courtData } = await supabase
    .from('courts')
    .select('label')
    .eq('id', data.court_id)
    .single()

  console.log('court label:', courtData?.label)
  console.log('--- /api/bookings POST success ---')

  // Idempotency — if this payment intent already has a booking, return it
  const { data: existing } = await supabase
    .from('bookings')
    .select('*')
    .eq('payment_intent_id', paymentIntentId)
    .single()

  if (existing) {
    const { data: courtData } = await supabase
      .from('courts')
      .select('label')
      .eq('id', existing.court_id)
      .single()

    return NextResponse.json({
      booking: {
        id: existing.id,
        bookingCode: existing.booking_code,
        date: existing.date,
        startHour: existing.start_hour,
        endHour: existing.end_hour,
        totalPrice: existing.total_price / 100,
        status: existing.status,
        court: existing.court_id,
      },
      court: { name: courtData?.label ?? 'Court' },
      user: { fullName: user.full_name ?? null, email: user.email ?? null },
    })
  }
}