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
        repeating-linear-gradient(135deg, #cbd5e133 0 8px, transparent 8px 20px),
        repeating-linear-gradient(-135deg, #d1fae533 0 8px, transparent 8px 20px)
      `,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative w-full h-full">
        <CourtMap onBook={handleBook} height="100%" />
        <div className='bg-black w-50 h-50 absolute '></div>
      </div>
      
    </main>
  )
};
