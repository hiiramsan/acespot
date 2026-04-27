'use client'

import { COURTS, FACILITIES, MAP_HEIGHT, MAP_WIDTH } from '@/app/data/courts'
import { useMapPanZoom } from '@/app/hooks/useMapPanZoom'
import { useState, useCallback } from 'react'
import { CourtShape } from './CourtShape'
import { BookingSidebar } from './BookingSidebar'
import { Court } from '@/app/types/Court'
import { MapControls } from './MapControl'
import { Facility } from '@/app/types/Facility'

interface Props {
  height?: number | string
  onBook?: (court: Court, slotIds: string[]) => void
  courts?: Court[]
}

const FACILITY_STYLE: Record<Facility['kind'], {
  fill: string; stroke: string; textFill: string; dashArray?: string
}> = {
  bleacher: { fill: '#d6d0c4', stroke: '#a09880', textFill: '#6b6050', dashArray: '5 3' },
  bar: { fill: '#fff9e6', stroke: '#c9a227', textFill: '#7a5c10', dashArray: '5 3' },
  room: { fill: '#fff9e6', stroke: '#c9a227', textFill: '#7a5c10', dashArray: '5 3' },
  entrance: { fill: '#c8c8c4', stroke: '#888880', textFill: '#444' },
}

export function CourtMap({ height = '100vh', onBook, courts = COURTS }: Props) {
  const { canvasRef, zoomIn, zoomOut, reset, wasLastInteractionPan, resetPanFlag } = useMapPanZoom()
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null)

  const handleCourtClick = useCallback((court: Court) => {
    console.log(`${court.label} selected`)
    setSelectedCourt(court)
  }, [])

  return (
    <div style={{ display: 'flex', height: height || '100vh', overflow: 'hidden', position: 'relative' }}>

      <div
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          cursor: 'grab',
        }}
      >
        <div
          ref={canvasRef}
          style={{ position: 'absolute', top: 0, left: 0, transformOrigin: '0 0', willChange: 'transform' }}
        >
          <svg
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            xmlns="http://www.w3.org/2000/svg"
          >
           
            {FACILITIES.map(f => {
              const s = FACILITY_STYLE[f.kind]
              return (
                <g key={f.id} style={{ pointerEvents: 'none' }}>
                  <rect
                    x={f.x} y={f.y} width={f.w} height={f.h}
                    rx={f.rx ?? 10}
                    fill={s.fill}
                    stroke={s.stroke}
                    strokeWidth={1.5}
                    strokeDasharray={s.dashArray}
                  />

                  {f.kind === 'entrance' ? (
                    <>
                      <text
                        x={f.x + f.w / 2} y={f.y - 5}
                        textAnchor="middle"
                        fontSize={9} fontWeight={600}
                        fill={s.textFill}
                        fontFamily="system-ui, sans-serif"
                        letterSpacing={0.4}
                      >
                        ENTRANCE
                      </text>
                    </>
                  ) : f.label ? (
                    <text
                      x={f.x + f.w / 2}
                      y={f.y + f.h / 2 + 4}
                      textAnchor="middle"
                      fontSize={11}
                      fontWeight={600}
                      fill={s.textFill}
                      fontFamily="system-ui, sans-serif"
                      letterSpacing={0.3}
                    >
                      {f.label}
                    </text>
                  ) : null}
                </g>
              )
            })}

            {courts.map(court => (
              <CourtShape
                key={court.id}
                court={court}
                isSelected={selectedCourt?.id === court.id}
                onClick={handleCourtClick}
                wasLastInteractionPan={wasLastInteractionPan}
                resetPanFlag={resetPanFlag}
              />
            ))}
          </svg>
        </div>
        <MapControls zoomIn={zoomIn} zoomOut={zoomOut} reset={reset} />
      </div>

      <BookingSidebar
        court={selectedCourt}
        onClose={() => setSelectedCourt(null)}
      />
    </div>
  )
}