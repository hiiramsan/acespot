import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUser } from '@/app/utils/user'

export async function GET(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const paymentIntentId  = searchParams.get('paymentIntentId')

  if (!paymentIntentId) {
    return NextResponse.json({ error: 'Missing paymentIntentId' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: booking, error } = await supabase
    .from('bookings')
    .select('id, booking_code, court_id, date, start_hour, end_hour, total_price, status')
    .eq('payment_intent_id', paymentIntentId)
    .eq('user_id', user.id)
    .single()

  if (error || !booking) {
    // Not found yet — webhook hasn't fired, tell client to keep polling
    return NextResponse.json({ booking: null })
  }

  // Fetch court label
  const { data: court } = await supabase
    .from('courts')
    .select('label')
    .eq('id', booking.court_id)
    .single()

  return NextResponse.json({
    booking: {
      id:          booking.id,
      bookingCode: booking.booking_code,
      date:        booking.date,
      startHour:   booking.start_hour,
      endHour:     booking.end_hour,
      totalPrice:  booking.total_price / 100,
      status:      booking.status,
      court:       booking.court_id,
    },
    court: {
      name: court?.label ?? 'Court',
    },
    user: {
      fullName: user.full_name ?? null,
      email:    user.email     ?? null,
    },
  })
}