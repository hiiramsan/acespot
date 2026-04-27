import { Booking } from "../types/Booking"

export const BOOKINGS: Booking[] = [
  { id: 'b1',  courtId: 'hard-1', customerId: 'cust-101', date: '2026-04-25', startHour: 10,  endHour: 11 },
  { id: 'b2',  courtId: 'hard-1', customerId: 'cust-102', date: '2026-04-25', startHour: 14, endHour: 15 },
  { id: 'b3',  courtId: 'hard-1', customerId: 'cust-103', date: '2026-04-26', startHour: 8,  endHour: 10 },

  { id: 'b4',  courtId: 'hard-2', customerId: 'cust-104', date: '2026-04-25', startHour: 7,  endHour: 9  },
  { id: 'b5',  courtId: 'hard-2', customerId: 'cust-105', date: '2026-04-25', startHour: 17, endHour: 19 },

  { id: 'b6',  courtId: 'hard-3', customerId: 'cust-106', date: '2026-04-25', startHour: 12, endHour: 14 },
  { id: 'b7',  courtId: 'hard-3', customerId: 'cust-107', date: '2026-04-27', startHour: 10, endHour: 12 },

  { id: 'b8',  courtId: 'hard-4', customerId: 'cust-108', date: '2026-04-25', startHour: 7,  endHour: 13 },

  { id: 'b9',  courtId: 'clay-1', customerId: 'cust-109', date: '2026-04-25', startHour: 10, endHour: 12 },
  { id: 'b10', courtId: 'clay-1', customerId: 'cust-110', date: '2026-04-25', startHour: 15, endHour: 17 },
  { id: 'b11', courtId: 'clay-1', customerId: 'cust-111', date: '2026-04-26', startHour: 9,  endHour: 11 },

  { id: 'b12', courtId: 'clay-2', customerId: 'cust-112', date: '2026-04-25', startHour: 14, endHour: 16 },
  { id: 'b13', courtId: 'clay-2', customerId: 'cust-113', date: '2026-04-28', startHour: 11, endHour: 13 },
]

export function getReservedHours(courtId: string, date: Date): Set<number> {
  const dateStr = date.toISOString().split('T')[0]
  const reserved = new Set<number>()
  BOOKINGS
    .filter(b => b.courtId === courtId && b.date === dateStr)
    .forEach(b => {
      for (let h = b.startHour; h < b.endHour; h++) {
        reserved.add(h)
      }
    })
  return reserved
}