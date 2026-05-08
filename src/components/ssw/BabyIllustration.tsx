'use client'

import type { ReactElement } from 'react'
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

const COMMON_PROPS = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 96 96',
  fill: 'none',
} as const

const STROKE = 'hsl(var(--primary))'
const SOFT_FILL = 'hsl(var(--primary) / 0.12)'
const ACCENT_FILL = 'hsl(var(--primary) / 0.22)'
const BG_FILL = 'hsl(var(--secondary) / 0.55)'

function Background({ bare }: { bare: boolean }) {
  if (bare) return null
  return (
    <>
      <circle cx="48" cy="48" r="44" fill={BG_FILL} />
      <circle
        cx="48"
        cy="48"
        r="43.25"
        stroke="hsl(var(--primary) / 0.18)"
        strokeWidth="0.75"
      />
    </>
  )
}

/** Stage 1: SSW 4–7 — embryonic blob, just a hint of life. */
function Stage1({ size, bare }: { size: number; bare: boolean }) {
  return (
    <svg width={size} height={size} {...COMMON_PROPS} aria-hidden="true">
      <Background bare={bare} />
      {/* Tiny embryonic teardrop */}
      <path
        d="M48 38 C 53 40, 55 47, 52 54 C 50 58, 46 58, 44 54 C 41 47, 43 40, 48 38 Z"
        fill={SOFT_FILL}
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      {/* Inner hint of cell mass */}
      <circle cx="47.5" cy="47" r="2" fill={ACCENT_FILL} />
    </svg>
  )
}

/** Stage 2: SSW 8–12 — C-shape embryo with bigger head and limb buds. */
function Stage2({ size, bare }: { size: number; bare: boolean }) {
  return (
    <svg width={size} height={size} {...COMMON_PROPS} aria-hidden="true">
      <Background bare={bare} />
      {/* Body curve, comma-shape */}
      <path
        d="M58 32 C 68 36, 70 50, 60 58 C 53 63, 44 64, 38 60 C 33 56, 33 49, 38 44 C 44 38, 52 33, 58 32 Z"
        fill={SOFT_FILL}
        stroke={STROKE}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Tail/spine hint */}
      <path
        d="M40 60 C 38 64, 39 68, 42 70"
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* Limb bud */}
      <circle cx="60" cy="56" r="2.5" fill={ACCENT_FILL} stroke={STROKE} strokeWidth="0.9" />
      {/* Eye spot */}
      <circle cx="56" cy="42" r="1.4" fill={STROKE} />
    </svg>
  )
}

/** Stage 3: SSW 13–19 — recognizable fetus, curled, hands near face. */
function Stage3({ size, bare }: { size: number; bare: boolean }) {
  return (
    <svg width={size} height={size} {...COMMON_PROPS} aria-hidden="true">
      <Background bare={bare} />
      {/* Head */}
      <circle
        cx="44"
        cy="38"
        r="13"
        fill={SOFT_FILL}
        stroke={STROKE}
        strokeWidth="1.5"
      />
      {/* Curled body */}
      <path
        d="M52 48 C 64 50, 68 60, 60 68 C 52 76, 40 74, 36 64 C 33 56, 38 50, 46 48"
        fill={SOFT_FILL}
        stroke={STROKE}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Tucked leg hint */}
      <path
        d="M58 64 C 56 70, 50 72, 46 70"
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Hand near face */}
      <circle cx="36" cy="44" r="2.6" fill={ACCENT_FILL} stroke={STROKE} strokeWidth="0.9" />
      {/* Profile suggestion */}
      <path
        d="M34 36 C 32 37, 32 40, 34 41"
        stroke={STROKE}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Eye */}
      <circle cx="42" cy="36" r="1.2" fill={STROKE} />
    </svg>
  )
}

/** Stage 4: SSW 20–27 — fetus with thumb-sucking pose, more proportional. */
function Stage4({ size, bare }: { size: number; bare: boolean }) {
  return (
    <svg width={size} height={size} {...COMMON_PROPS} aria-hidden="true">
      <Background bare={bare} />
      {/* Head — slightly smaller than body */}
      <circle
        cx="42"
        cy="36"
        r="13.5"
        fill={SOFT_FILL}
        stroke={STROKE}
        strokeWidth="1.5"
      />
      {/* Body curled */}
      <path
        d="M52 46 C 66 48, 70 60, 64 70 C 58 78, 44 78, 38 70 C 34 64, 36 56, 42 50"
        fill={SOFT_FILL}
        stroke={STROKE}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Tucked legs — two soft curves */}
      <path
        d="M60 68 C 58 74, 54 76, 50 74"
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M56 70 C 54 76, 49 78, 45 76"
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Arm crossing up to mouth */}
      <path
        d="M48 56 C 42 52, 36 48, 34 42"
        stroke={STROKE}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Thumb / hand */}
      <circle cx="34" cy="40" r="3" fill={ACCENT_FILL} stroke={STROKE} strokeWidth="1" />
      {/* Profile */}
      <path
        d="M30 36 C 28 38, 28 40, 30 42"
        stroke={STROKE}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Eye (closed line) */}
      <path
        d="M38 35 L 42 35"
        stroke={STROKE}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Soft cheek */}
      <circle cx="40" cy="42" r="1.4" fill="hsl(var(--primary) / 0.32)" />
    </svg>
  )
}

/** Stage 5: SSW 28–34 — chubbier, eyes closed, fuller face, hint of hair. */
function Stage5({ size, bare }: { size: number; bare: boolean }) {
  return (
    <svg width={size} height={size} {...COMMON_PROPS} aria-hidden="true">
      <Background bare={bare} />
      {/* Rounder head */}
      <circle
        cx="44"
        cy="36"
        r="15"
        fill={SOFT_FILL}
        stroke={STROKE}
        strokeWidth="1.5"
      />
      {/* Hair tuft */}
      <path
        d="M34 28 C 38 22, 50 22, 56 28"
        stroke={STROKE}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M40 25 C 42 22, 48 22, 50 25"
        stroke={STROKE}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Body — chubbier */}
      <path
        d="M55 48 C 70 50, 74 64, 66 74 C 58 82, 42 82, 36 74 C 32 68, 34 58, 42 52"
        fill={SOFT_FILL}
        stroke={STROKE}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Tucked legs */}
      <path
        d="M60 70 C 58 78, 52 80, 48 78"
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M56 74 C 54 80, 48 82, 44 80"
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Arm */}
      <path
        d="M48 56 C 42 54, 36 50, 35 44"
        stroke={STROKE}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Profile */}
      <path
        d="M30 36 C 28 39, 28 42, 31 44"
        stroke={STROKE}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Closed eye */}
      <path
        d="M37 36 C 39 35, 41 35, 43 36"
        stroke={STROKE}
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Lashes */}
      <path d="M37.5 35 L 37 33.5" stroke={STROKE} strokeWidth="1" strokeLinecap="round" />
      <path d="M40 34.6 L 40 33" stroke={STROKE} strokeWidth="1" strokeLinecap="round" />
      <path d="M42.5 35 L 43 33.5" stroke={STROKE} strokeWidth="1" strokeLinecap="round" />
      {/* Cheek */}
      <circle cx="41" cy="42" r="1.8" fill="hsl(var(--primary) / 0.32)" />
      {/* Lips */}
      <path
        d="M34 42 C 32 43, 32 45, 34 46"
        stroke={STROKE}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

/** Stage 6: SSW 35–42 — full-term baby, head down, ready for birth. */
function Stage6({ size, bare }: { size: number; bare: boolean }) {
  return (
    <svg width={size} height={size} {...COMMON_PROPS} aria-hidden="true">
      <Background bare={bare} />
      {/* Body — head-down, head at bottom */}
      <path
        d="M48 22 C 64 24, 72 38, 70 54 C 68 64, 60 70, 52 70 L 44 70 C 36 70, 28 64, 26 54 C 24 38, 32 24, 48 22 Z"
        fill={SOFT_FILL}
        stroke={STROKE}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Round head at the bottom — head down position */}
      <circle
        cx="48"
        cy="68"
        r="15"
        fill={SOFT_FILL}
        stroke={STROKE}
        strokeWidth="1.5"
      />
      {/* Hair on head */}
      <path
        d="M36 64 C 40 60, 56 60, 60 64"
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M40 62 C 42 60, 48 60, 50 62"
        stroke={STROKE}
        strokeWidth="1.1"
        strokeLinecap="round"
        fill="none"
      />
      {/* Closed eyes */}
      <path
        d="M40 70 C 41.5 69, 43.5 69, 45 70"
        stroke={STROKE}
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M51 70 C 52.5 69, 54.5 69, 56 70"
        stroke={STROKE}
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Cheeks */}
      <circle cx="38" cy="74" r="1.6" fill="hsl(var(--primary) / 0.32)" />
      <circle cx="58" cy="74" r="1.6" fill="hsl(var(--primary) / 0.32)" />
      {/* Tiny lips */}
      <path
        d="M45 76 C 47 77, 49 77, 51 76"
        stroke={STROKE}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Tucked arm */}
      <path
        d="M40 38 C 34 42, 32 50, 36 56"
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Tucked leg / foot near top */}
      <path
        d="M56 30 C 62 30, 64 36, 60 40"
        stroke={STROKE}
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

const STAGE_RENDERERS: Record<Stage, (props: { size: number; bare: boolean }) => ReactElement> = {
  1: Stage1,
  2: Stage2,
  3: Stage3,
  4: Stage4,
  5: Stage5,
  6: Stage6,
}

export function BabyIllustration({
  ssw,
  className = '',
  size = 96,
  bare = false,
}: BabyIllustrationProps) {
  const stage = getStage(ssw)
  const Renderer = STAGE_RENDERERS[stage]

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center',
        !bare && 'rounded-full shadow-sm',
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Renderer size={size} bare={bare} />
    </div>
  )
}
