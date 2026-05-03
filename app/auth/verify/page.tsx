"use client"

import { useMemo, useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react"
import Link from "next/link"
import { verifyEmail } from "@/app/auth/actions"

const OTP_LENGTH = 6

export default function VerifyPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""))
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  const otpValue = useMemo(() => otp.join(""), [otp])

  async function handleSubmit(formData: FormData) {
    setError(null)
    setLoading(true)

    const result = await verifyEmail(formData)
    if (result?.error) setError(result.error)

    setLoading(false)
  }

  const focusInput = (index: number) => {
    inputsRef.current[index]?.focus()
    inputsRef.current[index]?.select()
  }

  const updateOtpAt = (index: number, value: string) => {
    setOtp((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const handleInputChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1)
    updateOtpAt(index, digit)

    if (digit && index < OTP_LENGTH - 1) {
      focusInput(index + 1)
    }
  }

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Backspace") return

    if (otp[index]) {
      updateOtpAt(index, "")
      return
    }

    if (index > 0) {
      updateOtpAt(index - 1, "")
      focusInput(index - 1)
    }
  }

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH)

    if (!pasted) return

    setOtp((prev) => {
      const next = [...prev]
      pasted.split("").forEach((char, index) => {
        next[index] = char
      })
      return next
    })

    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1)
    focusInput(nextIndex)
  }

  return (
    <div className="min-h-dvh w-full bg-[#030303] flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-8 w-full max-w-md">
        <Link href="/" className="flex items-center gap-2">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="#BEF264"
            className="hover:opacity-80 transition-opacity"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M16 12h7v1h-7zM2 13h7v-1H2zm10 10h1v-7h-1zm0-14h1V2h-1zm-2 1h5v5h-5zm1 4h3v-3h-3z"></path>
              <path fill="none" d="M0 0h24v24H0z"></path>
            </g>
          </svg>
          <span className="text-xl font-nav tracking-normal text-white">
            ACE<span className="font-medium font-inter">SPOT</span>
          </span>
        </Link>

        <div className="text-center space-y-3">
          <h1 className="text-4xl font-nav font-light tracking-normal text-white">
            Verify your email
          </h1>
          <p className="text-gray-300 font-nav text-sm leading-relaxed">
            Enter the 6-digit code we sent to your email address.
          </p>
        </div>

        {error && (
          <div className="w-full bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-300 text-sm font-nav flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0 mt-0.5"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div>
              <p className="font-medium mb-1">Verification failed</p>
              <p className="text-xs">{error}</p>
            </div>
          </div>
        )}

        <form className="w-full flex flex-col gap-4" action={handleSubmit}>
          <input type="hidden" name="code" value={otpValue} />
          <div className="flex items-center justify-between gap-2">
            {otp.map((value, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputsRef.current[index] = element
                }}
                value={value}
                onChange={(event) => handleInputChange(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                onPaste={handlePaste}
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                aria-label={`Digit ${index + 1}`}
                className="h-14 w-12 rounded-xl border border-gray-600 bg-transparent text-white text-center text-xl font-nav tracking-widest transition-all duration-200 focus:border-lime-300 focus:ring-2 focus:ring-lime-300/30 outline-none hover:border-gray-400"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || otpValue.length !== OTP_LENGTH}
            className="h-10 w-full bg-lime-300/90 hover:bg-lime-300 disabled:opacity-50 disabled:cursor-not-allowed text-black font-nav font-medium text-sm rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 4.5a10 10 0 0 1-18.8 4.2"></path>
                </svg>
                Verifying...
              </span>
            ) : (
              "Verify email"
            )}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center font-nav leading-relaxed">
          Didn&apos;t get the code? Check your spam folder or try again.
        </p>

        <div className="text-center">
          <p className="text-sm text-gray-400 font-nav">
            Wrong email?{" "}
            <Link
              href="/auth"
              className="text-lime-300 hover:text-lime-200 transition-colors font-medium"
            >
              Go back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}