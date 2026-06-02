'use client'
import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'
import { loadPendingBooking } from '@/app/utils/bookingStore'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function PaymentPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [totalPrice,   setTotalPrice]   = useState<number | null>(null)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const booking = loadPendingBooking()

  useEffect(() => {
    if (!booking) return
    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Only send what the server needs — price is computed server-side
      body: JSON.stringify({
        courtId:   booking.courtId,
        date:      booking.date,
        startHour: booking.startHour,
        endHour:   booking.endHour,
      }),
    })
      .then(async r => {
        const data = await r.json()
        if (!r.ok) throw new Error(data.error ?? 'Checkout failed')
        return data
      })
      .then(({ clientSecret, totalPrice }) => {
        setClientSecret(clientSecret)
        setTotalPrice(totalPrice)   // use server-computed price for display
      })
      .catch(err => setCheckoutError(err.message))
  }, [])

  if (checkoutError) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center px-6">
      <p className="text-gray-900 font-semibold">Could not prepare payment</p>
      <p className="text-sm text-red-500">{checkoutError}</p>
    </div>
  )

  if (!clientSecret) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">
      Preparing payment...
    </div>
  )

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm booking={booking!} totalPrice={totalPrice} />
    </Elements>
  )
}

function CheckoutForm({ booking, totalPrice }: {
  booking: ReturnType<typeof loadPendingBooking>
  totalPrice: number | null
}) {
  const stripe   = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/booking/completed`,
      },
    })

    // Only reaches here on error — success redirects automatically
    setError(error.message ?? 'Payment failed')
    setLoading(false)
  }

  const displayPrice = totalPrice ?? booking?.totalPrice ?? 0

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-8 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
          <p className="text-sm text-gray-500 mt-1">
            {booking?.courtLabel} · ${displayPrice}
          </p>
          <p className="text-xs text-gray-400 mt-3 bg-gray-50 rounded-lg px-3 py-2">
            🧪 Test card: <span className="font-mono font-semibold">4242 4242 4242 4242</span> · any future date · any CVV
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <PaymentElement />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={!stripe || loading}
            className="w-full py-3.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {loading ? 'Processing...' : `Pay $${displayPrice}`}
          </button>
        </form>
      </div>
    </div>
  )
}