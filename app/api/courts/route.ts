import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { Court } from '@/app/types/Court'

export async function GET() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase
        .from('courts')
        .select('*')
        .order('id')

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const courts: Court[] = data.map(row => ({
    id:           row.id,
    label:        row.label,
    type:         row.type,
    variant:      row.variant,
    status:       row.status,
    pricePerSlot: row.price_per_slot / 100,
    lines:        row.lines,
    x:            row.svg_x,
    y:            row.svg_y,
    w:            row.svg_w,
    h:            row.svg_h,
  }))

  return NextResponse.json({ courts })

}
