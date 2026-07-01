'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Sprout,
  Heart,
  ShieldCheck,
  Sparkles,
  ScrollText,
  Stethoscope,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react'

import { KOERPER_KATEGORIEN } from '@/lib/kinderwunsch/koerper'
import { TEAM_FRAGEN } from '@/lib/kinderwunsch/teamFragen'
import { MANIFEST_VORSCHLAEGE } from '@/lib/kinderwunsch/manifest'
import { useTheme } from '@/lib/theme/client'
import { useT } from '@/lib/i18n/client'
import { usePreferences } from '@/lib/preferences/client'
import type { Messages } from '@/lib/i18n/messages'

type IslandProgress = {
  text: string
  highlight: boolean
}

type IslandConfig = {
  href: string
  emoji: string
  Icon: LucideIcon
  titleKey: keyof Messages['kinderwunsch']['islands']
  storageKey: string
  computeProgress: (raw: string | null, t: Messages) => IslandProgress | null
}

const ISLANDS: IslandConfig[] = [
  {
    href: '/kinderwunsch/koerper',
    emoji: '🌱',
    Icon: Sprout,
    titleKey: 'koerper',
    storageKey: 'mamamap-kw-koerper',
    computeProgress: (raw, t) => {
      if (!raw) return null
      try {
        const parsed = JSON.parse(raw) as unknown
        if (!Array.isArray(parsed)) return null
        const total = KOERPER_KATEGORIEN.reduce((sum, c) => sum + c.items.length, 0)
        const checked = parsed.length
        if (checked === 0) return null
        return {
          text: t.kinderwunsch.progress.doneOf
            .replace('{checked}', String(checked))
            .replace('{total}', String(total)),
          highlight: checked === total,
        }
      } catch {
        return null
      }
    },
  },
  {
    href: '/kinderwunsch/team',
    emoji: '💛',
    Icon: Heart,
    titleKey: 'team',
    storageKey: 'mamamap-kw-team',
    computeProgress: (raw, t) => {
      if (!raw) return null
      try {
        const parsed = JSON.parse(raw) as Record<string, string>
        if (!parsed || typeof parsed !== 'object') return null
        const answered = Object.values(parsed).filter((v) => typeof v === 'string' && v.trim().length > 0).length
        if (answered === 0) return null
        return {
          text: t.kinderwunsch.progress.answeredOf
            .replace('{answered}', String(answered))
            .replace('{total}', String(TEAM_FRAGEN.length)),
          highlight: answered === TEAM_FRAGEN.length,
        }
      } catch {
        return null
      }
    },
  },
  {
    href: '/kinderwunsch/aengste',
    emoji: '🤔',
    Icon: ShieldCheck,
    titleKey: 'aengste',
    storageKey: 'mamamap-kw-aengste-read',
    computeProgress: (raw, t) => {
      if (!raw) return null
      try {
        const parsed = JSON.parse(raw) as unknown
        if (!Array.isArray(parsed) || parsed.length === 0) return null
        return { text: t.kinderwunsch.progress.started, highlight: false }
      } catch {
        return null
      }
    },
  },
  {
    href: '/kinderwunsch/vorfreude',
    emoji: '✨',
    Icon: Sparkles,
    titleKey: 'vorfreude',
    storageKey: 'mamamap-kw-vorfreude',
    computeProgress: (raw, t) => {
      if (!raw) return null
      try {
        const parsed = JSON.parse(raw) as { letter?: string; first30?: unknown[]; bucket?: unknown[] }
        if (!parsed || typeof parsed !== 'object') return null
        const hasLetter = typeof parsed.letter === 'string' && parsed.letter.trim().length > 0
        const first30 = Array.isArray(parsed.first30) ? parsed.first30.length : 0
        const bucket = Array.isArray(parsed.bucket) ? parsed.bucket.length : 0
        if (!hasLetter && first30 === 0 && bucket === 0) return null
        return { text: t.kinderwunsch.progress.started, highlight: false }
      } catch {
        return null
      }
    },
  },
  {
    href: '/kinderwunsch/manifest',
    emoji: '📜',
    Icon: ScrollText,
    titleKey: 'manifest',
    storageKey: 'mamamap-kw-manifest',
    computeProgress: (raw, t) => {
      if (!raw) return null
      try {
        const parsed = JSON.parse(raw) as {
          agreed?: string[]
          custom?: { id: string; text: string }[]
          signedAt?: string
        }
        if (!parsed || typeof parsed !== 'object') return null
        const agreedCount = Array.isArray(parsed.agreed) ? parsed.agreed.length : 0
        const customCount = Array.isArray(parsed.custom) ? parsed.custom.length : 0
        const total = agreedCount + customCount
        if (total === 0) return null
        const totalSuggestions = MANIFEST_VORSCHLAEGE.length
        if (parsed.signedAt) {
          return {
            text: t.kinderwunsch.progress.sealedCount.replace('{count}', String(total)),
            highlight: true,
          }
        }
        return {
          text: t.kinderwunsch.progress.selectedCount
            .replace('{count}', String(total))
            .replace('{total}', String(totalSuggestions)),
          highlight: false,
        }
      } catch {
        return null
      }
    },
  },
  {
    href: '/kinderwunsch/arzt',
    emoji: '🩺',
    Icon: Stethoscope,
    titleKey: 'arzt',
    storageKey: 'mamamap-kw-arzt',
    computeProgress: (raw, t) => {
      if (!raw) return null
      try {
        const parsed = JSON.parse(raw) as unknown
        if (!Array.isArray(parsed) || parsed.length === 0) return null
        return {
          text: t.kinderwunsch.progress.discussedCount.replace('{count}', String(parsed.length)),
          highlight: false,
        }
      } catch {
        return null
      }
    },
  },
]

export function KinderwunschHub() {
  const { theme } = useTheme()
  const t = useT()
  const { prefs } = usePreferences()
  const isClassic = theme === 'classic'
  const trackingKeys = (Object.entries(prefs.kinderwunschTracking) as Array<[keyof typeof prefs.kinderwunschTracking, boolean]>)
    .filter(([, v]) => v)
    .map(([k]) => k)
  const TRACKING_LABEL: Record<string, string> = {
    temperature: 'Basaltemp.',
    lh: 'LH-Test',
    symptothermal: 'Symptothermal',
    gv: 'GV',
    mens: 'Mens',
  }
  const [progressMap, setProgressMap] = useState<Record<string, IslandProgress | null>>({})
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const next: Record<string, IslandProgress | null> = {}
    for (const island of ISLANDS) {
      try {
        const raw = localStorage.getItem(island.storageKey)
        next[island.storageKey] = island.computeProgress(raw, t)
      } catch {
        next[island.storageKey] = null
      }
    }
    setProgressMap(next)
    setHydrated(true)
  }, [t])

  return (
    <div className="mx-auto max-w-sm px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/dashboard"
          className={
            isClassic
              ? 'text-sm text-primary hover:underline'
              : 'text-sm text-primary hover:underline'
          }
        >
          {t.common.backToDashboard}
        </Link>
        <Link
          href="/einstellungen"
          className="text-xs text-muted-foreground underline decoration-dotted hover:text-primary"
        >
          Personalisieren
        </Link>
      </div>

      {(trackingKeys.length > 0 || prefs.kinderwunschReminders.wunschEt) && (
        <div className="mb-6 rounded-2xl border border-border/60 bg-secondary/30 p-4">
          <div className="flex items-baseline justify-between">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Dein Setup</p>
            <span className="text-xs text-muted-foreground">
              Zyklus <span className="font-medium text-primary">{prefs.kinderwunschCycleLength}d</span>
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {trackingKeys.map((k) => (
              <span key={k} className="rounded-full bg-card px-2 py-0.5 text-[11px] text-primary">
                {TRACKING_LABEL[k] ?? k}
              </span>
            ))}
          </div>
          {prefs.kinderwunschReminders.wunschEt && (
            <p className="mt-2 font-display text-xs italic text-muted-foreground">
              Wunsch-ET: {prefs.kinderwunschReminders.wunschEt}
            </p>
          )}
          {(prefs.kinderwunschReminders.vitaminsTime || prefs.kinderwunschReminders.ovuTestActive) && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {prefs.kinderwunschReminders.vitaminsTime && (
                <span className="rounded-full bg-card px-2 py-0.5 text-[11px] text-muted-foreground">
                  💊 {prefs.kinderwunschReminders.vitaminsTime}
                </span>
              )}
              {prefs.kinderwunschReminders.ovuTestActive && (
                <span className="rounded-full bg-card px-2 py-0.5 text-[11px] text-muted-foreground">
                  🧪 Ovu-Test aktiv
                </span>
              )}
            </div>
          )}
        </div>
      )}

      <section
        aria-label={t.kinderwunsch.hub.sectionAria}
        className={
          isClassic
            ? 'mb-6 rounded-2xl bg-white p-6 shadow-sm'
            : 'card-elevated mb-6 rounded-2xl bg-card p-7'
        }
      >
        <h1
          className={
            isClassic
              ? 'text-2xl font-bold text-gray-800'
              : 'font-display text-2xl font-medium leading-tight text-foreground'
          }
        >
          {isClassic ? '🌷 ' : ''}{t.kinderwunsch.hub.titlePlain}
        </h1>
        <p
          className={
            isClassic
              ? 'mt-2 text-sm text-gray-600'
              : 'mt-2 font-display text-sm italic text-muted-foreground'
          }
        >
          {t.kinderwunsch.hub.subtitle}
        </p>
      </section>

      <div className="space-y-3" aria-label={t.kinderwunsch.hub.islandsAria}>
        {ISLANDS.map((island) => {
          const progress = hydrated ? progressMap[island.storageKey] : null
          const Icon = island.Icon
          return (
            <Link
              key={island.href}
              href={island.href}
              className={
                isClassic
                  ? 'block rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md'
                  : 'card-elevated block rounded-2xl border border-border/60 bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md'
              }
            >
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className={
                    isClassic
                      ? 'text-3xl leading-none'
                      : 'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-secondary'
                  }
                >
                  {isClassic ? (
                    island.emoji
                  ) : (
                    <Icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
                  )}
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p
                    className={
                      isClassic
                        ? 'font-semibold text-gray-800'
                        : 'font-display text-lg font-semibold leading-tight text-foreground'
                    }
                  >
                    {t.kinderwunsch.islands[island.titleKey].title}
                  </p>
                  <p
                    className={
                      isClassic
                        ? 'mt-0.5 text-xs text-gray-500'
                        : 'mt-1 font-display text-sm italic text-muted-foreground'
                    }
                  >
                    {t.kinderwunsch.islands[island.titleKey].description}
                  </p>
                  {progress && (
                    <p
                      className={
                        isClassic
                          ? `mt-2 text-xs font-medium ${
                              progress.highlight ? 'text-primary' : 'text-muted-foreground'
                            }`
                          : `mt-2 text-xs font-medium ${
                              progress.highlight ? 'text-primary' : 'text-muted-foreground'
                            }`
                      }
                    >
                      {progress.highlight ? '✓ ' : ''}
                      {progress.text}
                    </p>
                  )}
                </div>
                {isClassic ? (
                  <span className="text-gray-300" aria-hidden="true">
                    ›
                  </span>
                ) : (
                  <ChevronRight
                    className="mt-3 h-4 w-4 shrink-0 text-muted-foreground"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
