"use client"

import { Grid2x2, List } from "lucide-react"
import { useState } from "react"

const reservations = [
  {
    id: "RSV-2041",
    court: "Center Court",
    facility: "North Complex",
    date: "May 18, 2026",
    time: "18:00 - 20:00",
    duration: "2 Hours",
    amount: "$64",
    status: "Upcoming",
    ref: "AC-88Q1-2K",
  },
  {
    id: "RSV-1937",
    court: "Clay Court 2",
    facility: "South Wing",
    date: "May 10, 2026",
    time: "09:00 - 10:00",
    duration: "1 Hour",
    amount: "$32",
    status: "Completed",
    ref: "AC-71P9-5V",
  },
  {
    id: "RSV-1892",
    court: "Court 5",
    facility: "Main Hall",
    date: "May 03, 2026",
    time: "14:00 - 16:00",
    duration: "2 Hours",
    amount: "$58",
    status: "Completed",
    ref: "AC-60H4-9D",
  },
]

type ViewMode = "grid" | "list"

export default function ReservationsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [activeReservationId, setActiveReservationId] = useState<string | null>(null)

  const activeReservation = reservations.find((item) => item.id === activeReservationId) || null

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
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest cursor-pointer rounded-full transition-colors ${
                viewMode === "grid"
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Grid2x2 />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 text-xs font-semibold uppercase cursor-pointer tracking-widest rounded-full transition-colors ${
                viewMode === "list"
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <List/>
            </button>
          </div>
        </div>

        {/* Tickets */}
        <div
          className={`grid gap-6 ${
            viewMode === "grid" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {reservations.map((reservation) => (
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
                    {reservation.id}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full ${
                    reservation.status === "Upcoming"
                      ? "bg-lime-100 text-lime-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {reservation.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-6 px-6 py-5">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-28 h-28 rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-center">
                    <img src="/qr.svg" alt="Reservation QR" className="h-20 w-20" />
                  </div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                    Scan to check in
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-2xl font-light text-gray-900">
                      {reservation.court}
                    </p>
                    <p className="text-sm text-gray-500">{reservation.facility}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">Date</p>
                      <p className="text-sm font-medium text-gray-900">{reservation.date}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">Time</p>
                      <p className="text-sm font-medium text-gray-900">{reservation.time}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">Duration</p>
                      <p className="text-sm font-medium text-gray-900">{reservation.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">Reference</p>
                      <p className="text-sm font-semibold text-gray-900">{reservation.ref}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">Total</p>
                      <p className="text-2xl font-light text-gray-900">{reservation.amount}</p>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeReservation && (
        <div className="fixed inset-0 z-[100] bg-white">
          <div className="max-w-3xl mx-auto px-5 sm:px-6 pt-6 pb-12 min-h-screen flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                  Reservation
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {activeReservation.id}
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
                  <img src="/qr.svg" alt="Reservation QR" className="h-40 w-40 sm:h-56 sm:w-56" />
                </div>
                <p className="text-xs text-gray-400 uppercase tracking-widest">
                  Show this QR at the entrance
                </p>
              </div>

              <div className="border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-light text-gray-900">
                      {activeReservation.court}
                    </p>
                    <p className="text-sm text-gray-500">{activeReservation.facility}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full ${
                      activeReservation.status === "Upcoming"
                        ? "bg-lime-100 text-lime-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {activeReservation.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Date</p>
                    <p className="text-sm font-medium text-gray-900">{activeReservation.date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Time</p>
                    <p className="text-sm font-medium text-gray-900">{activeReservation.time}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Duration</p>
                    <p className="text-sm font-medium text-gray-900">{activeReservation.duration}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-6">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Reference</p>
                    <p className="text-sm font-semibold text-gray-900">{activeReservation.ref}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Total</p>
                    <p className="text-2xl font-light text-gray-900">{activeReservation.amount}</p>
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