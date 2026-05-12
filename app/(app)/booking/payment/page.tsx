'use client'
import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'
import { loadPendingBooking } from '@/app/utils/bookingStore'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function PaymentPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const booking = loadPendingBooking()

  useEffect(() => {
    if (!booking) return
    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    })
      .then(r => r.json())
      .then(({ clientSecret }) => setClientSecret(clientSecret))
  }, [])

  if (!clientSecret) return <div className="min-h-screen flex items-center justify-center text-gray-400">Preparing payment...</div>

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm booking={booking!} />
    </Elements>
  )
}

function CheckoutForm({ booking }: { booking: ReturnType<typeof loadPendingBooking> }) {
  const stripe   = useStripe()
  const elements = useElements()
  const router   = useRouter()
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

    setError(error.message ?? 'Payment failed')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-8 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
          <p className="text-sm text-gray-500 mt-1">{booking?.courtLabel} · ${booking?.totalPrice}</p>
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
            {loading ? 'Processing...' : `Pay $${booking?.totalPrice}`}
          </button>
        </form>
      </div>
    </div>
  )
}