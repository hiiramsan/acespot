'use client'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

interface Props {
  selected: Date
  onChange: (d: Date) => void
}

export function Schedule({ selected, onChange }: Props) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const maxDate = new Date(today)
  maxDate.setMonth(maxDate.getMonth() + 6)

  const [viewed, setViewed] = useState(() => {
    const d = new Date(today)
    d.setDate(1)
    return d
  })

  const firstDayOfMonth = new Date(viewed.getFullYear(), viewed.getMonth(), 1)
  const startOffset = (firstDayOfMonth.getDay() + 6) % 7
  const daysInMonth = new Date(viewed.getFullYear(), viewed.getMonth() + 1, 0).getDate()

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const prevDisabled =
    viewed.getFullYear() === today.getFullYear() &&
    viewed.getMonth() === today.getMonth()

  const nextDisabled =
    viewed.getFullYear() === maxDate.getFullYear() &&
    viewed.getMonth() === maxDate.getMonth()

  const monthLabel = viewed.toLocaleString('default', { month: 'long', year: 'numeric' })

  return (
    <div>
      {/* Month header */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => !prevDisabled && setViewed(v => new Date(v.getFullYear(), v.getMonth() - 1, 1))}
          disabled={prevDisabled}
          className="p-1 rounded bg-gray-300 cursor-pointer hover:bg-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} color='#000' />
        </button>
        <span className="text-sm font-semibold text-gray-800 capitalize">{monthLabel}</span>
        <button
          onClick={() => !nextDisabled && setViewed(v => new Date(v.getFullYear(), v.getMonth() + 1, 1))}
          disabled={nextDisabled}
          className="p-1 rounded bg-gray-300 cursor-pointer hover:bg-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} color='#000' />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d, i) => (
          <div key={i} className="text-center text-xs font-medium text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />

          const cellDate = new Date(viewed.getFullYear(), viewed.getMonth(), day)
          const isPast     = cellDate < today
          const isBeyond   = cellDate > maxDate
          const isDisabled = isPast || isBeyond
          const isToday    = cellDate.getTime() === today.getTime()
          const isSelected = cellDate.getTime() === selected.getTime()

          return (
            <button
              key={i}
              onClick={() => !isDisabled && onChange(cellDate)}
              disabled={isDisabled}
              className={`
                mx-auto w-8 h-8 rounded-full text-sm flex items-center justify-center transition-colors
                ${isSelected
                  ? 'bg-gray-900 text-white font-semibold'
                  : isToday
                    ? 'border border-gray-900 text-gray-900 font-semibold hover:bg-gray-100 cursor-pointer'
                    : isDisabled
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
                }
              `}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}