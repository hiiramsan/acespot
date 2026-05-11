import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const courtId = searchParams.get('courtId')
    const date = searchParams.get('date')

    if (!courtId || !date) {
        return NextResponse.json({ error: 'courtId and date are required' }, { status: 400 })
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase
        .from('bookings')
        .select('start_hour, end_hour')
        .eq('court_id', courtId)
        .eq('date', date)
        .eq('status', 'confirmed')

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const reservedHours: number[] = []
    for (const row of data) {
        for (let h = row.start_hour; h < row.end_hour; h++) {
            reservedHours.push(h)
        }
    }

    return NextResponse.json({ reservedHours })
}