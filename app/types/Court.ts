export type CourtStatus  = 'available' | 'closed'
export type CourtLines   = 'tennis'
export type CourtVariant = 'tennis' | 'clay' | 'reserved' | 'selected'

export interface TimeSlot {
  id: string
  label: string
  reserved: boolean
}

export interface Court {
  id: string
  label: string
  type: string
  x: number
  y: number
  w: number
  h: number
  status: CourtStatus
  variant: CourtVariant
  pricePerSlot: number
  lines: CourtLines
}