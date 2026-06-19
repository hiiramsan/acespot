'use client'

import { Suspense } from 'react'
import { CourtMap } from '@/app/components/CourtMap/CourtMap'
import { Loader2 } from 'lucide-react'

export default function BookingsPage() {
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
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin text-gray-400" size={32} />
          </div>
        }>
          <CourtMap height="100%" />
        </Suspense>
        <div className='bg-black w-50 h-50 absolute '></div>
      </div>
    </main>
  )
};
