'use client'

import { CourtMap } from '@/app/components/CourtMap/CourtMap'
import type { Court } from '@/app/types/Court'

export default function BookingsPage() {
  async function handleBook(court: Court, slotIds: string[]) {
    // Call your server action here
    console.log('Booking:', court.id, slotIds)
    // e.g. await bookCourtAction({ courtId: court.id, slots: slotIds })
  }

  return (
    <main style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <CourtMap onBook={handleBook} height="100%" />
    </main>
  )
};