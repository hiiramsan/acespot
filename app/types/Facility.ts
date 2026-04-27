export type FacilityKind = 'bleacher' | 'bar' | 'room' | 'entrance'

export interface Facility {
  id: string
  label?: string
  x: number
  y: number
  w: number
  h: number
  kind: FacilityKind
  rx?: number
}