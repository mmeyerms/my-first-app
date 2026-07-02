'use client'

import Link from 'next/link'
import { useTheme } from '@/lib/theme/client'
import { LogoMark } from './LogoMark'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  href?: string
  className?: string
  /** Icon only, no wordmark. For tight spaces (mobile nav, avatar chip). */
  markOnly?: boolean
}

/**
 * MamaMap wordmark: LogoMark (Pin+Heart) + serif "MamaMap" in editorial,
 * bold sans in classic. The mark inherits primary color so light/dark
 * grounds work by tinting the parent alone.
 */
export function Logo({ size = 'md', href = '/dashboard', className = '', markOnly = false }: Props) {
  const { theme } = useTheme()
  const isClassic = theme === 'classic'

  const scale =
    size === 'lg'
      ? { text: 'text-3xl', mark: 30, gap: 'gap-2.5' }
      : size === 'sm'
        ? { text: 'text-lg', mark: 18, gap: 'gap-1.5' }
        : { text: 'text-2xl', mark: 22, gap: 'gap-2' }

  const inner = markOnly ? (
    <span
      className={`inline-flex items-center ${className}`}
      style={{ color: 'hsl(var(--primary))' }}
    >
      <LogoMark size={scale.mark} ariaLabel="MamaMap" />
    </span>
  ) : isClassic ? (
    <span
      className={`inline-flex items-center ${scale.gap} font-bold tracking-tight ${scale.text} ${className}`}
      style={{ color: 'hsl(var(--primary))' }}
    >
      <LogoMark size={scale.mark} ariaLabel="" />
      MamaMap
    </span>
  ) : (
    <span
      className={`inline-flex items-baseline ${scale.gap} font-display font-medium tracking-tight ${scale.text} ${className}`}
      style={{ color: 'hsl(var(--primary))' }}
    >
      <span
        className="relative inline-flex items-center"
        style={{ top: '0.18em' }}
      >
        <LogoMark size={scale.mark} ariaLabel="" />
      </span>
      <span>
        Mama
        <span style={{ color: 'hsl(var(--accent))' }}>·</span>
        Map
      </span>
    </span>
  )

  return href ? (
    <Link href={href} className="inline-flex items-baseline" aria-label="MamaMap">
      {inner}
    </Link>
  ) : (
    inner
  )
}
