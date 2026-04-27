import { CourtLines } from '@/app/types/Court'

interface Props {
  x: number
  y: number
  w: number
  h: number
  lines: CourtLines
  color: string
}

/**
 * Accurate tennis court lines — portrait orientation (taller than wide).
 *
 * Real tennis court proportions: 23.77m long × 10.97m wide (doubles)
 * Singles sidelines are 1.37m inside the doubles sideline on each side.
 * Service line is 6.40m from the net on each side (out of 11.885m half).
 * Net sits at the exact vertical midpoint of the court.
 */
export function CourtLinesLayer({ x, y, w, h, lines, color }: Props) {
  if (lines !== 'tennis') return null

  // ── Out-of-bounds buffer (space outside the court lines) ─────────────────
  const mx = w * 0.07  // horizontal margin
  const my = h * 0.06  // vertical margin

  // Doubles court boundary
  const left   = x + mx
  const right  = x + w - mx
  const top    = y + my
  const bottom = y + h - my
  const cw     = right - left
  const ch     = bottom - top

  // Singles sidelines — 1.37m inset on each side of a 10.97m-wide court ≈ 12.5%
  const singleInset  = cw * 0.125
  const singlesLeft  = left + singleInset
  const singlesRight = right - singleInset

  // Net: horizontal midline
  const netY = top + ch / 2

  // Service line: 6.40m / 11.885m ≈ 53.8% from net toward each baseline
  const svcRatio      = 0.538
  const serviceTop    = netY - (ch / 2) * svcRatio
  const serviceBottom = netY + (ch / 2) * svcRatio

  // Center service line x
  const centerX = left + cw / 2

  const sw = Math.max(0.8, Math.min(w, h) * 0.011)

  return (
    <g stroke={color} strokeWidth={sw} fill="none" opacity={0.8} strokeLinecap="square">
      {/* Doubles boundary */}
      <rect x={left} y={top} width={cw} height={ch} />

      {/* Singles sidelines */}
      <line x1={singlesLeft}  y1={top} x2={singlesLeft}  y2={bottom} />
      <line x1={singlesRight} y1={top} x2={singlesRight} y2={bottom} />

      {/* Net — slightly thicker */}
      <line x1={left} y1={netY} x2={right} y2={netY} strokeWidth={sw} />

      {/* Service lines */}
      <line x1={singlesLeft} y1={serviceTop}    x2={singlesRight} y2={serviceTop} />
      <line x1={singlesLeft} y1={serviceBottom} x2={singlesRight} y2={serviceBottom} />

      {/* Center service line (net to each service line) */}
      <line x1={centerX} y1={serviceTop}    x2={centerX} y2={netY} />
      <line x1={centerX} y1={netY}          x2={centerX} y2={serviceBottom} />

      {/* Center baseline marks */}
      <line x1={centerX} y1={top}    x2={centerX} y2={top    + ch * 0.022} />
      <line x1={centerX} y1={bottom} x2={centerX} y2={bottom - ch * 0.022} />
    </g>
  )
}