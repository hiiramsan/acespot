import { NextResponse } from "next/server"
import { createClient } from "@/app/utils/supabase/server"
import { signToken } from "@/app/utils/jwt"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = normalizeRedirectTarget(searchParams.get("next"))

  if (!code) {
    return NextResponse.redirect(new URL("/auth/error", origin))
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(new URL("/auth/error", origin))
    }

    const { data: { user: googleUser } } = await supabase.auth.getUser()

    if (!googleUser?.email) {
      return NextResponse.redirect(new URL("/auth/error", origin))
    }

    const { data: user } = await supabase
      .from("users")
      .upsert(
        {
          email: googleUser.email,
          full_name: googleUser.user_metadata?.full_name ?? null,
          avatar_url: googleUser.user_metadata?.avatar_url ?? null,
          provider: "google",
          email_verified: true,
        },
        { onConflict: "email" }
      )
      .select()
      .single()

    if (!user) {
      return NextResponse.redirect(new URL("/auth/error", origin))
    }

    const response = NextResponse.redirect(new URL(next, origin))
    const token = await signToken({
      id: user.id,
      email: user.email,
      provider: "google",
    })

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return response
  } catch {
    return NextResponse.redirect(new URL("/auth/error", origin))
  }
}

function normalizeRedirectTarget(value: string | null) {
  if (!value) return "/booking"
  if (!value.startsWith("/")) return "/booking"
  if (value.startsWith("//")) return "/booking"
  if (value.includes("://")) return "/booking"
  return value
}