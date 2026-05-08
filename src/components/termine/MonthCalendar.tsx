'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useT } from '@/lib/i18n/client'
import { useTheme } from '@/lib/theme/client'
import type { Locale } from '@/lib/i18n/types'
import type { Termin } from '@/lib/termine/types'
import { formatLocalDate } from '@/lib/termine/recurrence'

interface MonthCalendarProps {
  termine: Termin[]
  selectedDate: string | null
  onDayClick: (date: string) => void
  locale: Locale
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

function isoFor(year: number, month: number, day: number): string {
  return `${year}-${pad(month + 1)}-${pad(day)}`
}

/**
 * Day index 0..6 where Monday = 0 (German week start).
 */
function weekdayIndexMonStart(d: Date): number {
  const js = d.getDay() // Sun = 0 .. Sat = 6
  return (js + 6) % 7
}

export function MonthCalendar({
  termine,
  selectedDate,
  onDayClick,
  locale,
}: MonthCalendarProps) {
  const t = useT()
  const { theme } = useTheme()
  const isClassic = theme === 'classic'

  // Cursor (year, month) — initialized to today.
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])
  const todayIso = formatLocalDate(today)

  const [cursor, setCursor] = useState<{ year: number; month: number }>(() => ({
    year: today.getFullYear(),
    month: today.getMonth(),
  }))

  const monthLabel = useMemo(() => {
    const d = new Date(cursor.year, cursor.month, 1)
    try {
      return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-US', {
        month: 'long',
        year: 'numeric',
      }).format(d)
    } catch {
      return `${cursor.month + 1}/${cursor.year}`
    }
  }, [cursor, locale])

  // Set of YYYY-MM-DD strings that have at least one termin.
  const datesWithTermin = useMemo(() => {
    const s = new Set<string>()
    for (const x of termine) s.add(x.date)
    return s
  }, [termine])

  const grid = useMemo(() => {
    const firstOfMonth = new Date(cursor.year, cursor.month, 1)
    const offset = weekdayIndexMonStart(firstOfMonth) // empty cells before day 1
    const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate()
    const cells: Array<{ key: string; day: number | null; iso: string | null }> = []
    for (let i = 0; i < offset; i++) {
      cells.push({ key: `empty-${i}`, day: null, iso: null })
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const iso = isoFor(cursor.year, cursor.month, day)
      cells.push({ key: iso, day, iso })
    }
    // Pad to a full row count of 6×7 = 42 for stable height.
    while (cells.length < 42) {
      cells.push({ key: `tail-${cells.length}`, day: null, iso: null })
    }
    return cells
  }, [cursor])

  function goPrev() {
    setCursor((c) => {
      const m = c.month - 1
      if (m < 0) return { year: c.year - 1, month: 11 }
      return { year: c.year, month: m }
    })
  }

  function goNext() {
    setCursor((c) => {
      const m = c.month + 1
      if (m > 11) return { year: c.year + 1, month: 0 }
      return { year: c.year, month: m }
    })
  }

  const weekdayKeys: Array<'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'> = [
    'mon',
    'tue',
    'wed',
    'thu',
    'fri',
    'sat',
    'sun',
  ]

  return (
    <div
      className={
        isClassic
          ? 'rounded-xl border border-border/60 bg-card p-4 shadow-sm'
          : 'rounded-2xl border border-border/60 bg-card p-4'
      }
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p
          className={
            isClassic
              ? 'text-sm font-semibold capitalize text-foreground'
              : 'font-display text-sm font-medium capitalize text-foreground'
          }
          aria-live="polite"
        >
          {monthLabel}
        </p>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={goPrev}
            aria-label={t.termine.calendar.prevMonth}
            className="h-7 w-7"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={goNext}
            aria-label={t.termine.calendar.nextMonth}
            className="h-7 w-7"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {weekdayKeys.map((k) => (
          <div
            key={k}
            className={
              isClassic
                ? 'pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500'
                : 'pb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground'
            }
            aria-hidden="true"
          >
            {t.termine.calendar.weekdays[k]}
          </div>
        ))}
        {grid.map((cell) => {
          if (cell.day === null || cell.iso === null) {
            return <div key={cell.key} aria-hidden="true" />
          }
          const has = datesWithTermin.has(cell.iso)
          const isToday = cell.iso === todayIso
          const isSelected = cell.iso === selectedDate
          const interactive = has

          const baseClasses =
            'relative flex h-9 flex-col items-center justify-center rounded-md text-xs transition-colors'
          const stateClasses = isSelected
            ? 'bg-primary text-primary-foreground'
            : has
              ? isClassic
                ? 'cursor-pointer text-foreground hover:bg-secondary'
                : 'cursor-pointer text-foreground hover:bg-secondary'
              : 'text-muted-foreground/60'
          const ringClass = isToday && !isSelected ? 'ring-1 ring-primary/60' : ''

          if (!interactive) {
            return (
              <div
                key={cell.key}
                className={[baseClasses, stateClasses, ringClass].filter(Boolean).join(' ')}
              >
                <span>{cell.day}</span>
              </div>
            )
          }

          return (
            <button
              key={cell.key}
              type="button"
              onClick={() => cell.iso && onDayClick(cell.iso)}
              className={[baseClasses, stateClasses, ringClass].filter(Boolean).join(' ')}
              aria-pressed={isSelected}
              aria-label={cell.iso ?? undefined}
            >
              <span className="leading-none">{cell.day}</span>
              <span
                aria-hidden="true"
                className={
                  isSelected
                    ? 'mt-0.5 block h-1 w-1 rounded-full bg-primary-foreground'
                    : 'mt-0.5 block h-1 w-1 rounded-full bg-primary'
                }
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
