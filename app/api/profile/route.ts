import { getUser } from "@/app/utils/user"
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
    const user = await getUser()

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabase.rpc("get_user_booking_stats", {
        user_uuid: user.id,
    })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const row = Array.isArray(data) ? data[0] : data

    return NextResponse.json({
        totalReservations: row?.total_reservations ?? 0,
        totalBookedHours: row?.total_booked_hours ?? 0,
    })
}