export interface PendingBooking {
  courtId: string
  courtLabel: string
  courtType: string
  date: string        // ISO string "YYYY-MM-DD"
  startHour: number
  endHour: number     // exclusive (endHour = selectedRange.end + 1)
  totalPrice: number  // in dollars (converted to cents before hitting the API)
  pricePerSlot: number
}