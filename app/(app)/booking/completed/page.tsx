'use client'
import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { clearPendingBooking } from '@/app/utils/bookingStore'
import QRCode from "react-qr-code"

export default function CompletePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    }>
      <CompletePageContent />
    </Suspense>
  )
}

interface BookingResponse {
  booking: {
    id: string
    bookingCode: string
    date: string
    startHour: number
    endHour: number
    totalPrice: number
    status: string
    court: string
  }
  court: { name: string }
  user: { fullName: string | null; email: string | null }
}

const POLL_INTERVAL_MS = 2000   // poll every 2 seconds
const POLL_TIMEOUT_MS  = 30000  // give up after 30 seconds

function CompletePageContent() {
  const searchParams = useSearchParams()
  const router       = useRouter()

  const [status,       setStatus]       = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [bookingData,  setBookingData]  = useState<BookingResponse | null>(null)
  const [pollSeconds,  setPollSeconds]  = useState(0)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startedAt   = useRef<number>(Date.now())

  useEffect(() => {
    const paymentIntent = searchParams.get('payment_intent')
    if (!paymentIntent) { router.push('/'); return }

    async function poll() {
      try {
        const res  = await fetch(`/api/bookings/status?paymentIntentId=${paymentIntent}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error ?? 'Failed to check booking status')
        }

        if (data.booking) {
          // Booking exists — webhook has fired, we're done
          clearPendingBooking()
          setBookingData(data)
          setStatus('success')
          if (intervalRef.current) clearInterval(intervalRef.current)
          return
        }

        // Booking not yet created — check timeout
        const elapsed = Date.now() - startedAt.current
        setPollSeconds(Math.floor(elapsed / 1000))

        if (elapsed > POLL_TIMEOUT_MS) {
          throw new Error('Booking confirmation is taking longer than expected. Your payment was successful — please contact support if your booking does not appear shortly.')
        }

      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : 'Unknown error')
        setStatus('error')
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }

    // Poll immediately then every 2 seconds
    poll()
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  function formatDate(value: string) {
    if (!value) return ""
    return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric", year: "numeric",
    })
  }

  function formatHour(h: number) {
    return `${String(h).padStart(2, '0')}:00`
  }

  if (status === 'loading') return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <Loader2 className="animate-spin text-gray-400" size={32} />
      <p className="text-sm text-gray-400">
        Confirming your booking{pollSeconds > 3 ? ` (${pollSeconds}s)` : ''}...
      </p>
    </div>
  )

  if (status === 'error') return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center px-6">
      <p className="text-gray-900 font-semibold">Something went wrong.</p>
      {errorMessage && <p className="text-sm text-red-500 max-w-sm">{errorMessage}</p>}
    </div>
  )

  if (!bookingData?.booking) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-gray-400" size={32} />
    </div>
  )

  const { booking, court, user } = bookingData

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gray-50 p-20">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-gray-100">

        <div className="flex flex-col items-center text-center">
          <CheckCircle2 size={60} className="text-lime-500 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Booking Confirmed</h1>
          <p className="text-gray-500 mt-2">Your court has been reserved successfully.</p>
        </div>

        <div className="flex justify-center pt-6">
          <div className="bg-white p-3 rounded-xl border border-gray-100">
            <QRCode value={booking.bookingCode ?? booking.id} size={120} />
          </div>
        </div>

        <div className="mt-8 space-y-5">
          <div>
            <p className="text-sm text-gray-400">Court</p>
            <p className="font-semibold text-gray-900">{court?.name ?? booking.court}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Date</p>
            <p className="font-semibold text-gray-900">{formatDate(booking.date)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Time</p>
            <p className="font-semibold text-gray-900">
              {formatHour(booking.startHour)} – {formatHour(booking.endHour)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Amount Paid</p>
            <p className="font-semibold text-gray-900">${booking.totalPrice}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Booking ID</p>
            <p className="font-mono font-bold text-gray-900 tracking-wide">{booking.bookingCode}</p>
          </div>
          {user?.fullName && (
            <div>
              <p className="text-sm text-gray-400">Name</p>
              <p className="font-semibold text-gray-900">{user.fullName}</p>
            </div>
          )}
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