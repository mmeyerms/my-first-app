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
 * "Aquarell-Bouquet" — soft watercolor blots that progressively merge across stages.
 *
 * Visual language:
 * - Each blot is a radial-gradient ellipse-like shape with organic edges
 * - mix-blend-mode: multiply so overlapping blots create deeper saturation
 * - Splatter accent dots add character
 * - Fixed watercolor palette (warm pink, gold, lavender, peach, rose) — works
 *   on cream/white backgrounds in both themes
 *
 * The metaphor: a feeling spreading on paper, blooming with the pregnancy.
 */

// Watercolor palette
const COLORS = {
  pink: '#F4A6C8',
  rose: '#C97B92',
  gold: '#D4A574',
  lavender: '#C8B4F6',
  peach: '#FFB6C1',
  warmPink: '#E78BAA',
} as const

type ColorKey = keyof typeof COLORS

interface Blot {
  /** Organic path data (closed shape) */
  d: string
  color: ColorKey
  opacity: number
}

interface Splash {
  cx: number
  cy: number
  r: number
  color: ColorKey
  opacity: number
}

// ---------- Per-stage compositions (viewBox 0 0 120 120, center 60,60) ----------

const STAGE_BLOTS: Record<Stage, Blot[]> = {
  1: [
    {
      // tiny single drop, slightly above center
      d: 'M 60 50 C 66 49, 70 53, 70 58 C 70 64, 66 67, 60 67 C 54 67, 51 64, 51 59 C 51 53, 54 51, 60 50 Z',
      color: 'pink',
      opacity: 0.8,
    },
  ],
  2: [
    {
      // pink blot, larger, slightly left
      d: 'M 56 47 C 65 45, 71 51, 72 58 C 73 66, 67 72, 58 72 C 49 72, 44 67, 45 59 C 45 52, 49 48, 56 47 Z',
      color: 'pink',
      opacity: 0.85,
    },
    {
      // gold blot, smaller, right of pink
      d: 'M 70 56 C 76 55, 80 60, 79 66 C 79 71, 75 74, 70 73 C 65 73, 62 69, 63 64 C 64 59, 66 57, 70 56 Z',
      color: 'gold',
      opacity: 0.7,
    },
  ],
  3: [
    {
      d: 'M 52 45 C 64 42, 71 49, 72 58 C 73 67, 66 73, 56 73 C 46 73, 40 66, 42 56 C 43 50, 46 46, 52 45 Z',
      color: 'pink',
      opacity: 0.85,
    },
    {
      d: 'M 70 52 C 80 51, 84 58, 82 66 C 80 73, 73 76, 67 73 C 61 70, 60 64, 63 58 C 65 54, 67 53, 70 52 Z',
      color: 'gold',
      opacity: 0.75,
    },
    {
      d: 'M 56 70 C 64 69, 70 73, 70 78 C 70 83, 64 87, 57 86 C 50 85, 47 81, 48 76 C 49 72, 52 71, 56 70 Z',
      color: 'lavender',
      opacity: 0.65,
    },
  ],
  4: [
    {
      d: 'M 48 42 C 64 40, 73 47, 74 58 C 75 69, 67 75, 54 75 C 41 75, 36 67, 38 54 C 40 47, 43 43, 48 42 Z',
      color: 'pink',
      opacity: 0.85,
    },
    {
      d: 'M 70 48 C 84 47, 88 56, 86 67 C 84 76, 76 80, 67 77 C 58 74, 56 67, 60 58 C 63 52, 66 49, 70 48 Z',
      color: 'gold',
      opacity: 0.78,
    },
    {
      d: 'M 50 70 C 64 68, 72 75, 71 82 C 70 89, 60 92, 50 90 C 41 88, 38 83, 41 75 C 43 72, 47 70, 50 70 Z',
      color: 'lavender',
      opacity: 0.72,
    },
    {
      d: 'M 70 70 C 80 69, 84 75, 82 82 C 80 88, 74 90, 68 87 C 62 85, 61 80, 64 75 C 66 71, 68 70, 70 70 Z',
      color: 'peach',
      opacity: 0.7,
    },
  ],
  5: [
    {
      d: 'M 44 38 C 62 35, 75 44, 76 58 C 77 72, 67 78, 50 76 C 35 73, 30 64, 33 51 C 36 43, 40 39, 44 38 Z',
      color: 'pink',
      opacity: 0.88,
    },
    {
      d: 'M 70 42 C 88 42, 92 53, 89 67 C 86 79, 76 83, 65 80 C 53 76, 50 67, 56 56 C 60 48, 65 43, 70 42 Z',
      color: 'gold',
      opacity: 0.8,
    },
    {
      d: 'M 44 70 C 62 67, 73 74, 73 84 C 73 92, 60 96, 46 93 C 33 90, 29 84, 32 76 C 35 72, 40 70, 44 70 Z',
      color: 'lavender',
      opacity: 0.75,
    },
    {
      d: 'M 70 72 C 84 71, 89 78, 86 86 C 83 93, 73 95, 64 92 C 56 89, 55 83, 60 77 C 64 73, 67 72, 70 72 Z',
      color: 'peach',
      opacity: 0.72,
    },
    {
      // central focal dark accent
      d: 'M 56 53 C 66 52, 71 56, 70 62 C 69 68, 63 70, 56 68 C 49 66, 47 61, 50 56 C 52 54, 54 53, 56 53 Z',
      color: 'rose',
      opacity: 0.55,
    },
  ],
  6: [
    {
      d: 'M 40 32 C 64 28, 80 38, 80 56 C 80 74, 68 80, 46 78 C 28 75, 22 64, 26 46 C 30 36, 34 33, 40 32 Z',
      color: 'pink',
      opacity: 0.88,
    },
    {
      d: 'M 72 36 C 92 36, 96 50, 92 68 C 88 82, 76 86, 62 82 C 48 76, 46 64, 54 50 C 60 41, 66 36, 72 36 Z',
      color: 'gold',
      opacity: 0.82,
    },
    {
      d: 'M 38 70 C 60 66, 76 76, 76 88 C 76 98, 60 102, 42 98 C 26 94, 22 86, 26 78 C 30 72, 34 70, 38 70 Z',
      color: 'lavender',
      opacity: 0.78,
    },
    {
      d: 'M 72 76 C 90 76, 96 84, 92 94 C 88 102, 76 104, 64 100 C 54 96, 52 88, 60 80 C 66 76, 69 76, 72 76 Z',
      color: 'peach',
      opacity: 0.75,
    },
    {
      // central focal — deep rose center
      d: 'M 52 48 C 68 46, 76 52, 75 62 C 74 72, 64 76, 52 73 C 41 70, 38 62, 43 54 C 46 50, 49 48, 52 48 Z',
      color: 'rose',
      opacity: 0.65,
    },
  ],
}

const STAGE_SPLASHES: Record<Stage, Splash[]> = {
  1: [
    { cx: 50, cy: 50, r: 1.0, color: 'gold', opacity: 0.55 },
  ],
  2: [
    { cx: 50, cy: 47, r: 1.2, color: 'gold', opacity: 0.6 },
    { cx: 78, cy: 78, r: 1.0, color: 'rose', opacity: 0.55 },
  ],
  3: [
    { cx: 38, cy: 50, r: 1.3, color: 'rose', opacity: 0.6 },
    { cx: 82, cy: 50, r: 1.1, color: 'gold', opacity: 0.55 },
    { cx: 76, cy: 80, r: 1.0, color: 'lavender', opacity: 0.5 },
    { cx: 42, cy: 82, r: 1.2, color: 'rose', opacity: 0.55 },
  ],
  4: [
    { cx: 32, cy: 48, r: 1.4, color: 'rose', opacity: 0.6 },
    { cx: 88, cy: 50, r: 1.2, color: 'gold', opacity: 0.55 },
    { cx: 32, cy: 82, r: 1.3, color: 'lavender', opacity: 0.6 },
    { cx: 88, cy: 84, r: 1.1, color: 'rose', opacity: 0.55 },
    { cx: 60, cy: 30, r: 1.0, color: 'gold', opacity: 0.5 },
  ],
  5: [
    { cx: 28, cy: 44, r: 1.5, color: 'rose', opacity: 0.65 },
    { cx: 92, cy: 46, r: 1.3, color: 'gold', opacity: 0.6 },
    { cx: 28, cy: 84, r: 1.4, color: 'lavender', opacity: 0.6 },
    { cx: 92, cy: 86, r: 1.2, color: 'rose', opacity: 0.55 },
    { cx: 60, cy: 26, r: 1.1, color: 'gold', opacity: 0.55 },
    { cx: 60, cy: 100, r: 1.1, color: 'rose', opacity: 0.5 },
    { cx: 26, cy: 64, r: 0.9, color: 'gold', opacity: 0.5 },
  ],
  6: [
    { cx: 24, cy: 38, r: 1.6, color: 'rose', opacity: 0.7 },
    { cx: 96, cy: 40, r: 1.4, color: 'gold', opacity: 0.65 },
    { cx: 22, cy: 90, r: 1.5, color: 'lavender', opacity: 0.65 },
    { cx: 98, cy: 90, r: 1.3, color: 'rose', opacity: 0.6 },
    { cx: 60, cy: 22, r: 1.2, color: 'gold', opacity: 0.6 },
    { cx: 60, cy: 102, r: 1.2, color: 'rose', opacity: 0.55 },
    { cx: 22, cy: 60, r: 1.0, color: 'gold', opacity: 0.55 },
    { cx: 100, cy: 60, r: 1.0, color: 'lavender', opacity: 0.5 },
    { cx: 50, cy: 30, r: 0.8, color: 'rose', opacity: 0.55 },
  ],
}

// ---------- Component ----------

export function BabyIllustration({
  ssw,
  className = '',
  size = 96,
  bare = false,
}: BabyIllustrationProps) {
  const stage = getStage(ssw)
  const blots = STAGE_BLOTS[stage]
  const splashes = STAGE_SPLASHES[stage]

  // Unique gradient IDs per instance to avoid SVG <defs> collisions.
  const reactId = useId().replace(/[:]/g, '')
  const sacGrad = `sac-${reactId}`
  const gradPrefix = `wash-${reactId}`

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
          {/* Soft warm wash background */}
          <radialGradient id={sacGrad} cx="50%" cy="42%" r="65%">
            <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity="0.35" />
            <stop offset="60%" stopColor="hsl(var(--secondary))" stopOpacity="0.7" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.85" />
          </radialGradient>

          {/* One radial gradient per watercolor color: full at center, fading to transparent */}
          {(Object.keys(COLORS) as ColorKey[]).map((key) => (
            <radialGradient
              key={key}
              id={`${gradPrefix}-${key}`}
              cx="40%"
              cy="40%"
              r="60%"
            >
              <stop offset="0%" stopColor={COLORS[key]} stopOpacity="0.95" />
              <stop offset="55%" stopColor={COLORS[key]} stopOpacity="0.55" />
              <stop offset="100%" stopColor={COLORS[key]} stopOpacity="0.05" />
            </radialGradient>
          ))}
        </defs>

        {/* Vessel background (soft warm wash) */}
        {!bare && (
          <>
            <circle cx="60" cy="60" r="56" fill={`url(#${sacGrad})`} />
            <circle
              cx="60"
              cy="60"
              r="55.2"
              stroke="hsl(var(--primary) / 0.18)"
              strokeWidth="0.85"
              fill="none"
            />
          </>
        )}

        {/* Watercolor blots — multiply blend so overlapping deepens */}
        <g style={{ mixBlendMode: 'multiply' }}>
          {blots.map((b, i) => (
            <path
              key={i}
              d={b.d}
              fill={`url(#${gradPrefix}-${b.color})`}
              opacity={b.opacity}
            />
          ))}
        </g>

        {/* Splatter accent dots */}
        <g>
          {splashes.map((s, i) => (
            <circle
              key={i}
              cx={s.cx}
              cy={s.cy}
              r={s.r}
              fill={COLORS[s.color]}
              opacity={s.opacity}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}
