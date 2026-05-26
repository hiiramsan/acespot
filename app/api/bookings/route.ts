import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getUser } from "@/app/utils/user"

type BookingPayload = {
  courtId: string
  date: string
  startHour: number
  endHour: number
  totalPrice: number
}

export async function POST(req: NextRequest) {
  const user = await getUser()
  console.log('user id:', user?.id)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = (await req.json()) as Partial<BookingPayload>
  const { courtId, date, startHour, endHour, totalPrice } = body

  if (!courtId || !date || typeof startHour !== "number" || typeof endHour !== "number" || typeof totalPrice !== "number") {
    return NextResponse.json({ error: "Missing booking fields" }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const bookingCode =
    'AC-' + Math.random().toString(36).substring(2, 8).toUpperCase()

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      booking_code: bookingCode,
      court_id: courtId,
      user_id: user.id,
      date,
      start_hour: startHour,
      end_hour: endHour,
      total_price: Math.round(totalPrice * 100),
      status: "confirmed",
    })
    .select()
    .single()

  if (error) {
    console.error("Booking insert failed", error)
    return NextResponse.json(
      { error: error.message, details: error.details, hint: error.hint, code: error.code },
      { status: 500 }
    )
  }

  const { data: courtData } = await supabase
    .from('courts')
    .select('label')
    .eq('id', data.id)
    .single()

    

  return NextResponse.json({
    booking: {
      id: data.id,
      bookingCode: data.booking_code,
      date: data.date,
      startHour: data.start_hour,
      endHour: data.end_hour,
      totalPrice: data.total_price,
      status: data.status,
      court: data.court_id
    },
    court: {
      name: courtData?.label ?? 'Court',
    },
    user: {
      fullName: user.full_name ?? null,
      email: user.email ?? null,
    },
  })
}