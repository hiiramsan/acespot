import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body      = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Acknowledge all non-relevant events immediately
  if (event.type !== 'payment_intent.succeeded') {
    return NextResponse.json({ received: true })
  }

  const intent = event.data.object as Stripe.PaymentIntent
  const { courtId, date, startHour, endHour, userId } = intent.metadata

  if (!courtId || !date || !startHour || !endHour || !userId) {
    // Return 200 so Stripe doesn't retry — this intent wasn't created by our app
    console.error('Webhook: missing metadata, skipping', intent.id)
    return NextResponse.json({ received: true })
  }

  // ── Idempotency — skip if already inserted ────────────────────────────────
  const { data: existing } = await supabase
    .from('bookings')
    .select('id')
    .eq('payment_intent_id', intent.id)
    .single()

  if (existing) {
    console.log('Webhook: booking already exists for intent', intent.id)
    return NextResponse.json({ received: true })
  }

  // ── Insert booking ────────────────────────────────────────────────────────
  const bookingCode = 'AC-' + crypto.randomUUID().replace(/-/g, '').substring(0, 6).toUpperCase()

  const { error } = await supabase
    .from('bookings')
    .insert({
      booking_code:      bookingCode,
      court_id:          courtId,
      user_id:           userId,
      date,
      start_hour:        parseInt(startHour),
      end_hour:          parseInt(endHour),
      total_price:       intent.amount,
      status:            'confirmed',
      payment_intent_id: intent.id,
    })

  if (error) {
    // 23505 = unique violation on payment_intent_id — race with the booking route, ignore
    if (error.code === '23505') {
      console.log('Webhook: booking already created by route, skipping')
      return NextResponse.json({ received: true })
    }
    console.error('Webhook booking insert failed:', error)
    // Return 500 so Stripe retries
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  console.log('Webhook: booking created', bookingCode)
  return NextResponse.json({ received: true })
}