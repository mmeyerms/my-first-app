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
 * Semi-realistic stylized fetus illustrations across 6 anatomical stages.
 *
 * Design principles:
 * - Soft warm fills (skin tones via CSS vars at varying opacities)
 * - Smooth cubic Bézier paths for organic curves
 * - Layered: base body fill → outline stroke → inner details
 * - Anatomically suggestive but stylized (editorial, not textbook)
 *
 * ViewBox 0–120; sac is centered at (60, 60) with radius 56.
 */
export function BabyIllustration({
  ssw,
  className = '',
  size = 96,
  bare = false,
}: BabyIllustrationProps) {
  const stage = getStage(ssw)

  // Unique gradient IDs per instance to avoid SVG <defs> collisions.
  const reactId = useId().replace(/[:]/g, '')
  const sacGrad = `sac-${reactId}`
  const skinGrad = `skin-${reactId}`
  const skinShadow = `shadow-${reactId}`

  // Shared color tokens
  const COL_OUTLINE = 'hsl(var(--primary) / 0.85)'
  const COL_DETAIL = 'hsl(var(--primary))'
  const STROKE = 1.6

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

          {/* Skin base — radial gradient from warm core */}
          <radialGradient id={skinGrad} cx="38%" cy="35%" r="75%">
            <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity="0.95" />
            <stop offset="55%" stopColor="hsl(var(--secondary))" stopOpacity="0.78" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.45" />
          </radialGradient>

          {/* Soft inner shadow — for cheek and limb shading */}
          <radialGradient id={skinShadow} cx="65%" cy="70%" r="55%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.22" />
          </radialGradient>
        </defs>

        {/* Amniotic sac vessel */}
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

        {stage === 1 && <Stage1 skinGrad={skinGrad} outline={COL_OUTLINE} detail={COL_DETAIL} />}
        {stage === 2 && (
          <Stage2
            skinGrad={skinGrad}
            shadowGrad={skinShadow}
            outline={COL_OUTLINE}
            detail={COL_DETAIL}
            stroke={STROKE}
          />
        )}
        {stage === 3 && (
          <Stage3
            skinGrad={skinGrad}
            shadowGrad={skinShadow}
            outline={COL_OUTLINE}
            detail={COL_DETAIL}
            stroke={STROKE}
          />
        )}
        {stage === 4 && (
          <Stage4
            skinGrad={skinGrad}
            shadowGrad={skinShadow}
            outline={COL_OUTLINE}
            detail={COL_DETAIL}
            stroke={STROKE}
          />
        )}
        {stage === 5 && (
          <Stage5
            skinGrad={skinGrad}
            shadowGrad={skinShadow}
            outline={COL_OUTLINE}
            detail={COL_DETAIL}
            stroke={STROKE}
          />
        )}
        {stage === 6 && (
          <Stage6
            skinGrad={skinGrad}
            shadowGrad={skinShadow}
            outline={COL_OUTLINE}
            detail={COL_DETAIL}
            stroke={STROKE}
          />
        )}
      </svg>
    </div>
  )
}

/* ============================================================
 * STAGE 1 — SSW 4-7: Embryo in sac
 *
 * A faint inner sac with a tiny C-shaped embryo curled inside.
 * Center the embryo around (60, 60). Inner sac r ~ 22.
 * ============================================================ */
function Stage1({
  skinGrad,
  outline,
  detail,
}: {
  skinGrad: string
  outline: string
  detail: string
}) {
  return (
    <g>
      {/* Inner amniotic sac (faint outline) */}
      <circle
        cx="60"
        cy="60"
        r="22"
        fill="hsl(var(--primary) / 0.05)"
        stroke="hsl(var(--primary) / 0.25)"
        strokeWidth="0.6"
        strokeDasharray="2 2"
      />

      {/* Tiny C-shaped embryo — head bulge top, tail bottom, ~14 high */}
      {/* Body fill */}
      <path
        d="M 62 53
           C 67 53.5, 68 58, 66 62
           C 65 65, 62 67, 59 67
           C 56 67, 54.5 65, 55 62.5
           C 55.5 59, 57 56, 60 53
           Z"
        fill={`url(#${skinGrad})`}
      />
      {/* Outline */}
      <path
        d="M 62 53
           C 67 53.5, 68 58, 66 62
           C 65 65, 62 67, 59 67
           C 56 67, 54.5 65, 55 62.5
           C 55.5 59, 57 56, 60 53"
        stroke={outline}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Tiny life dot (proto heart) */}
      <circle cx="61" cy="60" r="1.1" fill={detail} opacity="0.65" />
    </g>
  )
}

/* ============================================================
 * STAGE 2 — SSW 8-12: C-curl embryo
 *
 * Big head (proportionally ~45%), curved body in C/comma shape,
 * paddle limbs (4 hints), curled tail tip, single eye spot,
 * one tiny hand near face.
 * ============================================================ */
function Stage2({
  skinGrad,
  shadowGrad,
  outline,
  detail,
  stroke,
}: {
  skinGrad: string
  shadowGrad: string
  outline: string
  detail: string
  stroke: number
}) {
  return (
    <g>
      {/* Body — C-curl: head top-left, tail bottom-right curling under */}
      {/* Filled base */}
      <path
        d="M 50 38
           C 38 40, 33 52, 38 64
           C 41 72, 49 78, 58 80
           C 67 82, 78 80, 82 73
           C 86 66, 83 58, 76 56
           C 74 55.5, 72 56, 71 57
           C 70 53, 67 50, 63 48
           C 67 45, 70 42, 70 38
           C 70 33, 65 30, 58 31
           C 53 32, 50 35, 50 38 Z"
        fill={`url(#${skinGrad})`}
      />
      {/* Soft shadow underlay */}
      <path
        d="M 50 38
           C 38 40, 33 52, 38 64
           C 41 72, 49 78, 58 80
           C 67 82, 78 80, 82 73
           C 86 66, 83 58, 76 56
           C 74 55.5, 72 56, 71 57
           C 70 53, 67 50, 63 48
           C 67 45, 70 42, 70 38
           C 70 33, 65 30, 58 31
           C 53 32, 50 35, 50 38 Z"
        fill={`url(#${shadowGrad})`}
      />
      {/* Outline */}
      <path
        d="M 50 38
           C 38 40, 33 52, 38 64
           C 41 72, 49 78, 58 80
           C 67 82, 78 80, 82 73
           C 86 66, 83 58, 76 56
           C 74 55.5, 72 56, 71 57"
        stroke={outline}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 71 57
           C 70 53, 67 50, 63 48
           C 67 45, 70 42, 70 38
           C 70 33, 65 30, 58 31
           C 53 32, 50 35, 50 38"
        stroke={outline}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Paddle limb hints — arms (near top-right) */}
      <path
        d="M 65 50 C 70 49, 73 50, 74 53"
        stroke={outline}
        strokeWidth={stroke * 0.7}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 60 56 C 64 56, 67 57, 68 59"
        stroke={outline}
        strokeWidth={stroke * 0.7}
        strokeLinecap="round"
        fill="none"
      />
      {/* Paddle limb hints — legs (near tail) */}
      <path
        d="M 75 67 C 79 67, 81 69, 81 72"
        stroke={outline}
        strokeWidth={stroke * 0.7}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 70 73 C 74 73, 76 74, 77 76"
        stroke={outline}
        strokeWidth={stroke * 0.7}
        strokeLinecap="round"
        fill="none"
      />

      {/* Tail tip curl (lower-right) */}
      <path
        d="M 80 73 C 84 75, 84 79, 80 80"
        stroke={outline}
        strokeWidth={stroke * 0.85}
        strokeLinecap="round"
        fill="none"
      />

      {/* Single eye spot (head is upper-left area, around 56, 38) */}
      <circle cx="56" cy="38" r="1.5" fill={detail} opacity="0.85" />

      {/* Tiny hand near face */}
      <path
        d="M 62 44 C 64 44, 65 42, 65 41"
        stroke={outline}
        strokeWidth={stroke * 0.7}
        strokeLinecap="round"
        fill="none"
      />
    </g>
  )
}

/* ============================================================
 * STAGE 3 — SSW 13-19: Recognizable fetus, profile view
 *
 * Head ~30% of body, curled fetal position, profile facing left.
 * Visible forehead → nose → upper lip. Hand near face.
 * Knee bend with foot tucked. Tiny eye slit. Subtle umbilical curl.
 * ============================================================ */
function Stage3({
  skinGrad,
  shadowGrad,
  outline,
  detail,
  stroke,
}: {
  skinGrad: string
  shadowGrad: string
  outline: string
  detail: string
  stroke: number
}) {
  return (
    <g>
      {/* Subtle umbilical cord curl (background) */}
      <path
        d="M 90 78 C 95 70, 92 60, 84 56"
        stroke="hsl(var(--primary) / 0.28)"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="3 2.5"
      />

      {/* Body torso — curled fetal shape (profile, facing LEFT) */}
      {/* Torso fill */}
      <path
        d="M 56 50
           C 48 52, 42 60, 42 70
           C 42 80, 50 88, 60 88
           C 70 88, 80 84, 84 76
           C 87 70, 85 64, 80 60
           C 76 57, 70 56, 64 56
           Z"
        fill={`url(#${skinGrad})`}
      />
      <path
        d="M 56 50
           C 48 52, 42 60, 42 70
           C 42 80, 50 88, 60 88
           C 70 88, 80 84, 84 76
           C 87 70, 85 64, 80 60
           C 76 57, 70 56, 64 56
           Z"
        fill={`url(#${shadowGrad})`}
      />

      {/* Head — profile, facing LEFT. Forehead curve → nose dent → upper lip → chin */}
      <path
        d="M 56 50
           C 50 47, 42 44, 38 38
           C 35 32, 38 26, 45 25
           C 53 24, 60 28, 62 34
           C 63 36, 63 38, 62.5 40
           C 63 41, 63.5 42, 63 43
           C 62 44.5, 60 45.5, 58 46
           C 57 47.5, 56.5 49, 56 50
           Z"
        fill={`url(#${skinGrad})`}
      />
      <path
        d="M 56 50
           C 50 47, 42 44, 38 38
           C 35 32, 38 26, 45 25
           C 53 24, 60 28, 62 34
           C 63 36, 63 38, 62.5 40
           C 63 41, 63.5 42, 63 43
           C 62 44.5, 60 45.5, 58 46
           C 57 47.5, 56.5 49, 56 50"
        stroke={outline}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Torso outline */}
      <path
        d="M 56 50
           C 48 52, 42 60, 42 70
           C 42 80, 50 88, 60 88
           C 70 88, 80 84, 84 76
           C 87 70, 85 64, 80 60
           C 76 57, 70 56, 64 56"
        stroke={outline}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Profile features — facing LEFT (nose at x=38) */}
      {/* Nose tip dent */}
      <path
        d="M 38 38 C 36.5 37.5, 36.5 39, 38 39.5"
        stroke={outline}
        strokeWidth={stroke * 0.75}
        strokeLinecap="round"
        fill="none"
      />
      {/* Upper lip / mouth */}
      <path
        d="M 39 41 C 40.5 41.5, 41.5 41.5, 43 41"
        stroke={outline}
        strokeWidth={stroke * 0.75}
        strokeLinecap="round"
        fill="none"
      />
      {/* Eye — closed slit */}
      <path
        d="M 45 32.5 C 47 32, 49 32, 50 32.5"
        stroke={detail}
        strokeWidth={stroke * 0.7}
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />

      {/* Hand near face/chin */}
      <path
        d="M 50 48 C 47 49, 45 49, 44 47.5"
        stroke={outline}
        strokeWidth={stroke * 0.85}
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="44.5" cy="47" r="1.6" fill={`url(#${skinGrad})`} stroke={outline} strokeWidth={stroke * 0.7} />

      {/* Knee bend / foot tucked (lower-right of body) */}
      <path
        d="M 78 78 C 82 76, 84 78, 83 82"
        stroke={outline}
        strokeWidth={stroke * 0.85}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 70 84 C 73 86, 76 86, 78 84"
        stroke={outline}
        strokeWidth={stroke * 0.7}
        strokeLinecap="round"
        fill="none"
      />
    </g>
  )
}

/* ============================================================
 * STAGE 4 — SSW 20-27: Thumb sucking, refined
 *
 * Balanced proportions. Profile face visible. Thumb in mouth.
 * Knees tucked, feet visible. Subtle skin shading. Hint of hair.
 * ============================================================ */
function Stage4({
  skinGrad,
  shadowGrad,
  outline,
  detail,
  stroke,
}: {
  skinGrad: string
  shadowGrad: string
  outline: string
  detail: string
  stroke: number
}) {
  return (
    <g>
      {/* Body torso — curled, head upper-left, knees tucked lower-right */}
      <path
        d="M 60 46
           C 50 48, 38 56, 36 70
           C 34 82, 44 92, 58 93
           C 72 94, 86 88, 90 76
           C 93 67, 88 60, 80 58
           C 74 56, 67 56, 62 54
           Z"
        fill={`url(#${skinGrad})`}
      />
      <path
        d="M 60 46
           C 50 48, 38 56, 36 70
           C 34 82, 44 92, 58 93
           C 72 94, 86 88, 90 76
           C 93 67, 88 60, 80 58
           C 74 56, 67 56, 62 54
           Z"
        fill={`url(#${shadowGrad})`}
      />

      {/* Head — profile facing LEFT, visible forehead/nose/lip/chin */}
      <path
        d="M 60 46
           C 52 45, 42 40, 36 32
           C 32 25, 36 18, 44 17
           C 54 16, 62 22, 64 30
           C 65 33, 65 35, 64 37
           C 65 38, 65.5 39, 65 40.5
           C 64 42.5, 62 44, 60 45
           Z"
        fill={`url(#${skinGrad})`}
      />
      <path
        d="M 60 46
           C 52 45, 42 40, 36 32
           C 32 25, 36 18, 44 17
           C 54 16, 62 22, 64 30
           C 65 33, 65 35, 64 37
           C 65 38, 65.5 39, 65 40.5
           C 64 42.5, 62 44, 60 45"
        stroke={outline}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 60 46
           C 50 48, 38 56, 36 70
           C 34 82, 44 92, 58 93
           C 72 94, 86 88, 90 76
           C 93 67, 88 60, 80 58
           C 74 56, 67 56, 62 54"
        stroke={outline}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Hair hint — small wisps on top of head */}
      <path
        d="M 42 19 C 44 16.5, 47 16, 50 16.5"
        stroke={detail}
        strokeWidth={stroke * 0.65}
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
      <path
        d="M 50 16 C 53 15, 57 16, 59 18"
        stroke={detail}
        strokeWidth={stroke * 0.65}
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />

      {/* Forehead → nose → lip → chin contour (subtle inner detail line near nose tip) */}
      {/* Nose */}
      <path
        d="M 36 31 C 33.5 30, 33.5 33, 36 33.5"
        stroke={outline}
        strokeWidth={stroke * 0.75}
        strokeLinecap="round"
        fill="none"
      />
      {/* Lip */}
      <path
        d="M 38 36.5 C 39.5 37, 41 37, 42.5 36.5"
        stroke={outline}
        strokeWidth={stroke * 0.7}
        strokeLinecap="round"
        fill="none"
      />
      {/* Eye — closed lash slit */}
      <path
        d="M 46 26 C 48.5 25.5, 51 25.5, 53 26"
        stroke={detail}
        strokeWidth={stroke * 0.7}
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      {/* Lash hint */}
      <path
        d="M 47 25.5 L 47 24.5 M 49 25.3 L 49 24.3 M 51 25.5 L 51 24.5"
        stroke={detail}
        strokeWidth={stroke * 0.5}
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* Thumb in mouth — small rounded shape at lip */}
      <path
        d="M 38 38 C 35 39.5, 33 41, 33 43.5 C 33 45.5, 35 46.5, 37 46"
        stroke={outline}
        strokeWidth={stroke * 0.85}
        strokeLinecap="round"
        fill={`url(#${skinGrad})`}
      />
      {/* Arm leading to thumb (from torso to mouth) */}
      <path
        d="M 50 54 C 44 52, 39 50, 36 46"
        stroke={outline}
        strokeWidth={stroke * 0.85}
        strokeLinecap="round"
        fill="none"
      />

      {/* Knees tucked / feet visible (lower-right) */}
      <path
        d="M 80 80 C 86 78, 90 80, 90 84 C 90 88, 86 90, 82 88"
        stroke={outline}
        strokeWidth={stroke * 0.9}
        strokeLinecap="round"
        fill={`url(#${skinGrad})`}
      />
      {/* Toes hint */}
      <path
        d="M 84 88 L 84.5 90 M 86.5 88.5 L 87 90.5 M 89 88.5 L 89.5 90"
        stroke={detail}
        strokeWidth={stroke * 0.5}
        strokeLinecap="round"
        opacity="0.55"
      />
    </g>
  )
}

/* ============================================================
 * STAGE 5 — SSW 28-34: Chubbier baby, full features
 *
 * Round full face, closed eyes with lash hint, hair tuft,
 * soft cheek shading, body curled with knees up to chest, toes.
 * ============================================================ */
function Stage5({
  skinGrad,
  shadowGrad,
  outline,
  detail,
  stroke,
}: {
  skinGrad: string
  shadowGrad: string
  outline: string
  detail: string
  stroke: number
}) {
  return (
    <g>
      {/* Body — fuller, knees up to chest */}
      <path
        d="M 62 48
           C 50 50, 38 58, 34 70
           C 30 84, 42 96, 60 96
           C 78 96, 92 88, 95 76
           C 97 66, 90 58, 80 56
           C 74 55, 68 54, 64 52
           Z"
        fill={`url(#${skinGrad})`}
      />
      <path
        d="M 62 48
           C 50 50, 38 58, 34 70
           C 30 84, 42 96, 60 96
           C 78 96, 92 88, 95 76
           C 97 66, 90 58, 80 56
           C 74 55, 68 54, 64 52
           Z"
        fill={`url(#${shadowGrad})`}
      />

      {/* Head — rounder, fuller face, profile facing LEFT */}
      <path
        d="M 62 48
           C 52 48, 40 42, 34 32
           C 30 23, 36 14, 46 13
           C 58 12, 67 19, 68 30
           C 68.5 33, 68.5 36, 67.5 38
           C 68 39, 68 40, 67 41.5
           C 65.5 44, 63 46, 62 48
           Z"
        fill={`url(#${skinGrad})`}
      />
      <path
        d="M 62 48
           C 52 48, 40 42, 34 32
           C 30 23, 36 14, 46 13
           C 58 12, 67 19, 68 30
           C 68.5 33, 68.5 36, 67.5 38
           C 68 39, 68 40, 67 41.5
           C 65.5 44, 63 46, 62 48"
        stroke={outline}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 62 48
           C 50 50, 38 58, 34 70
           C 30 84, 42 96, 60 96
           C 78 96, 92 88, 95 76
           C 97 66, 90 58, 80 56
           C 74 55, 68 54, 64 52"
        stroke={outline}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Hair tuft — denser */}
      <path
        d="M 40 16 C 43 13, 47 12, 51 12 C 55 12, 58 13, 60 15"
        stroke={detail}
        strokeWidth={stroke * 0.85}
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M 44 14 L 44 11 M 48 12.5 L 48 9.5 M 52 12 L 52 9 M 56 13 L 56 10.5"
        stroke={detail}
        strokeWidth={stroke * 0.55}
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* Profile features */}
      {/* Forehead curve hint */}
      {/* Nose */}
      <path
        d="M 34 31 C 31 30, 31 34, 34 35"
        stroke={outline}
        strokeWidth={stroke * 0.8}
        strokeLinecap="round"
        fill="none"
      />
      {/* Lip line — tiny pout */}
      <path
        d="M 36 38 C 38 39, 40 39, 42 38"
        stroke={outline}
        strokeWidth={stroke * 0.75}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 38 39.5 C 39 40, 40 40, 41 39.5"
        stroke={outline}
        strokeWidth={stroke * 0.55}
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      {/* Closed eye + lashes */}
      <path
        d="M 46 25 C 49 24.5, 53 24.5, 56 25"
        stroke={detail}
        strokeWidth={stroke * 0.75}
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      <path
        d="M 47 24.5 L 47 23 M 49.5 24.3 L 49.5 22.7 M 52.5 24.3 L 52.5 22.7 M 55 24.5 L 55 23"
        stroke={detail}
        strokeWidth={stroke * 0.5}
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Cheek shading */}
      <ellipse
        cx="44"
        cy="34"
        rx="4"
        ry="2.5"
        fill="hsl(var(--primary) / 0.18)"
      />

      {/* Knees up — visible foot/toes near top of legs (right side) */}
      <path
        d="M 84 78 C 92 75, 96 78, 95 84 C 94 89, 88 91, 84 88"
        stroke={outline}
        strokeWidth={stroke * 0.9}
        strokeLinecap="round"
        fill={`url(#${skinGrad})`}
      />
      {/* Toes */}
      <path
        d="M 87 88.5 L 87.5 90.5 M 89.5 89 L 90 91 M 92 88.5 L 92.5 90.5 M 94 87.5 L 94.5 89.5"
        stroke={detail}
        strokeWidth={stroke * 0.5}
        strokeLinecap="round"
        opacity="0.6"
      />
    </g>
  )
}

/* ============================================================
 * STAGE 6 — SSW 35-42: Head-down, full-term
 *
 * Baby rotated head-DOWN. Compact, ready-for-birth pose.
 * Round head with full features at BOTTOM of frame, body curled tight above.
 * Hint of pelvic shape (subtle curve, very faint).
 * ============================================================ */
function Stage6({
  skinGrad,
  shadowGrad,
  outline,
  detail,
  stroke,
}: {
  skinGrad: string
  shadowGrad: string
  outline: string
  detail: string
  stroke: number
}) {
  return (
    <g>
      {/* Subtle pelvic-shape suggestion (very faint U-curve at the bottom) */}
      <path
        d="M 18 78 C 22 92, 40 100, 60 100 C 80 100, 98 92, 102 78"
        stroke="hsl(var(--primary) / 0.18)"
        strokeWidth="0.9"
        strokeLinecap="round"
        fill="none"
      />

      {/* Body — curled tight, occupies upper area, head at bottom-center */}
      {/* Torso (curled, head DOWN) — bulk of body sits in upper-right area */}
      <path
        d="M 56 75
           C 46 72, 36 64, 32 52
           C 28 38, 36 26, 50 24
           C 64 22, 80 28, 88 40
           C 95 52, 92 64, 82 70
           C 75 74, 66 76, 60 76
           Z"
        fill={`url(#${skinGrad})`}
      />
      <path
        d="M 56 75
           C 46 72, 36 64, 32 52
           C 28 38, 36 26, 50 24
           C 64 22, 80 28, 88 40
           C 95 52, 92 64, 82 70
           C 75 74, 66 76, 60 76
           Z"
        fill={`url(#${shadowGrad})`}
      />

      {/* Head — rotated DOWN, bottom-center area. Profile faces RIGHT.
          Forehead at left, nose dent at right, chin tucked at top. */}
      <path
        d="M 56 75
           C 50 78, 46 84, 48 90
           C 51 96, 60 97, 68 95
           C 75 93, 80 88, 80 82
           C 80 78, 77 75, 73 74
           C 68 73, 62 73, 56 75
           Z"
        fill={`url(#${skinGrad})`}
      />
      <path
        d="M 56 75
           C 50 78, 46 84, 48 90
           C 51 96, 60 97, 68 95
           C 75 93, 80 88, 80 82
           C 80 78, 77 75, 73 74
           C 68 73, 62 73, 56 75"
        stroke={outline}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Torso outline */}
      <path
        d="M 56 75
           C 46 72, 36 64, 32 52
           C 28 38, 36 26, 50 24
           C 64 22, 80 28, 88 40
           C 95 52, 92 64, 82 70
           C 75 74, 66 76, 60 76"
        stroke={outline}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Hair on head (head bottom — hair toward bottom of frame) */}
      <path
        d="M 52 90 C 54 93, 58 95, 62 95 C 66 95, 70 93, 72 90"
        stroke={detail}
        strokeWidth={stroke * 0.85}
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M 55 93.5 L 54.5 96 M 59 94.5 L 58.5 97 M 63 94.8 L 63.5 97 M 67 94.2 L 68 96.5 M 70 92.5 L 71 94.5"
        stroke={detail}
        strokeWidth={stroke * 0.55}
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* Profile features — face turned RIGHT (nose at right edge of head) */}
      {/* Nose tip */}
      <path
        d="M 80 84 C 82.5 84, 82.5 87, 80 87"
        stroke={outline}
        strokeWidth={stroke * 0.8}
        strokeLinecap="round"
        fill="none"
      />
      {/* Lips — content small mouth */}
      <path
        d="M 76 89 C 77.5 89.5, 79 89.5, 80 89"
        stroke={outline}
        strokeWidth={stroke * 0.75}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 77 90.5 C 78 91, 79 91, 79.5 90.5"
        stroke={outline}
        strokeWidth={stroke * 0.55}
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      {/* Closed eye + lash */}
      <path
        d="M 70 81 C 73 80.5, 76 80.5, 78 81"
        stroke={detail}
        strokeWidth={stroke * 0.75}
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      <path
        d="M 71 80.5 L 71 79 M 73.5 80.3 L 73.5 78.7 M 76 80.3 L 76 78.7 M 77.5 80.7 L 77.5 79.2"
        stroke={detail}
        strokeWidth={stroke * 0.5}
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Cheek blush */}
      <ellipse
        cx="66"
        cy="86"
        rx="3.5"
        ry="2.2"
        fill="hsl(var(--primary) / 0.2)"
      />
    </g>
  )
}
