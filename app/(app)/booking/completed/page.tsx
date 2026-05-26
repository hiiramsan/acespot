'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { clearPendingBooking, loadPendingBooking } from '@/app/utils/bookingStore'
import QRCode from "react-qr-code"

export default function CompletePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [bookingData, setBookingData] = useState<any>(null)

  useEffect(() => {
    const paymentIntent = searchParams.get('payment_intent')
    if (!paymentIntent) { router.push('/'); return }

    const booking = loadPendingBooking()
    if (!booking) { router.push('/'); return }

    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...booking,
        paymentIntentId: paymentIntent,
      }),
    })
      .then(async r => {
        if (r.ok) return r.json()
        const payload = await r.json().catch(() => null)
        const message = payload?.error ?? 'Booking failed'
        throw new Error(message)
      })
      .then((data) => {
        clearPendingBooking()
        setBookingData(data)
        setStatus('success')
      })
      .catch((err: Error) => {
        setErrorMessage(err.message)
        setStatus('error')
      })
  }, [])

  function formatDate(value: string) {
    if (!value) return ""
    const date = new Date(`${value}T00:00:00`)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  function formatCourtName(courtName: string) {
    return courtName.charAt(0).toUpperCase() + courtName.replace("-", " Court ").slice(1)
  }

  if (status === 'loading') return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-gray-400" size={32} />
    </div>
  )

  if (status === 'error') return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center px-6">
      <p className="text-gray-900 font-semibold">Payment went through but booking failed.</p>
      {errorMessage && (
        <p className="text-sm text-gray-500">{errorMessage}</p>
      )}
      <p className="text-sm text-gray-500">Contact support with your payment reference.</p>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gray-50 p-20">
      <div className="w-full max-w-md bg-white rounded-3xl  p-8 shadow-sm border border-gray-100">

        <div className="flex flex-col items-center text-center">
          <CheckCircle2 size={60} className="text-lime-500 mb-4" />

          <h1 className="text-3xl font-bold text-gray-900">
            Booking Confirmed
          </h1>

          <p className="text-gray-500 mt-2">
            Your court has been reserved successfully.
          </p>
        </div>

        <div className="flex justify-center pt-4">
          <div className="bg-white p-3 rounded-xl">
            <QRCode value={bookingData.booking.bookingCode} size={120} />
          </div>
        </div>

        <div className="mt-8 space-y-5">

          <div>
            <p className="text-sm text-gray-400">Court</p>
            <p className="font-semibold text-gray-900">
              {formatCourtName(bookingData.booking.court)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Date</p>
            <p className="font-semibold text-gray-900">
              {formatDate(bookingData.booking.date)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Time</p>
            <p className="font-semibold text-gray-900">
              {bookingData.booking.startHour}:00 - {bookingData.booking.endHour}:00
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Booking ID</p>
            <p className="font-mono font-bold text-gray-900 tracking-wide">
              {bookingData.booking.bookingCode}
            </p>
          </div>

        </div>

        <div className="mt-8 border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-500 text-center">
            Arrive 10 minutes early and show your booking ID at reception.
          </p>
        </div>

        <button
          onClick={() => router.push('/')}
          className="mt-8 w-full py-3 rounded-2xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Back to Home
        </button>

      </div>
    </div>
  )
}