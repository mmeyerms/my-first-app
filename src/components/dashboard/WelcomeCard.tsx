'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useT, useLocale } from '@/lib/i18n/client'
import { useTheme } from '@/lib/theme/client'
import { getSswInfo, formatSize, formatWeight } from '@/lib/sswEntwicklung'
import { localized } from '@/lib/i18n/localized'
import { BabyIllustration } from '@/components/ssw/BabyIllustration'
import { cn } from '@/lib/utils'

interface WelcomeCardProps {
  name: string
  babyName?: string | null
  ssw: number | null
  dueDate?: string | null
  mode?: 'planning' | 'pregnant'
}

const ROTATION_INTERVAL_MS = 4000

export function WelcomeCard({ name, babyName, ssw, dueDate, mode = 'pregnant' }: WelcomeCardProps) {
  const t = useT()
  const { locale } = useLocale()
  const { theme } = useTheme()
  const isClassic = theme === 'classic'

  const sswInfo = useMemo(() => (ssw !== null ? getSswInfo(ssw) : null), [ssw])
  const comparisons = sswInfo?.comparisons ?? []

  const [index, setIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    if (comparisons.length <= 1) return
    let swapTimer: ReturnType<typeof setTimeout> | null = null
    const interval = setInterval(() => {
      setFade(false)
      // After fade-out, swap to next comparison and fade back in
      swapTimer = setTimeout(() => {
        setIndex((prev) => (prev + 1) % comparisons.length)
        setFade(true)
      }, 220)
    }, ROTATION_INTERVAL_MS)
    return () => {
      clearInterval(interval)
      if (swapTimer) clearTimeout(swapTimer)
    }
  }, [comparisons.length])

  // -------- Planning mode: soft welcome, no SSW number --------
  if (mode === 'planning') {
    const greetingParts = t.dashboard.welcome.planningTitle.split('{name}')
    return (
      <Link
        href="/kinderwunsch"
        aria-label={t.dashboard.welcome.planningSubtitle}
        className="block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <section className="card-elevated group mb-8 cursor-pointer rounded-2xl bg-card p-7 transition-all hover:-translate-y-0.5 hover:shadow-md">
          <h1 className="font-display text-2xl font-medium leading-tight text-foreground">
            {greetingParts[0]}
            <span className="font-semibold">{name}</span>
            {greetingParts[1] ?? ''}
          </h1>
          <p className="mt-2 font-display text-base italic text-muted-foreground">
            {t.dashboard.welcome.planningSubtitle}
          </p>
          <div className="mt-6 flex items-center gap-4 rounded-xl bg-secondary/60 px-4 py-4">
            <span aria-hidden="true" className="text-3xl leading-none">
              🌷
            </span>
            <p className="flex-1 font-display text-sm italic leading-snug text-foreground">
              {t.dashboard.welcome.planningTagline}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-end gap-1 text-xs font-medium text-primary transition-opacity group-hover:opacity-100 sm:opacity-80">
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          </div>
        </section>
      </Link>
    )
  }

  // -------- Pregnant mode without due_date: soft welcome, prompt to add --------
  if (!dueDate || ssw === null) {
    const greetingParts = t.dashboard.greeting.split('{name}')
    return (
      <Link
        href="/profil"
        aria-label={t.dashboard.welcome.enterDueDate}
        className="block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <section className="card-elevated group mb-8 cursor-pointer rounded-2xl bg-card p-7 transition-all hover:-translate-y-0.5 hover:shadow-md">
          <h1 className="font-display text-2xl font-medium leading-tight text-foreground">
            {greetingParts[0]}
            <span className="font-semibold">{name}</span>
            {greetingParts[1] ?? ''}
          </h1>
          <p className="mt-3 font-display text-sm italic leading-relaxed text-muted-foreground">
            {babyName
              ? t.dashboard.babyOnWay.replace('{babyName}', babyName)
              : t.dashboard.babyOnWayGeneric}
          </p>
          <div className="mt-5 rounded-xl bg-secondary/60 px-4 py-3">
            <p className="font-display text-sm italic leading-snug text-foreground">
              {t.dashboard.welcome.noDueDateNote}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-end gap-1 text-xs font-medium text-primary transition-opacity group-hover:opacity-100 sm:opacity-80">
            <span>{t.dashboard.welcome.enterDueDate}</span>
          </div>
        </section>
      </Link>
    )
  }

  // -------- Pregnant + due_date known: full SSW card (existing behavior) --------
  const greetingParts = t.dashboard.greeting.split('{name}')
  const current = comparisons[index]
  const sizeLabel = sswInfo ? formatSize(sswInfo.sizeMm, locale) : null
  const weightLabel =
    sswInfo && sswInfo.weightG ? formatWeight(sswInfo.weightG, locale) : null

  return (
    <Link
      href="/woche"
      aria-label={t.woche.title}
      className="block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <section className="card-elevated group mb-8 cursor-pointer rounded-2xl bg-card p-7 transition-all hover:-translate-y-0.5 hover:shadow-md">
        <h1 className="font-display text-2xl font-medium leading-tight text-foreground">
          {greetingParts[0]}
          <span className="font-semibold">{name}</span>
          {greetingParts[1] ?? ''}
        </h1>

        <div className="mt-6 flex items-start gap-5">
          {/* Illustration */}
          <BabyIllustration ssw={ssw} size={104} className="shrink-0" />

          {/* SSW + size/weight stack */}
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {t.dashboard.sswCaption}
            </p>
            <p className="mt-1 font-display text-5xl font-medium leading-none text-primary">
              {ssw}
            </p>
            <div
              aria-hidden="true"
              className="my-3 h-px w-10"
              style={{ backgroundColor: 'hsl(var(--accent))' }}
            />
            {sizeLabel && (
              <p className="font-display text-sm font-medium leading-tight text-foreground">
                {sizeLabel}
                {weightLabel && (
                  <>
                    <span
                      aria-hidden="true"
                      className="mx-2 text-muted-foreground"
                    >
                      ·
                    </span>
                    {weightLabel}
                  </>
                )}
              </p>
            )}
          </div>
        </div>

        {current && (
          <div
            aria-live="polite"
            className={cn(
              'mt-5 flex items-center gap-3 rounded-xl bg-secondary/60 px-4 py-3 transition-opacity duration-200',
              fade ? 'opacity-100' : 'opacity-0',
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                'leading-none',
                isClassic ? 'text-2xl' : 'text-xl',
              )}
            >
              {current.emoji}
            </span>
            <p
              className={cn(
                'flex-1 text-sm leading-snug text-foreground',
                isClassic ? 'font-medium' : 'font-display italic',
              )}
            >
              {localized(current.label, locale)}
            </p>
          </div>
        )}

        <p className="mt-5 font-display text-base italic text-muted-foreground">
          {babyName
            ? t.dashboard.babyOnWay.replace('{babyName}', babyName)
            : t.dashboard.babyOnWayGeneric}
        </p>

        <div className="mt-3 flex items-center justify-end gap-1 text-xs font-medium text-primary transition-opacity group-hover:opacity-100 sm:opacity-80">
          <span>{t.woche.exploreMore}</span>
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
        </div>
      </section>
    </Link>
  )
}
