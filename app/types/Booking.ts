export interface Booking {
  id: string
  court_id: string
  customer_id: string
  date: string
  start_hour: number
  end_hour: number
  booking_code: string
  total_price: number
}