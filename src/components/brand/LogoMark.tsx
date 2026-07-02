/**
 * MamaMap brand mark — Logo Nº 03 "The Pin" from the 2026-07 logo study.
 *
 * A map pin with a heart cut-out. The pin body inherits the current text color
 * so the mark works on any background (light paper, dark ink, colored tiles)
 * by simply setting `color` on the parent. The heart cutout is a transparent
 * knock-out — always the ground color, never a fill.
 *
 * Usage:
 *   <LogoMark size={20} />            — inherits current color
 *   <LogoMark size={32} className="text-primary" />
 *
 * For app-icon PNG generation (32/48/64/128/512/1024) render this in a fixed
 * container with the burgundy background.
 */
interface Props {
  size?: number
  className?: string
  /** Accessible label. Pass empty string ("") for decorative use next to a wordmark. */
  ariaLabel?: string
}

export function LogoMark({ size = 24, className = '', ariaLabel = 'MamaMap' }: Props) {
  const decorative = ariaLabel === ''
  return (
    <svg
      viewBox="0 0 76 100"
      width={size}
      height={Math.round((size * 100) / 76)}
      className={className}
      role={decorative ? 'presentation' : 'img'}
      aria-label={decorative ? undefined : ariaLabel}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
    >
      {/* Pin body — filled with currentColor so parent controls tint. */}
      <path
        d="M 38 5 C 15 5, 0 21, 0 43 C 0 65, 38 96, 38 96 C 38 96, 76 65, 76 43 C 76 21, 61 5, 38 5 Z"
        fill="currentColor"
      />
      {/* Heart cutout — knocked out to reveal ground; drawn using evenodd. */}
      <path
        d="M 38 33 C 34 29, 26 29, 23 35 C 20 41, 30 49, 38 57 C 46 49, 56 41, 53 35 C 50 29, 42 29, 38 33 Z"
        fill="var(--paper, #F5F0E9)"
      />
    </svg>
  )
}
