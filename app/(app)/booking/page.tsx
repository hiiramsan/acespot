'use client'

import { CourtMap } from '@/app/components/CourtMap/CourtMap'
import type { Court } from '@/app/types/Court'

export default function BookingsPage() {
  async function handleBook(court: Court, slotIds: string[]) {
  }

  return (
    <main
      style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}
      className="bg-[#EFEBCE]"
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        repeating-radial-gradient(
          circle at 0 0,
          rgba(0,0,0,0.06) 0 0.7px,
          transparent 0.7px 6px
        ),
        repeating-radial-gradient(
          circle at 100% 100%,
          rgba(0,0,0,0.03) 0 0.6px,
          transparent 0.6px 5px
        )
      `,
          mixBlendMode: 'multiply',
        }}
      />
      <div className="relative w-full h-full">
        <CourtMap onBook={handleBook} height="100%" />
      </div>
    </main>
  )
};