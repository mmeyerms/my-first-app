'use client'

import { useId } from 'react'
import { cn } from '@/lib/utils'

interface BabyIllustrationProps {
  ssw: number
  className?: string
  size?: number
  /** When true, renders without the soft circular background — for hero contexts. */
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

// Inner orb radius per stage (viewBox is 0..96, womb radius is ~40).
const ORB_RADIUS: Record<Stage, number> = {
  1: 4.5,
  2: 9,
  3: 14,
  4: 19,
  5: 24,
  6: 30,
}

// Floating accent dots — more presence in later stages.
const ACCENT_POSITIONS: Array<{ cx: number; cy: number; r: number; opacity: number }> = [
  { cx: 22, cy: 26, r: 1.0, opacity: 0.8 },
  { cx: 76, cy: 24, r: 0.8, opacity: 0.7 },
  { cx: 18, cy: 70, r: 0.7, opacity: 0.6 },
  { cx: 80, cy: 68, r: 0.9, opacity: 0.7 },
  { cx: 50, cy: 14, r: 0.6, opacity: 0.55 },
  { cx: 50, cy: 82, r: 0.6, opacity: 0.55 },
]

const DOT_COUNT_PER_STAGE: Record<Stage, number> = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
}

export function BabyIllustration({
  ssw,
  className = '',
  size = 96,
  bare = false,
}: BabyIllustrationProps) {
  const stage = getStage(ssw)
  const radius = ORB_RADIUS[stage]
  const dotCount = DOT_COUNT_PER_STAGE[stage]
  const dots = ACCENT_POSITIONS.slice(0, dotCount)

  // Unique gradient IDs per instance to avoid SVG <defs> collisions.
  const reactId = useId().replace(/[:]/g, '')
  const wombGrad = `womb-${reactId}`
  const orbGrad = `orb-${reactId}`
  const haloGrad = `halo-${reactId}`

  // Highlight position (top-left of orb)
  const highlightX = 48 - radius * 0.32
  const highlightY = 48 - radius * 0.32
  const highlightR = Math.max(1, radius * 0.22)

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
        viewBox="0 0 96 96"
        width={size}
        height={size}
        fill="none"
      >
        <defs>
          {/* Womb (vessel) — soft warm wash */}
          <radialGradient id={wombGrad} cx="50%" cy="42%" r="65%">
            <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity="0.35" />
            <stop offset="60%" stopColor="hsl(var(--secondary))" stopOpacity="0.7" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.85" />
          </radialGradient>

          {/* Orb (life) — radial gradient from warm core */}
          <radialGradient id={orbGrad} cx="40%" cy="38%" r="65%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.95" />
            <stop offset="55%" stopColor="hsl(var(--primary))" stopOpacity="0.85" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.65" />
          </radialGradient>

          {/* Halo — gentle outer glow around orb */}
          <radialGradient id={haloGrad} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.18" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Womb vessel */}
        {!bare && (
          <>
            <circle cx="48" cy="48" r="44" fill={`url(#${wombGrad})`} />
            <circle
              cx="48"
              cy="48"
              r="43.25"
              stroke="hsl(var(--primary) / 0.18)"
              strokeWidth="0.75"
              fill="none"
            />
          </>
        )}

        {/* Halo behind orb */}
        <circle cx="48" cy="48" r={radius + 10} fill={`url(#${haloGrad})`} />

        {/* Soft ring (faint) around orb */}
        <circle
          cx="48"
          cy="48"
          r={radius + 4.5}
          fill="none"
          stroke="hsl(var(--primary) / 0.12)"
          strokeWidth="0.6"
        />

        {/* Main orb */}
        <circle cx="48" cy="48" r={radius} fill={`url(#${orbGrad})`} />

        {/* Subtle outer stroke on orb */}
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeOpacity="0.55"
          strokeWidth="0.6"
        />

        {/* Highlight on orb (gives it dimension) */}
        <circle
          cx={highlightX}
          cy={highlightY}
          r={highlightR}
          fill="white"
          opacity={0.35}
        />

        {/* Accent dots — stars of life floating in the womb */}
        {dots.map((d, i) => (
          <circle
            key={i}
            cx={d.cx}
            cy={d.cy}
            r={d.r}
            fill="hsl(var(--accent))"
            opacity={d.opacity}
          />
        ))}
      </svg>
    </div>
  )
}
