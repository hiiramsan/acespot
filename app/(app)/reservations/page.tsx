"use client"

import { Booking } from "@/app/types/Booking"
import { Grid2x2, List, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import QRCode from "react-qr-code"
import { formatHour } from "@/app/components/CourtMap/TimeSlots"

type ViewMode = "grid" | "list"

export default function ReservationsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setIsLoading] = useState(true);
  const [activeReservationId, setActiveReservationId] = useState<string | null>(null)
  const activeReservation = bookings.find((item) => item.id === activeReservationId) || null

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

  useEffect(() => {
    fetch('/api/reservations')
      .then(res => res.json())
      .then(data => {
        setBookings(data.bookings || [])
        setIsLoading(false)
      })

  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-12">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">
              Your bookings
            </p>
            <h1 className="text-4xl sm:text-5xl font-light text-gray-900 mb-2">
              My Reservations
            </h1>
            <p className="text-sm text-gray-500">
              Tickets with QR access and full booking details.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest cursor-pointer rounded-full transition-colors ${viewMode === "grid"
                ? "bg-gray-900 text-white"
                : "text-gray-500 hover:text-gray-900"
                }`}
            >
              <Grid2x2 />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 text-xs font-semibold uppercase cursor-pointer tracking-widest rounded-full transition-colors ${viewMode === "list"
                ? "bg-gray-900 text-white"
                : "text-gray-500 hover:text-gray-900"
                }`}
            >
              <List />
            </button>
          </div>
        </div>

        {/* Tickets */}
        <div
          className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
            }`}
        >
          {bookings.map((reservation) => (
            <button
              key={reservation.id}
              type="button"
              onClick={() => setActiveReservationId(reservation.id)}
              className="border border-gray-200 rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden text-left transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                    Booking ID
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {reservation.booking_code}
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-6 px-6 py-5">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-28 h-28 rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-center">
                    <QRCode value={reservation.booking_code ?? ""} size={80} />
                  </div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                    Scan to check in
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-2xl font-light text-gray-900">
                      {formatCourtName(reservation.court_id)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">Date</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(reservation.date)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">Time</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatHour(reservation.start_hour)} - {formatHour(reservation.end_hour)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">Duration</p>
                      <p className="text-sm font-medium text-gray-900">
                        {Math.max(0, reservation.end_hour - reservation.start_hour)} hrs
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">Reference</p>
                      <p className="text-sm font-semibold text-gray-900">{reservation.booking_code}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">Total</p>
                      <p className="text-2xl font-light text-gray-900">
                        ${(reservation.total_price / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeReservation && (
        <div className="fixed inset-0 z-100 bg-white">
          <div className="max-w-3xl mx-auto px-5 sm:px-6 pt-6 pb-12 min-h-screen flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                  Reservation
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {activeReservation.booking_code}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveReservationId(null)}
                className="px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold uppercase tracking-widest text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-8">
              <div className="flex flex-col items-center gap-4">
                <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-3xl border border-gray-200 bg-gray-50 flex items-center justify-center">
                  <QRCode value={activeReservation.booking_code ?? ""} size={220} />
                </div>
                <p className="text-xs text-gray-400 uppercase tracking-widest">
                  Show this QR at the entrance
                </p>
              </div>

              <div className="border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-light text-gray-900">
                      {activeReservation.court_id}
                    </p>
                    <p className="text-sm text-gray-500">Court booking</p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                    Confirmed
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Date</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(activeReservation.date)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Time</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatHour(activeReservation.start_hour)} - {formatHour(activeReservation.end_hour)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Duration</p>
                    <p className="text-sm font-medium text-gray-900">
                      {Math.max(0, activeReservation.end_hour - activeReservation.start_hour)} hrs
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-6">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Reference</p>
                    <p className="text-sm font-semibold text-gray-900">{activeReservation.booking_code}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Total</p>
                    <p className="text-2xl font-light text-gray-900">
                      ${(activeReservation.total_price / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}