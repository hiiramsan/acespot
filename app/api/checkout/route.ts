import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { getUser } from '@/app/utils/user'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {

    const cookieStore = await cookies()

    const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  )

    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { courtId, courtLabel, date, startHour, endHour, totalPrice } = await req.json()

    const intent = await stripe.paymentIntents.create({
        amount: totalPrice * 100,
        currency: 'usd',
        metadata: {
            courtId, courtLabel, date,
            startHour: String(startHour),
            endHour: String(endHour),
            userId: user.id,
        },
    })

    return NextResponse.json({ clientSecret: intent.client_secret })

}