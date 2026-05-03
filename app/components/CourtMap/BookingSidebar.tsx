'use client'

import { Court } from "@/app/types/Court"
import { X } from 'lucide-react'
import { useEffect, useState } from "react"
import { TimeSlots, SlotRange, formatHour } from "./TimeSlots"
import { Schedule } from "./Schedule"

interface Props {
  court: Court | null
  onClose: () => void
}

export function BookingSidebar({ court, onClose }: Props) {

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [selectedDate, setSelectedDate] = useState<Date>(today)
  const [selectedRange, setSelectedRange] = useState<SlotRange | null>(null)

  useEffect(() => { setSelectedRange(null) }, [court?.id, selectedDate])

  const totalHours = selectedRange ? selectedRange.end - selectedRange.start + 1 : 0
  const totalPrice = totalHours * (court?.pricePerSlot ?? 0)

  function bookCourt(): void {
    console.log(
      `Booking ${court?.id} 
      on ${selectedDate.toString()} 
      from ${selectedRange?.start} 
      to ${(selectedRange?.end ?? 0) + 1}`
    );
  }

  return (
    <>
      <div
        className={`absolute top-0 right-0 h-full w-100 bg-white border-l border-gray-200 shadow-xl flex flex-col z-60 transition-transform duration-300 ease-in-out pointer-events-auto ${court ? 'translate-x-0' : 'translate-x-full'
          }`}
        onMouseDown={e => e.stopPropagation()}
        onTouchStart={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2 px-2 py-2 w-fit">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-green-700 font-nav uppercase tracking-widest">
              Live availability
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="bg-none border-none cursor-pointer p-1 flex items-center justify-center text-gray-400 hover:text-gray-500 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {court && (
          <div className="flex-1 px-7 flex flex-col gap-6 overflow-y-auto">

            {/* Court info */}
            <div>
              <h3 className="text-4xl font-bold font-nav text-gray-900 mb-2 leading-tight">
                {court.label}
              </h3>
              <p className="text-md text-gray-500">
                {court.type} Court
              </p>
            </div>

            {/* Schedule + Slots */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-6 pb-6">
              <section>
                <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">
                  Schedule
                </h4>
                <Schedule selected={selectedDate} onChange={setSelectedDate} />
              </section>

              <section>
                <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">
                  Time slots
                </h4>
                <p className="text-xs text-gray-400 mb-2">
                  Click or drag to select continuous hours
                </p>
                <TimeSlots
                  courtId={court.id}
                  date={selectedDate}
                  selected={selectedRange}
                  onChange={setSelectedRange}
                />
              </section>
            </div>

            {/* Footer — only shown when a range is selected */}
            {selectedRange && (
              <div className="px-5 py-5 border-t border-gray-100 flex flex-col gap-4">

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Duration</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {totalHours} {totalHours === 1 ? 'Hour' : 'Hours'} Selected
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Date</span>
                    <span className="text-sm text-gray-900">
                      {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Time</span>
                    <span className="text-sm text-gray-900">
                      {formatHour(selectedRange.start)} – {formatHour(selectedRange.end + 1)}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Total Amount</span>
                  <span className="text-2xl font-bold text-lime-600">${totalPrice}</span>
                </div>

                <button className="w-full py-3.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 active:bg-gray-950 transition-colors cursor-pointer"
                  onClick={() => bookCourt()}
                >
                  Book Now
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </>
  )
}