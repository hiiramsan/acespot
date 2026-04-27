'use client'
import { useRef, useState } from 'react'
import { Check, Trash2 } from 'lucide-react'
import { getReservedHours } from '@/app/data/schedule'

const OPEN_HOUR  = 7
const CLOSE_HOUR = 22

export function formatHour(h: number) {
  return `${String(h).padStart(2, '0')}:00`
}

export interface SlotRange {
  start: number
  end: number
}

interface Props {
  courtId: string
  date: Date
  selected: SlotRange | null
  onChange: (range: SlotRange | null) => void
}

export function TimeSlots({ courtId, date, selected, onChange }: Props) {
  const reservedHours = getReservedHours(courtId, date)

  const hours = Array.from(
    { length: CLOSE_HOUR - OPEN_HOUR },
    (_, i) => OPEN_HOUR + i
  )

  const [preview, setPreview] = useState<SlotRange | null | undefined>(undefined)

  const dragOrigin = useRef<number | null>(null)

  const activeRange = preview !== undefined ? preview : selected

  function isInRange(hour: number) {
    if (!activeRange) return false
    return hour >= activeRange.start && hour <= activeRange.end
  }

  function buildRange(a: number, b: number): SlotRange | null {
    const lo = Math.min(a, b)
    const hi = Math.max(a, b)
    for (let h = lo; h <= hi; h++) {
      if (reservedHours.has(h)) return null
    }
    return { start: lo, end: hi }
  }

  function computeClickResult(hour: number): SlotRange | null {
    if (!selected) return { start: hour, end: hour }

    const { start, end } = selected

    if (hour >= start && hour <= end) {
      if (start === end) return null                          
      if (hour === start) return { start: hour + 1, end }
      if (hour === end) return { start, end: hour - 1 }
      return null
    }
    
    if (hour === start - 1) return buildRange(hour, end)
    if (hour === end + 1) return buildRange(start, hour)

    return { start: hour, end: hour }
  }

  function handleMouseDown(hour: number) {
    if (reservedHours.has(hour)) return
    dragOrigin.current = hour
    setPreview(computeClickResult(hour))
  }

  function handleMouseEnter(hour: number) {
    if (dragOrigin.current === null) return
    if (reservedHours.has(hour)) return
    const range = buildRange(dragOrigin.current, hour)
    setPreview(range)
  }

  function handleMouseUp() {
    if (dragOrigin.current === null) return
    onChange(preview ?? null)
    setPreview(undefined)
    dragOrigin.current = null
  }

  function handleMouseLeave() {
    if (dragOrigin.current === null) return
    onChange(preview ?? null)
    setPreview(undefined)
    dragOrigin.current = null
  }

  return (
    <div>
      {activeRange && (
        <button
          onMouseDown={e => e.stopPropagation()}
          onClick={() => { onChange(null); setPreview(undefined) }}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors mb-2 ml-auto cursor-pointer"
        >
          <Trash2 size={12} />
          Clear
        </button>
      )}

      <div
        className="flex flex-col gap-1 select-none"
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
      >
        {hours.map(hour => {
          const isReserved  = reservedHours.has(hour)
          const highlighted = isInRange(hour)

          return (
            <div
              key={hour}
              onMouseDown={() => handleMouseDown(hour)}
              onMouseEnter={() => handleMouseEnter(hour)}
              className={`
                flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors
                ${isReserved
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                  : highlighted
                    ? 'bg-gray-900 text-white cursor-pointer'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 cursor-pointer'
                }
              `}
            >
              <span className="font-medium">{formatHour(hour)}</span>
              <span className="text-xs">
                {isReserved
                  ? <span className="text-gray-400">Reserved</span>
                  : highlighted
                    ? <Check size={14} />
                    : null
                }
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}