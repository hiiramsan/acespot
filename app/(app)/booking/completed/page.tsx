'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { clearPendingBooking, loadPendingBooking } from '@/app/utils/bookingStore'

export default function CompletePage() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const paymentIntent = searchParams.get('payment_intent')
    if (!paymentIntent) { router.push('/'); return }

    const booking = loadPendingBooking()
    if (!booking) { router.push('/'); return }

    // Insert the confirmed booking into Supabase
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
      .then(() => {
        clearPendingBooking()
        setStatus('success')
      })
      .catch((err: Error) => {
        setErrorMessage(err.message)
        setStatus('error')
      })
  }, [])

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
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
      <CheckCircle2 size={56} className="text-green-500" />
      <h1 className="text-3xl font-bold text-gray-900">Booking Confirmed!</h1>
      <p className="text-gray-500 max-w-sm">Check your email for confirmation details.</p>
      <button onClick={() => router.push('/')} className="mt-4 px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors cursor-pointer">
        Back to Home
      </button>
    </div>
  )
}