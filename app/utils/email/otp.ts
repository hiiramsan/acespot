import { createClient } from "../supabase/server"
import { sendEmail } from "./mailer"
import { otpTemplate } from "./templates/otp"

// Generate a random 6-digit code
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function sendOTP(email: string) {
  const supabase = await createClient()
  const code = generateCode()

  // Invalidate any existing codes for this email
  await supabase
    .from("otp_codes")
    .update({ used: true })
    .eq("email", email)
    .eq("used", false)

  // Store new OTP
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  const { error } = await supabase
    .from("otp_codes")
    .insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
    })

  if (error) throw new Error("Failed to store OTP")

  // Send email
  await sendEmail({
    to: email,
    subject: "Your CourtBook verification code",
    html: otpTemplate(code),
  })
}

export async function verifyOTP(email: string, code: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from("otp_codes")
    .select("*")
    .eq("email", email)
    .eq("code", code)
    .eq("used", false)
    .gt("expires_at", new Date().toISOString())
    .single()

  if (!data) return false

  // Mark as used
  await supabase
    .from("otp_codes")
    .update({ used: true })
    .eq("id", data.id)

  return true
}