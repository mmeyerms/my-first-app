'use client'

import { useId } from 'react'
import { cn } from '@/lib/utils'

interface BabyIllustrationProps {
  ssw: number
  className?: string
  size?: number
  /** When true, renders without the soft amniotic-sac background — for hero contexts. */
  bare?: boolean
}

type Stage = 1 | 2 | 3 | 4 | 5 | 6

function getStage(ssw: number): Stage {
  if (ssw <= 7) return 1
  if (ssw <= 12) return 2
  if (ssw <= 19) return 3
  if (ssw <= 27) return 4
  if (ssw <= 34) return 5
  return 6
}

/**
 * "Blühendes Licht" — a poetic abstract metaphor for pregnancy.
 *
 * Visual language:
 * - A warm luminous orb at the center (the soul / the becoming life)
 * - Around it: stylized petal-strokes that progressively unfold across stages
 * - Floating accent stars (more presence as life grows)
 * - Soft halo glow that intensifies through the stages
 *
 * No anatomy. No body parts. Just light, blooming. Editorial, calm,
 * emotionally resonant — the kind of image that makes you smile each time.
 */

// Per-stage parameters
const ORB_RADIUS: Record<Stage, number> = {
  1: 4,
  2: 7,
  3: 10,
  4: 14,
  5: 18,
  6: 22,
}

const HALO_RADIUS: Record<Stage, number> = {
  1: 12,
  2: 18,
  3: 26,
  4: 34,
  5: 42,
  6: 50,
}

// Petal positions (angle in degrees, 0 = up). Length is relative.
type Petal = { angle: number; length: number; opacity: number; curve?: number }

const PETALS_PER_STAGE: Record<Stage, Petal[]> = {
  1: [
    // Just one whispered hint above
    { angle: 0, length: 6, opacity: 0.5 },
  ],
  2: [
    { angle: -15, length: 9, opacity: 0.6 },
    { angle: 200, length: 7, opacity: 0.5 },
  ],
  3: [
    { angle: 0, length: 11, opacity: 0.7 },
    { angle: 90, length: 10, opacity: 0.65 },
    { angle: 180, length: 11, opacity: 0.7 },
    { angle: 270, length: 10, opacity: 0.65 },
  ],
  4: [
    { angle: 0, length: 14, opacity: 0.75 },
    { angle: 60, length: 13, opacity: 0.7 },
    { angle: 120, length: 14, opacity: 0.75 },
    { angle: 180, length: 13, opacity: 0.7 },
    { angle: 240, length: 14, opacity: 0.75 },
    { angle: 300, length: 13, opacity: 0.7 },
  ],
  5: [
    { angle: 0, length: 18, opacity: 0.8 },
    { angle: 45, length: 14, opacity: 0.65 },
    { angle: 90, length: 17, opacity: 0.78 },
    { angle: 135, length: 14, opacity: 0.65 },
    { angle: 180, length: 18, opacity: 0.8 },
    { angle: 225, length: 14, opacity: 0.65 },
    { angle: 270, length: 17, opacity: 0.78 },
    { angle: 315, length: 14, opacity: 0.65 },
  ],
  6: [
    // Lush full bloom: 8 long petals + 8 short between them
    { angle: 0, length: 23, opacity: 0.85 },
    { angle: 22.5, length: 16, opacity: 0.5 },
    { angle: 45, length: 21, opacity: 0.8 },
    { angle: 67.5, length: 16, opacity: 0.5 },
    { angle: 90, length: 23, opacity: 0.85 },
    { angle: 112.5, length: 16, opacity: 0.5 },
    { angle: 135, length: 21, opacity: 0.8 },
    { angle: 157.5, length: 16, opacity: 0.5 },
    { angle: 180, length: 23, opacity: 0.85 },
    { angle: 202.5, length: 16, opacity: 0.5 },
    { angle: 225, length: 21, opacity: 0.8 },
    { angle: 247.5, length: 16, opacity: 0.5 },
    { angle: 270, length: 23, opacity: 0.85 },
    { angle: 292.5, length: 16, opacity: 0.5 },
    { angle: 315, length: 21, opacity: 0.8 },
    { angle: 337.5, length: 16, opacity: 0.5 },
  ],
}

// Floating accent stars per stage
type Star = { cx: number; cy: number; r: number; opacity: number }
const STARS_PER_STAGE: Record<Stage, Star[]> = {
  1: [
    { cx: 32, cy: 28, r: 0.8, opacity: 0.5 },
  ],
  2: [
    { cx: 32, cy: 28, r: 0.9, opacity: 0.6 },
    { cx: 88, cy: 38, r: 0.7, opacity: 0.5 },
  ],
  3: [
    { cx: 28, cy: 30, r: 1.0, opacity: 0.65 },
    { cx: 92, cy: 36, r: 0.8, opacity: 0.55 },
    { cx: 30, cy: 92, r: 0.7, opacity: 0.5 },
  ],
  4: [
    { cx: 24, cy: 28, r: 1.1, opacity: 0.7 },
    { cx: 96, cy: 30, r: 0.9, opacity: 0.6 },
    { cx: 26, cy: 96, r: 0.8, opacity: 0.55 },
    { cx: 100, cy: 92, r: 1.0, opacity: 0.65 },
  ],
  5: [
    { cx: 22, cy: 26, r: 1.2, opacity: 0.75 },
    { cx: 100, cy: 28, r: 1.0, opacity: 0.65 },
    { cx: 24, cy: 100, r: 0.9, opacity: 0.6 },
    { cx: 102, cy: 96, r: 1.1, opacity: 0.7 },
    { cx: 60, cy: 14, r: 0.7, opacity: 0.5 },
  ],
  6: [
    { cx: 20, cy: 22, r: 1.3, opacity: 0.8 },
    { cx: 102, cy: 22, r: 1.1, opacity: 0.7 },
    { cx: 18, cy: 102, r: 1.0, opacity: 0.65 },
    { cx: 104, cy: 100, r: 1.2, opacity: 0.75 },
    { cx: 60, cy: 10, r: 0.9, opacity: 0.6 },
    { cx: 60, cy: 110, r: 0.9, opacity: 0.6 },
  ],
}

const CENTER_X = 60
const CENTER_Y = 60

/** Build a smooth petal-stroke path that radiates from the orb edge outward. */
function buildPetalPath(
  angleDeg: number,
  startRadius: number,
  length: number,
): string {
  const rad = (angleDeg - 90) * (Math.PI / 180) // -90 so 0deg points UP
  const startX = CENTER_X + Math.cos(rad) * startRadius
  const startY = CENTER_Y + Math.sin(rad) * startRadius
  const endX = CENTER_X + Math.cos(rad) * (startRadius + length)
  const endY = CENTER_Y + Math.sin(rad) * (startRadius + length)

  // Slight perpendicular offset for graceful curve
  const perpX = -Math.sin(rad)
  const perpY = Math.cos(rad)
  const ctrlOffset = length * 0.18
  const ctrl1X = startX + Math.cos(rad) * length * 0.35 + perpX * ctrlOffset
  const ctrl1Y = startY + Math.sin(rad) * length * 0.35 + perpY * ctrlOffset
  const ctrl2X = endX - Math.cos(rad) * length * 0.15 - perpX * ctrlOffset * 0.5
  const ctrl2Y = endY - Math.sin(rad) * length * 0.15 - perpY * ctrlOffset * 0.5

  return `M ${startX.toFixed(2)} ${startY.toFixed(2)} C ${ctrl1X.toFixed(2)} ${ctrl1Y.toFixed(2)}, ${ctrl2X.toFixed(2)} ${ctrl2Y.toFixed(2)}, ${endX.toFixed(2)} ${endY.toFixed(2)}`
}

export function BabyIllustration({
  ssw,
  className = '',
  size = 96,
  bare = false,
}: BabyIllustrationProps) {
  const stage = getStage(ssw)
  const orbR = ORB_RADIUS[stage]
  const haloR = HALO_RADIUS[stage]
  const petals = PETALS_PER_STAGE[stage]
  const stars = STARS_PER_STAGE[stage]

  const reactId = useId().replace(/[:]/g, '')
  const sacGrad = `sac-${reactId}`
  const orbGrad = `orb-${reactId}`
  const haloGrad = `halo-${reactId}`

  // Highlight position (top-left of orb)
  const highlightX = CENTER_X - orbR * 0.32
  const highlightY = CENTER_Y - orbR * 0.32
  const highlightR = Math.max(1, orbR * 0.22)

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center',
        !bare && 'rounded-full',
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 120 120"
        width={size}
        height={size}
        fill="none"
      >
        <defs>
          {/* Amniotic sac — soft warm wash */}
          <radialGradient id={sacGrad} cx="50%" cy="42%" r="65%">
            <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity="0.35" />
            <stop offset="60%" stopColor="hsl(var(--secondary))" stopOpacity="0.7" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.85" />
          </radialGradient>

          {/* Orb — luminous warm core */}
          <radialGradient id={orbGrad} cx="38%" cy="35%" r="70%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.95" />
            <stop offset="55%" stopColor="hsl(var(--primary))" stopOpacity="0.85" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
          </radialGradient>

          {/* Halo — gentle outer glow around orb (intensifies with stage) */}
          <radialGradient id={haloGrad} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.22" />
            <stop offset="60%" stopColor="hsl(var(--primary))" stopOpacity="0.08" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Amniotic sac vessel */}
        {!bare && (
          <>
            <circle cx={CENTER_X} cy={CENTER_Y} r="56" fill={`url(#${sacGrad})`} />
            <circle
              cx={CENTER_X}
              cy={CENTER_Y}
              r="55.2"
              stroke="hsl(var(--primary) / 0.18)"
              strokeWidth="0.85"
              fill="none"
            />
          </>
        )}

        {/* Halo */}
        <circle cx={CENTER_X} cy={CENTER_Y} r={haloR} fill={`url(#${haloGrad})`} />

        {/* Petal strokes */}
        <g>
          {petals.map((p, i) => (
            <path
              key={i}
              d={buildPetalPath(p.angle, orbR + 1.5, p.length)}
              stroke="hsl(var(--primary))"
              strokeOpacity={p.opacity}
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />
          ))}
        </g>

        {/* For Stage 6: add a delicate inner ring for fullness */}
        {stage === 6 && (
          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r={orbR + 6}
            stroke="hsl(var(--accent))"
            strokeOpacity="0.45"
            strokeWidth="0.7"
            fill="none"
            strokeDasharray="1.8 2.2"
          />
        )}

        {/* Soft ring just outside orb (subtle depth) */}
        {stage >= 4 && (
          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r={orbR + 2.5}
            fill="none"
            stroke="hsl(var(--primary) / 0.12)"
            strokeWidth="0.6"
          />
        )}

        {/* Main luminous orb */}
        <circle cx={CENTER_X} cy={CENTER_Y} r={orbR} fill={`url(#${orbGrad})`} />

        {/* Subtle outer stroke on orb */}
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={orbR}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeOpacity="0.6"
          strokeWidth="0.6"
        />

        {/* Highlight dot on orb — gives it warmth and dimension */}
        <circle
          cx={highlightX}
          cy={highlightY}
          r={highlightR}
          fill="white"
          opacity={0.4}
        />

        {/* Floating accent stars (champagne gold) */}
        {stars.map((s, i) => (
          <g key={i}>
            <circle
              cx={s.cx}
              cy={s.cy}
              r={s.r * 2.5}
              fill="hsl(var(--accent))"
              opacity={s.opacity * 0.18}
            />
            <circle
              cx={s.cx}
              cy={s.cy}
              r={s.r}
              fill="hsl(var(--accent))"
              opacity={s.opacity}
            />
          </g>
        ))}
      </svg>
    </div>
  )
}
