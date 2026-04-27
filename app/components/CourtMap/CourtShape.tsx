'use client'

import { useState } from 'react'
import { CourtLinesLayer } from './CourtLinesLayer'
import { Court } from '@/app/types/Court';

// ── Palette — tennis-only complex ────────────────────────────────────────────
const PALETTE: Record<string, { fill: string; stroke: string; hover: string; inner: string; label: string }> = {
  tennis: { fill: '#daeeff', stroke: '#1976d2', hover: '#b8dcf8', inner: '#5aabf0', label: '#0d47a1' },
  clay: { fill: '#ffecd6', stroke: '#e07020', hover: '#ffd8b0', inner: '#f0a060', label: '#b84000' },
  reserved: { fill: '#f5f0e2', stroke: '#c9a227', hover: '#f5f0e2', inner: '#ddb840', label: '#6b4e10' },
  tennis_selected: { fill: '#60aaee', stroke: '#0d47a1', hover: '#60aaee', inner: '#1976d2', label: '#ffffff' },
  clay_selected: { fill: '#f09050', stroke: '#8d2f00', hover: '#f09050', inner: '#c05820', label: '#ffffff' },
}




interface Props {
  court: Court
  isSelected: boolean
  onClick: (court: Court) => void
  wasLastInteractionPan?: () => boolean
  resetPanFlag?: () => void
}

export function CourtShape({ court, isSelected, onClick, wasLastInteractionPan, resetPanFlag }: Props) {
  const [hovered, setHovered] = useState(false)

  const clickable = court.status === 'available'
  const palKey = isSelected ? `${court.variant}_selected` : court.variant
  const pal = PALETTE[palKey] ?? PALETTE.tennis
  const fill = hovered && clickable ? pal.hover : pal.fill

  const { x, y, w, h } = court

  const handleClick = () => {
    if (wasLastInteractionPan?.()) {
      resetPanFlag?.()
      return
    }
    if (clickable) {
      onClick(court)
    }
    resetPanFlag?.()
  }

  return (
    <g
      onClick={handleClick}
      onMouseEnter={() => clickable && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: clickable ? 'pointer' : 'default' }}
    >
      {/* Hover shadow */}
      {hovered && clickable && (
        <rect x={x + 3} y={y + 5} width={w} height={h} rx={12} fill="rgba(0,0,0,0.08)" />
      )}

      {/* Court surface */}
      <rect
        x={x} y={y} width={w} height={h}
        rx={12}
        fill={fill}
        stroke={pal.stroke}
        strokeWidth={isSelected ? 2.5 : 1.5}
        style={{ transition: 'fill 0.15s ease' }}
      />

      {/* Tennis court lines */}
      {(court.status === 'available') && (
        <CourtLinesLayer x={x} y={y} w={w} h={h} lines={court.lines} color={pal.inner} />
      )}

      {/* Court name badge - top-left */}
      <LabelBadge x={x + 10} y={y + 10} text={court.label} fill={pal.stroke} />

      {/* RESERVED badge - top-right */}
      {court.status === 'closed' && (
        <LabelBadge x={x + w - 10} y={y + 10} text="CLOSED" fill="#c9a227" alignRight />
      )}

      {/* Selected checkmark */}
      {isSelected && (
        <g>
          <circle cx={x + w - 20} cy={y + 20} r={11} fill={PALETTE[`${court.variant}_selected`].stroke} />
          <path
            d={`M ${x + w - 26} ${y + 20} l 4 4 l 8 -8`}
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      )}
    </g>
  )
}

function LabelBadge({
  x, y, text, fill, alignRight = false,
}: {
  x: number; y: number; text: string; fill: string; alignRight?: boolean
}) {
  const charW = 7.5
  const bw = text.length * charW + 18
  const bh = 22
  const bx = alignRight ? x - bw : x
  return (
    <g>
      <rect x={bx} y={y} width={bw} height={bh} rx={6} fill={fill} opacity={0.92} />
      <text
        x={bx + bw / 2} y={y + 15}
        textAnchor="middle"
        fontSize={11} fontWeight={500}
        fill="white"
        fontFamily="'Inter', 'SF Pro Display', system-ui, sans-serif"
        letterSpacing={0.8}
      >
        {text.toUpperCase()}
      </text>
    </g>
  )
}