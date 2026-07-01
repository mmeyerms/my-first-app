'use client'

import Link from 'next/link'
import { useT } from '@/lib/i18n/client'
import { useTheme } from '@/lib/theme/client'
import { BabyIllustration } from '@/components/ssw/BabyIllustration'
import { cn } from '@/lib/utils'

interface CompactWelcomeProps {
  name: string
  babyName?: string | null
  ssw: number | null
  dueDate: string | null
  mode: 'planning' | 'pregnant'
  customGreeting?: string
}

function renderGreeting(fallbackParts: string[], name: string, custom: string | undefined) {
  if (custom) return <>{custom}</>
  return (
    <>
      {fallbackParts[0]}
      <span className="font-semibold">{name}</span>
      {fallbackParts[1] ?? ''}
    </>
  )
}

/**
 * A compact, hero-style welcome for the dashboard home. The full SSW hero with
 * BabyIllustration + size/weight/comparisons lives on /woche — the greeting
 * here links there so users can dive deeper when they want.
 */
export function CompactWelcome({
  name,
  babyName,
  ssw,
  dueDate,
  mode,
  customGreeting,
}: CompactWelcomeProps) {
  const t = useT()
  const { theme } = useTheme()
  const isClassic = theme === 'classic'

  // ---------- Planning mode: garden greeting ----------
  if (mode === 'planning') {
    const greetingParts = t.dashboard.welcome.planningTitle.split('{name}')
    return (
      <Link
        href="/kinderwunsch"
        aria-label={t.dashboard.welcome.planningSubtitle}
        className="mb-6 block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1
              className={cn(
                'text-2xl font-medium leading-tight text-foreground',
                isClassic ? '' : 'font-display',
              )}
            >
              {renderGreeting(greetingParts, name, customGreeting)}
            </h1>
            <p
              className={cn(
                'mt-1 text-sm text-muted-foreground',
                isClassic ? '' : 'font-display italic',
              )}
            >
              {t.dashboard.welcome.planningSubtitle}
            </p>
          </div>
          <span aria-hidden="true" className="text-3xl leading-none">
            🌷
          </span>
        </div>
      </Link>
    )
  }

  // ---------- Pregnant, no due_date ----------
  if (!dueDate || ssw === null) {
    const greetingParts = t.dashboard.greeting.split('{name}')
    return (
      <Link
        href="/profil"
        aria-label={t.dashboard.welcome.enterDueDate}
        className="mb-6 block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="min-w-0">
          <h1
            className={cn(
              'text-2xl font-medium leading-tight text-foreground',
              isClassic ? '' : 'font-display',
            )}
          >
            {renderGreeting(greetingParts, name, customGreeting)}
          </h1>
          <p
            className={cn(
              'mt-1 text-sm leading-snug text-muted-foreground',
              isClassic ? '' : 'font-display italic',
            )}
          >
            {t.dashboard.welcome.noDueDateNote}
          </p>
          <p className="mt-1 text-xs font-medium text-primary">
            {t.dashboard.welcome.enterDueDate}
          </p>
        </div>
      </Link>
    )
  }

  // ---------- Pregnant with due_date: greeting + SSW line, links to /woche ----------
  const greetingParts = t.dashboard.greeting.split('{name}')
  const babyLine = babyName
    ? t.dashboard.babyOnWay.replace('{babyName}', babyName)
    : t.dashboard.babyOnWayGeneric
  const sswLine = `${t.dashboard.sswCard.replace('{ssw}', String(ssw))} · ${babyLine}`

  return (
    <Link
      href="/woche"
      aria-label={t.woche.title}
      className="mb-6 block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1
            className={cn(
              'text-2xl font-medium leading-tight text-foreground',
              isClassic ? '' : 'font-display',
            )}
          >
            {renderGreeting(greetingParts, name, customGreeting)}
          </h1>
          <p
            className={cn(
              'mt-1 truncate text-sm text-muted-foreground',
              isClassic ? '' : 'font-display italic',
            )}
          >
            {sswLine}
          </p>
        </div>
        <BabyIllustration ssw={ssw} size={44} className="shrink-0" />
      </div>
    </Link>
  )
}
