import { Court } from "../types/Court"
import { Facility } from "../types/Facility"

export const MAP_WIDTH = 1100
export const MAP_HEIGHT = 720

export const COURTS: Court[] = [
  {
    id: 'hard-1',
    label: 'Hard Court 1',
    type: 'Hard',
    x: 505, y: 140, w: 155, h: 235,
    status: 'available',
    variant: 'tennis',
    pricePerSlot: 10,
    lines: 'tennis',
  },
  {
    id: 'hard-2',
    label: 'Hard Court 2',
    type: 'Hard',
    x: 675, y: 140, w: 155, h: 235,
    status: 'available',
    variant: 'tennis',
    pricePerSlot: 10,
    lines: 'tennis',
  },
  {
    id: 'hard-3',
    label: 'Hard Court 3',
    type: 'Hard',
    x: 505, y: 400, w: 155, h: 235,
    status: 'available',
    variant: 'tennis',
    pricePerSlot: 10,
    lines: 'tennis',
  },
  {
    id: 'hard-4',
    label: 'Hard Court 4',
    type: 'Hard',
    x: 675, y: 400, w: 155, h: 235,
    status: 'available',
    variant: 'tennis',
    pricePerSlot: 10,
    lines: 'tennis',
  },
  {
    id: 'clay-1',
    label: 'Clay Court 1',
    type: 'Clay',
    x: 845, y: 140, w: 150, h: 235,
    status: 'available',
    variant: 'clay',
    pricePerSlot: 10,
    lines: 'tennis',
  },
  {
    id: 'clay-2',
    label: 'Clay Court 2',
    type: 'Clay',
    x: 845, y: 400, w: 150, h: 235,
    status: 'available',
    variant: 'clay',
    pricePerSlot: 10,
    lines: 'tennis',
  },
]

export const FACILITIES: Facility[] = [
  { id: 'bleacher-top', x: 505, y: 90, w: 490, h: 38, kind: 'bleacher', rx: 10, label: 'Stands' },
  { id: 'bleacher-bottom', x: 505, y: 650, w: 490, h: 38, kind: 'bleacher', rx: 10, label: 'Stands' },
  { id: 'snack-bar', label: 'Snack Bar', x: 348, y: 140, w: 132, h: 145, kind: 'bar', rx: 12 },
  { id: 'bathrooms', label: 'Showers/Restrooms', x: 348, y: 492, w: 132, h: 143, kind: 'room', rx: 12 },
  { id: 'entrance', x: 334, y: 348, w: 20, h: 84, kind: 'entrance', rx: 6 },
]