import { getSession } from "@/app/utils/session";
import { getUser } from "@/app/utils/user";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {

    const user = await getUser()

    if (!user) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        )
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const session = await getSession();

    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq("user_id", user.id)
        .order("date", { ascending: false })

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }

    return NextResponse.json({
        bookings: data
    })


}