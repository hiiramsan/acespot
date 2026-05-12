import { NextResponse } from "next/server"
import { createClient } from "@/app/utils/supabase/server"
import { createSession } from "@/app/utils/session"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = normalizeRedirectTarget(searchParams.get("next"))

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user: googleUser } } = await supabase.auth.getUser()

      if (googleUser) {
        const { data: user } = await supabase
          .from("users")
          .upsert({
            email: googleUser.email!,
            full_name: googleUser.user_metadata?.full_name ?? null,
            avatar_url: googleUser.user_metadata?.avatar_url ?? null,
            provider: "google",
            email_verified: true,
          }, { onConflict: "email" })
          .select()
          .single()

        if (user) {
          await createSession({
            id: user.id,
            email: user.email,
            provider: "google",
          })
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}

function normalizeRedirectTarget(value: string | null) {
  if (!value) return "/booking"
  if (!value.startsWith("/")) return "/booking"
  if (value.startsWith("//")) return "/booking"
  if (value.includes("://")) return "/booking"
  return value
}