import { Facility } from "../types/Facility";

export const FACILITY_STYLE: Record<Facility['kind'], {
  fill: string; stroke: string; textFill: string; dashArray?: string
}> = {
  bleacher: { fill: '#d6d0c4', stroke: '#a09880', textFill: '#6b6050', dashArray: '5 3' },
  bar: { fill: '#fff9e6', stroke: '#c9a227', textFill: '#7a5c10', dashArray: '5 3' },
  room: { fill: '#fff9e6', stroke: '#c9a227', textFill: '#7a5c10', dashArray: '5 3' },
  entrance: { fill: '#c8c8c4', stroke: '#888880', textFill: '#444' },
}