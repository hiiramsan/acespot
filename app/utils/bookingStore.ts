/**
 * bookingStore.ts
 * Persists a pending booking in sessionStorage so it survives
 * the auth redirect and can be restored on /booking/complete.
 */
import { PendingBooking } from "../types/PendingBooking"

const KEY = 'pending_booking'

export function savePendingBooking(booking: PendingBooking): void {
  sessionStorage.setItem(KEY, JSON.stringify(booking))
}

export function loadPendingBooking(): PendingBooking | null {
  if (typeof window === 'undefined') return null
  const raw = sessionStorage.getItem(KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as PendingBooking
  } catch {
    return null
  }
}

export function clearPendingBooking(): void {
  sessionStorage.removeItem(KEY)
}
 