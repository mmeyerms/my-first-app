'use client'

import Link from 'next/link'
import { useTheme } from '@/lib/theme/client'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  href?: string
  className?: string
}

export function Logo({ size = 'md', href = '/dashboard', className = '' }: Props) {
  const { theme } = useTheme()
  const sizeClass = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-lg' : 'text-2xl'

  const inner =
    theme === 'classic' ? (
      <span
        className={`font-bold tracking-tight ${sizeClass} ${className}`}
        style={{ color: 'hsl(var(--primary))' }}
      >
        <span aria-hidden="true">🌸 </span>
        MamaMap
      </span>
    ) : (
      <span
        className={`font-display font-medium tracking-tight ${sizeClass} ${className}`}
        style={{ color: 'hsl(var(--primary))' }}
      >
        Mama
        <span style={{ color: 'hsl(var(--accent))' }}>·</span>
        Map
      </span>
    )

  return href ? (
    <Link href={href} className="inline-flex items-baseline">
      {inner}
    </Link>
  ) : (
    inner
  )
}
