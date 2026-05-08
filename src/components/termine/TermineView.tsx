'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  CalendarPlus,
  Download,
  Share2,
  Pencil,
  MapPin,
  Clock,
  Stethoscope,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Plus,
  Repeat,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useT, useLocale } from '@/lib/i18n/client'
import { useTheme } from '@/lib/theme/client'
import { localized } from '@/lib/i18n/localized'
import { TERMIN_TYPES, CATEGORY_LABELS } from '@/lib/termine/data'
import { buildIcs, downloadIcs } from '@/lib/termine/ics'
import {
  generateGroupId,
  generateOccurrenceDates,
  parseLocalDate,
} from '@/lib/termine/recurrence'
import type { Termin, TerminTypeId, TerminCategory } from '@/lib/termine/types'
import { TerminForm, type RecurrenceConfig } from './TerminForm'
import { MonthCalendar } from './MonthCalendar'

const STORAGE_KEY = 'mamamap-termine'

interface TermineViewProps {
  ssw: number
}

function isTermin(x: unknown): x is Termin {
  return (
    typeof x === 'object' &&
    x !== null &&
    typeof (x as Termin).id === 'string' &&
    typeof (x as Termin).date === 'string' &&
    typeof (x as Termin).title === 'string'
  )
}

function parseLocalTermine(): Termin[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isTermin)
  } catch {
    return []
  }
}

function todayIso(): string {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatDate(iso: string, locale: 'de' | 'en'): string {
  try {
    const d = parseLocalDate(iso)
    return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d)
  } catch {
    return iso
  }
}

function formatDateShort(iso: string, locale: 'de' | 'en'): string {
  try {
    const d = parseLocalDate(iso)
    return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-US', {
      day: 'numeric',
      month: 'short',
    }).format(d)
  } catch {
    return iso
  }
}

type Bucket = 'upcoming' | 'past'

function getBucket(t: Termin, today: string): Bucket {
  if (t.done) return 'past'
  return t.date < today ? 'past' : 'upcoming'
}

/**
 * Days from `today` to `iso`. Negative if `iso` is in the past.
 */
function daysFromToday(iso: string, todayIsoStr: string): number {
  const a = parseLocalDate(todayIsoStr).getTime()
  const b = parseLocalDate(iso).getTime()
  return Math.round((b - a) / (1000 * 60 * 60 * 24))
}

export function TermineView({ ssw }: TermineViewProps) {
  const t = useT()
  const { locale } = useLocale()
  const { theme } = useTheme()
  const isClassic = theme === 'classic'

  const [termine, setTermine] = useState<Termin[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<Termin> & { id?: string } | undefined>(undefined)
  const [showPast, setShowPast] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadFromApi(): Promise<Termin[]> {
      const res = await fetch('/api/termine')
      if (!res.ok) throw new Error('failed')
      const json = (await res.json()) as unknown
      if (Array.isArray(json)) return json.filter(isTermin)
      return []
    }

    loadFromApi()
      .then(async (apiTermine) => {
        if (cancelled) return
        if (apiTermine.length === 0) {
          const local = parseLocalTermine()
          if (local.length > 0) {
            // One-time migration: POST each local termin to the API.
            for (const t of local) {
              try {
                await fetch('/api/termine', {
                  method: 'POST',
                  headers: { 'content-type': 'application/json' },
                  body: JSON.stringify({ termin: t }),
                })
              } catch {
                // best-effort
              }
            }
            try {
              localStorage.removeItem(STORAGE_KEY)
            } catch {
              // ignore
            }
            try {
              const fresh = await loadFromApi()
              if (!cancelled) setTermine(fresh)
            } catch {
              if (!cancelled) setTermine(local)
            }
            return
          }
        }
        setTermine(apiTermine)
      })
      .catch(() => {
        if (!cancelled) setTermine([])
      })
      .finally(() => {
        if (!cancelled) setHydrated(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const today = todayIso()

  const sorted = useMemo(
    () => [...termine].sort((a, b) => a.date.localeCompare(b.date) || (a.time ?? '').localeCompare(b.time ?? '')),
    [termine]
  )

  const allUpcoming = useMemo(() => sorted.filter((x) => getBucket(x, today) === 'upcoming'), [sorted, today])
  const past = useMemo(
    () => sorted.filter((x) => getBucket(x, today) === 'past').reverse(),
    [sorted, today]
  )

  // Quick filter: 'week' (next 7 days), 'month' (next 30 days), 'all'.
  // Default to 'month' so the initial list is reasonably scoped.
  const [quickFilter, setQuickFilter] = useState<'week' | 'month' | 'all'>('month')

  const upcoming = useMemo(() => {
    // Calendar day-click takes precedence and ignores quick filter.
    if (selectedDate) return sorted.filter((x) => x.date === selectedDate)
    if (quickFilter === 'all') return allUpcoming
    const horizon = quickFilter === 'week' ? 7 : 30
    return allUpcoming.filter((x) => daysFromToday(x.date, today) <= horizon)
  }, [allUpcoming, sorted, selectedDate, quickFilter, today])

  // If the active filter would hide all upcoming termine but a wider filter
  // would show some, automatically expand to keep the view useful.
  useEffect(() => {
    if (selectedDate || allUpcoming.length === 0) return
    if (quickFilter === 'week' && upcoming.length === 0) {
      const monthCount = allUpcoming.filter((x) => daysFromToday(x.date, today) <= 30).length
      if (monthCount > 0) setQuickFilter('month')
      else setQuickFilter('all')
    } else if (quickFilter === 'month' && upcoming.length === 0) {
      setQuickFilter('all')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allUpcoming.length])

  // Default-collapse past if there are more than 3.
  useEffect(() => {
    if (past.length > 3) setShowPast(false)
  }, [past.length])

  // Recommended: TERMIN_TYPES that are recommended, where there's no upcoming Termin of that type,
  // and the SSW window is current or recently passed (within ~4 weeks).
  const recommended = useMemo(() => {
    const scheduledTypes = new Set(
      termine.filter((x) => !x.done).map((x) => x.type as TerminTypeId)
    )
    return TERMIN_TYPES.filter((def) => def.recommended)
      .filter((def) => def.oneOff && !scheduledTypes.has(def.id))
      .filter((def) => {
        // Show if SSW is in or near the recommended window
        return ssw >= def.sswFrom - 2 && ssw <= def.sswTo + 4
      })
      .sort((a, b) => a.sswFrom - b.sswFrom)
  }, [termine, ssw])

  async function handleSave(termin: Termin, recurrence?: RecurrenceConfig): Promise<void> {
    const idx = termine.findIndex((x) => x.id === termin.id)
    if (idx >= 0) {
      // Edit existing single termin (optimistic update).
      const previous = termine
      const next = [...termine]
      next[idx] = termin
      setTermine(next)
      try {
        const res = await fetch(`/api/termine/${encodeURIComponent(termin.id)}`, {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ termin }),
        })
        if (!res.ok) throw new Error('update failed')
      } catch {
        setTermine(previous)
        if (typeof window !== 'undefined') {
          window.alert(t.termine.form.editTitle + ' — ' + 'Error')
        }
      }
      return
    }

    const isRecurring = !!(recurrence && recurrence.enabled && recurrence.count > 1)

    if (isRecurring) {
      // Build optimistic siblings client-side so the UI updates immediately.
      const groupId = generateGroupId()
      const dates = generateOccurrenceDates(termin.date, recurrence.rhythm, recurrence.count)
      const createdAt = termin.createdAt
      const optimistic: Termin[] = dates.map((date, i) => ({
        ...termin,
        id: i === 0 ? termin.id : `t_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 7)}`,
        date,
        groupId,
        createdAt,
      }))
      const previous = termine
      setTermine([...previous, ...optimistic])
      try {
        const res = await fetch('/api/termine', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ termin, recurrence }),
        })
        if (!res.ok) throw new Error('create failed')
        const json = (await res.json()) as { created?: Termin[] }
        const created = Array.isArray(json.created) ? json.created.filter(isTermin) : []
        if (created.length > 0) {
          // Replace optimistic siblings with server-authoritative records.
          setTermine([...previous, ...created])
        }
      } catch {
        setTermine(previous)
        if (typeof window !== 'undefined') {
          window.alert('Error')
        }
      }
      return
    }

    // Single create.
    const previous = termine
    setTermine([...previous, termin])
    try {
      const res = await fetch('/api/termine', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ termin }),
      })
      if (!res.ok) throw new Error('create failed')
      const json = (await res.json()) as { created?: Termin[] }
      const created = Array.isArray(json.created) ? json.created.filter(isTermin) : []
      if (created.length > 0) {
        setTermine([...previous, ...created])
      }
    } catch {
      setTermine(previous)
      if (typeof window !== 'undefined') {
        window.alert('Error')
      }
    }
  }

  async function handleDelete(id: string, scope: 'one' | 'series'): Promise<void> {
    const previous = termine
    let nextList: Termin[]
    if (scope === 'series') {
      const target = termine.find((x) => x.id === id)
      const groupId = target?.groupId
      nextList = groupId
        ? termine.filter((x) => x.groupId !== groupId)
        : termine.filter((x) => x.id !== id)
    } else {
      nextList = termine.filter((x) => x.id !== id)
    }
    setTermine(nextList)
    try {
      const url = `/api/termine/${encodeURIComponent(id)}?series=${scope === 'series' ? 'true' : 'false'}`
      const res = await fetch(url, { method: 'DELETE' })
      if (!res.ok) throw new Error('delete failed')
    } catch {
      setTermine(previous)
      if (typeof window !== 'undefined') {
        window.alert('Error')
      }
    }
  }

  function openAdd(initial?: Partial<Termin>): void {
    setEditing(initial)
    setFormOpen(true)
  }

  function openEdit(termin: Termin): void {
    setEditing(termin)
    setFormOpen(true)
  }

  function exportSingle(termin: Termin): void {
    const ics = buildIcs([termin], locale)
    const safe = termin.title.replace(/[^a-z0-9_-]+/gi, '_').slice(0, 40) || 'termin'
    downloadIcs(`mamamap-${safe}`, ics)
  }

  function exportAll(): void {
    if (termine.length === 0) return
    const ics = buildIcs(termine, locale)
    downloadIcs('mamamap-termine', ics)
  }

  function handleDayClick(iso: string): void {
    setSelectedDate((prev) => (prev === iso ? null : iso))
  }

  if (!hydrated) {
    return (
      <div className="space-y-3" aria-busy="true">
        <div className="h-56 animate-pulse rounded-2xl bg-muted/40" />
        <div className="h-24 animate-pulse rounded-2xl bg-muted/40" />
        <div className="h-24 animate-pulse rounded-2xl bg-muted/40" />
      </div>
    )
  }

  const upcomingHeader = selectedDate
    ? t.termine.calendar.filteredBy.replace(
        '{date}',
        formatDateShort(selectedDate, locale)
      )
    : t.termine.upcoming

  return (
    <div className="space-y-6">
      {/* Month calendar */}
      <MonthCalendar
        termine={termine}
        selectedDate={selectedDate}
        onDayClick={handleDayClick}
        locale={locale}
      />

      {/* Action bar */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => openAdd()} className="flex-1 sm:flex-none">
          {isClassic ? (
            <span className="mr-1.5">+</span>
          ) : (
            <Plus className="mr-1.5 h-4 w-4" strokeWidth={1.5} />
          )}
          {t.termine.add.replace(/^\+\s*/, '')}
        </Button>
        <Button
          variant="outline"
          onClick={exportAll}
          disabled={termine.length === 0}
          className="flex-1 sm:flex-none"
        >
          <Download className="mr-1.5 h-4 w-4" strokeWidth={1.5} />
          .ics
        </Button>
      </div>

      {/* Upcoming */}
      <section aria-label={t.termine.upcoming}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2
            className={
              isClassic
                ? 'text-sm font-semibold uppercase tracking-wider text-gray-700'
                : 'text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground'
            }
          >
            {upcomingHeader}
          </h2>
          {selectedDate && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDate(null)}
              className="h-7 gap-1 px-2 text-xs"
            >
              <X className="h-3 w-3" strokeWidth={1.5} />
              {t.termine.calendar.clearFilter}
            </Button>
          )}
        </div>

        {/* Quick filter chips — only when no specific day is selected */}
        {!selectedDate && allUpcoming.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label={t.termine.quickFilter.ariaLabel}>
            {(
              [
                { id: 'week', label: t.termine.quickFilter.week },
                { id: 'month', label: t.termine.quickFilter.month },
                { id: 'all', label: t.termine.quickFilter.all },
              ] as const
            ).map((f) => {
              const isActive = quickFilter === f.id
              const count =
                f.id === 'all'
                  ? allUpcoming.length
                  : allUpcoming.filter(
                      (x) => daysFromToday(x.date, today) <= (f.id === 'week' ? 7 : 30)
                    ).length
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setQuickFilter(f.id)}
                  aria-pressed={isActive}
                  className={
                    isActive
                      ? 'inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow-sm transition-colors'
                      : 'inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground'
                  }
                >
                  {f.label}
                  <span
                    className={
                      isActive
                        ? 'rounded-full bg-primary-foreground/20 px-1.5 text-[10px] tabular-nums'
                        : 'rounded-full bg-muted px-1.5 text-[10px] tabular-nums text-muted-foreground'
                    }
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        )}
        {upcoming.length === 0 ? (
          <Card className="card-elevated border-dashed border-border/60 bg-card/50">
            <CardContent className="p-6 text-center">
              <p
                className={
                  isClassic
                    ? 'text-sm text-gray-600'
                    : 'font-display text-sm italic text-muted-foreground'
                }
              >
                {selectedDate
                  ? t.termine.empty
                  : allUpcoming.length === 0
                  ? t.termine.empty
                  : t.termine.quickFilter.emptyInRange}
              </p>
              {!selectedDate && allUpcoming.length === 0 && (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => openAdd()}
                  className="mt-2 h-auto px-0 text-primary"
                >
                  {t.termine.emptyCta} →
                </Button>
              )}
              {!selectedDate && allUpcoming.length > 0 && quickFilter !== 'all' && (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => setQuickFilter('all')}
                  className="mt-2 h-auto px-0 text-primary"
                >
                  {t.termine.quickFilter.showAll} →
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <ul className="space-y-3">
            {upcoming.map((termin) => (
              <li key={termin.id}>
                <TerminCard
                  termin={termin}
                  isClassic={isClassic}
                  onEdit={() => openEdit(termin)}
                  onShare={() => exportSingle(termin)}
                  locale={locale}
                  today={today}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Recommended */}
      {recommended.length > 0 && !selectedDate && (
        <section aria-label={t.termine.recommended}>
          <h2
            className={
              isClassic
                ? 'mb-3 text-sm font-semibold uppercase tracking-wider text-gray-700'
                : 'mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground'
            }
          >
            {t.termine.recommended}
          </h2>
          <ul className="space-y-3">
            {recommended.map((def) => {
              let sswHint = t.termine.sswWindow
                .replace('{from}', String(def.sswFrom))
                .replace('{to}', String(def.sswTo))
              if (ssw >= def.sswFrom && ssw <= def.sswTo) {
                sswHint = t.termine.sswCurrent
              } else if (ssw < def.sswFrom) {
                sswHint = t.termine.sswSoon.replace('{from}', String(def.sswFrom))
              } else if (ssw > def.sswTo) {
                sswHint = t.termine.sswOverdue.replace('{to}', String(def.sswTo))
              }
              const overdue = ssw > def.sswTo
              return (
                <li key={def.id}>
                  <Card
                    className={
                      isClassic
                        ? 'card-elevated border-border/60 bg-card'
                        : 'card-elevated border-border/60 bg-card'
                    }
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <span
                          aria-hidden="true"
                          className={
                            isClassic
                              ? 'text-2xl leading-none'
                              : 'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-base'
                          }
                        >
                          {isClassic ? def.emoji : <CalendarPlus className="h-5 w-5 text-primary" strokeWidth={1.5} />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p
                            className={
                              isClassic
                                ? 'text-base font-semibold leading-tight text-foreground'
                                : 'font-display text-base font-semibold leading-tight text-foreground'
                            }
                          >
                            {localized(def.title, locale)}
                          </p>
                          <p
                            className={
                              isClassic
                                ? 'mt-1 text-xs text-gray-600'
                                : 'mt-1 font-display text-xs italic text-muted-foreground'
                            }
                          >
                            {localized(def.description, locale)}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Badge
                              variant={overdue ? 'destructive' : 'secondary'}
                              className="text-[10px] uppercase tracking-wider"
                            >
                              {sswHint}
                            </Badge>
                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                              {localizedCategory(def.category, t)}
                            </Badge>
                          </div>
                          <Button
                            variant="link"
                            size="sm"
                            className="mt-2 h-auto px-0 text-primary"
                            onClick={() =>
                              openAdd({
                                type: def.id,
                                title: localized(def.title, locale),
                              })
                            }
                          >
                            {t.termine.schedule} →
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {/* Past */}
      {past.length > 0 && !selectedDate && (
        <section aria-label={t.termine.past}>
          <button
            type="button"
            onClick={() => setShowPast((s) => !s)}
            className={
              isClassic
                ? 'flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm font-medium text-gray-700 hover:bg-secondary'
                : 'flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground'
            }
            aria-expanded={showPast}
          >
            <span>
              {showPast
                ? t.termine.pastToggleHide
                : t.termine.pastToggleShow.replace('{count}', String(past.length))}
            </span>
            {showPast ? (
              <ChevronUp className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <ChevronDown className="h-4 w-4" strokeWidth={1.5} />
            )}
          </button>
          {showPast && (
            <ul className="mt-3 space-y-3">
              {past.map((termin) => (
                <li key={termin.id}>
                  <TerminCard
                    termin={termin}
                    isClassic={isClassic}
                    onEdit={() => openEdit(termin)}
                    onShare={() => exportSingle(termin)}
                    locale={locale}
                    today={today}
                    muted
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <TerminForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  )
}

function localizedCategory(
  category: TerminCategory,
  t: ReturnType<typeof useT>
): string {
  return t.termine.categories[category]
}

interface TerminCardProps {
  termin: Termin
  isClassic: boolean
  onEdit: () => void
  onShare: () => void
  locale: 'de' | 'en'
  today: string
  muted?: boolean
}

function TerminCard({
  termin,
  isClassic,
  onEdit,
  onShare,
  locale,
  today,
  muted,
}: TerminCardProps) {
  const t = useT()
  const def = TERMIN_TYPES.find((x) => x.id === termin.type)
  const category: TerminCategory = def?.category ?? 'sonstiges'
  const dateLabel = formatDate(termin.date, locale)

  const diff = daysFromToday(termin.date, today)
  const isSoon = !muted && !termin.done && diff >= 0 && diff <= 3
  const isSeries = Boolean(termin.groupId)

  return (
    <Card
      className={
        muted
          ? 'card-elevated border-border/60 bg-card opacity-70'
          : 'card-elevated border-border/60 bg-card'
      }
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className={
              isClassic
                ? 'text-2xl leading-none'
                : 'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-base'
            }
          >
            {isClassic ? (
              def?.emoji ?? '📅'
            ) : termin.done ? (
              <CheckCircle2 className="h-5 w-5 text-primary" strokeWidth={1.5} />
            ) : (
              <CalendarPlus className="h-5 w-5 text-primary" strokeWidth={1.5} />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p
                className={
                  isClassic
                    ? 'text-base font-semibold leading-tight text-foreground'
                    : 'font-display text-base font-semibold leading-tight text-foreground'
                }
              >
                {termin.title}
              </p>
              {termin.done && (
                <Badge variant="secondary" className="shrink-0 text-[10px] uppercase tracking-wider">
                  ✓
                </Badge>
              )}
            </div>
            <p
              className={
                isClassic
                  ? 'mt-1 text-sm font-medium text-gray-700'
                  : 'mt-1 font-display text-sm font-medium text-foreground/80'
              }
            >
              {dateLabel}
              {termin.time && (
                <span className="ml-1.5 inline-flex items-center text-muted-foreground">
                  <Clock className="mr-1 inline h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
                  {termin.time}
                </span>
              )}
            </p>
            <div className="mt-2 space-y-1">
              {termin.location && (
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  <span className="truncate">{termin.location}</span>
                </p>
              )}
              {termin.doctor && (
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Stethoscope className="h-3 w-3 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  <span className="truncate">{termin.doctor}</span>
                </p>
              )}
              {termin.notes && (
                <p className="text-xs italic text-muted-foreground">{termin.notes}</p>
              )}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                {t.termine.categories[category]}
              </Badge>
              {isSeries && (
                <Badge
                  variant="secondary"
                  className="gap-1 text-[10px] uppercase tracking-wider"
                >
                  {isClassic ? (
                    <span aria-hidden="true">🔁</span>
                  ) : (
                    <Repeat className="h-2.5 w-2.5" strokeWidth={1.5} aria-hidden="true" />
                  )}
                  {t.termine.seriesBadge}
                </Badge>
              )}
              {isSoon && (
                <Badge
                  className="gap-1 border-transparent bg-amber-100 text-[10px] uppercase tracking-wider text-amber-900 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-200"
                >
                  {isClassic ? <span aria-hidden="true">📅</span> : null}
                  {t.termine.soonBadge}
                </Badge>
              )}
              <div className="ml-auto flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onShare}
                  aria-label={t.termine.exportOne}
                  className="h-8 px-2"
                >
                  <Share2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onEdit}
                  aria-label={t.termine.form.editTitle}
                  className="h-8 px-2"
                >
                  <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Suppress unused import warning — CATEGORY_LABELS is exported by data.ts
// for potential consumers but currently unused here.
void CATEGORY_LABELS
