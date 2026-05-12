"use server"

import { redirect } from "next/navigation"
import { createClient } from "../utils/supabase/server"
import bcrypt from "bcryptjs"
import { clearSession, createSession } from "../utils/session"
import { sendOTP, verifyOTP } from "../utils/email/otp"

export async function login(formData: FormData) {
  const supabase = await createClient()
  const redirectTo = getRedirectTarget(formData)

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single()

  if (!user) return { error: "Invalid email or password" }
  if (user.provider !== "email") return { error: "Please sign in with Google" }

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) return { error: "Invalid email or password" }

  await createSession({
    id: user.id,
    email: user.email,
    provider: "email",
  })

  redirect(redirectTo)
}

export async function register(formData: FormData) {
  const supabase = await createClient()
  const redirectTo = getRedirectTarget(formData)

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const repeatPassword = formData.get("repeatPassword") as string

  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address" }
  }

  if (!password || password.length < 6) {
    return { error: "Password must be at least 6 characters" }
  }

  if (password !== repeatPassword) {
    return { error: "Passwords do not match" }
  }

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single()

  if (existing) return { error: "Email already in use" }

  const password_hash = await bcrypt.hash(password, 12)

  const { cookies } = await import("next/headers")
  const cookieStore = await cookies()
  cookieStore.set(
    "pending_registration",
    JSON.stringify({ email, password_hash }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 10,
      path: "/",
    }
  )

  await sendOTP(email)

  redirect(`/auth/verify?redirectTo=${encodeURIComponent(redirectTo)}`)

}

// --- Verify OTP ---
export async function verifyEmail(formData: FormData) {
  const supabase = await createClient()
  const code = formData.get("code") as string
  const redirectTo = getRedirectTarget(formData)

  // Get pending registration from cookie
  const { cookies } = await import("next/headers")
  const cookieStore = await cookies()
  const pending = cookieStore.get("pending_registration")?.value

  if (!pending) return { error: "Registration expired, please try again" }

  const { email, password_hash } = JSON.parse(pending)

  // Verify OTP
  const valid = await verifyOTP(email, code)
  if (!valid) return { error: "Invalid or expired code" }

  // Create user now that email is verified
  const { data: newUser, error } = await supabase
    .from("users")
    .insert({
      email,
      password_hash,
      provider: "email",
      email_verified: true,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  // Clear pending cookie
  cookieStore.delete("pending_registration")

  // Create session
  await createSession({
    id: newUser.id,
    email: newUser.email,
    provider: "email",
  })

  redirect(redirectTo)
}


export async function signInWithOAuth(provider: "google" | "apple", redirectTo?: string) {
  const supabase = await createClient()
  const safeRedirect = normalizeRedirectTarget(redirectTo)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${encodeURIComponent(safeRedirect)}`,
    },
  })

  if (error) return { error: error.message }

  if (data.url) redirect(data.url)
}

export async function logout() {
  await clearSession()
  redirect("/")
}

function getRedirectTarget(formData: FormData) {
  const value = formData.get("redirectTo")
  return normalizeRedirectTarget(typeof value === "string" ? value : undefined)
}

function normalizeRedirectTarget(value?: string) {
  if (!value) return "/booking"
  if (!value.startsWith("/")) return "/booking"
  if (value.startsWith("//")) return "/booking"
  if (value.includes("://")) return "/booking"
  return value
}