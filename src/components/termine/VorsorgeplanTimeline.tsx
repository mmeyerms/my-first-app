'use client'

import { useMemo, useState } from 'react'
import { Check, ChevronDown, CalendarCheck2 } from 'lucide-react'
import { TERMIN_TYPES } from '@/lib/termine/data'
import type { TerminTypeId } from '@/lib/termine/types'
import { useLocale } from '@/lib/i18n/client'
import { localized } from '@/lib/i18n/localized'
import { cn } from '@/lib/utils'

type PlanStatus = 'done' | 'booked' | 'now' | 'open' | 'missed'

interface Props {
  ssw: number
  /** ISO due date — required to compute calendar windows. */
  dueDate: string | null
  /** Existing termine: type + done, to derive per-window status. */
  termine: Array<{ type: string; done: boolean }>
  /** Opens the add-dialog prefilled with a type. Same callback the
   *  "Recommended" section uses. */
  onSchedule: (typeId: TerminTypeId, title: string) => void
}

/**
 * PROJ-14 Vorsorge-Autoplan.
 *
 * Vertical timeline of ALL recommended TERMIN_TYPES across the whole
 * pregnancy — not just the ones near the current SSW (that's what the
 * existing "Recommended" section does). Each window shows:
 *   - computed calendar dates (from due date: SSW n starts at ET − (40−n)·7d)
 *   - status: done / booked / due now / open / window passed
 *   - one-tap "Eintragen" → prefilled dialog
 *
 * Collapsed by default to keep the Termine page calm; header shows the
 * completion ratio so the value is visible even when closed.
 */
export function VorsorgeplanTimeline({ ssw, dueDate, termine, onSchedule }: Props) {
  const { locale, t } = useLocale()
  const vp = t.termine.vorsorgeplan
  const [open, setOpen] = useState(false)

  const planned = useMemo(
    () => TERMIN_TYPES.filter((d) => d.recommended && d.oneOff).sort((a, b) => a.sswFrom - b.sswFrom),
    [],
  )

  const typeStates = useMemo(() => {
    const map = new Map<string, { hasAny: boolean; hasDone: boolean }>()
    for (const x of termine) {
      const cur = map.get(x.type) ?? { hasAny: false, hasDone: false }
      cur.hasAny = true
      if (x.done) cur.hasDone = true
      map.set(x.type, cur)
    }
    return map
  }, [termine])

  function statusFor(def: (typeof planned)[number]): PlanStatus {
    const st = typeStates.get(def.id)
    if (st?.hasDone) return 'done'
    if (st?.hasAny) return 'booked'
    if (ssw >= def.sswFrom && ssw <= def.sswTo) return 'now'
    if (ssw > def.sswTo) return 'missed'
    return 'open'
  }

  function windowDates(def: (typeof planned)[number]): string | null {
    if (!dueDate) return null
    const et = new Date(dueDate + 'T00:00:00')
    if (Number.isNaN(et.getTime())) return null
    const fmt = new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-US', {
      day: 'numeric',
      month: 'short',
    })
    const start = new Date(et.getTime() - (40 - def.sswFrom) * 7 * 86400000)
    const end = new Date(et.getTime() - (40 - def.sswTo - 1) * 7 * 86400000)
    return vp.dateRange.replace('{from}', fmt.format(start)).replace('{to}', fmt.format(end))
  }

  const doneOrBooked = planned.filter((d) => {
    const s = statusFor(d)
    return s === 'done' || s === 'booked'
  }).length

  const STATUS_META: Record<PlanStatus, { label: string; dot: string; text: string }> = {
    done: { label: vp.statusDone, dot: 'bg-sage', text: 'text-sage' },
    booked: { label: vp.statusBooked, dot: 'bg-primary', text: 'text-primary' },
    now: { label: vp.statusNow, dot: 'bg-champagne ring-4 ring-champagne/30', text: 'text-primary' },
    open: { label: vp.statusOpen, dot: 'bg-border', text: 'text-muted-foreground' },
    missed: { label: vp.statusMissed, dot: 'bg-alert/50', text: 'text-alert' },
  }

  return (
    <section
      aria-label={vp.title}
      className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-secondary/40"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/70 text-primary">
          <CalendarCheck2 className="h-4 w-4" strokeWidth={1.5} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-base font-medium text-foreground">{vp.title}</span>
          <span className="block text-[11px] text-muted-foreground">
            {vp.progress.replace('{done}', String(doneOrBooked)).replace('{total}', String(planned.length))}
          </span>
        </span>
        <ChevronDown
          className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="border-t border-border/60 px-5 py-4">
          <p className="mb-4 font-display text-xs italic text-muted-foreground">{vp.subtitle}</p>
          <ol className="relative space-y-0">
            {/* Vertical route line — echoes the JourneyRoute metaphor */}
            <span
              aria-hidden="true"
              className="absolute bottom-2 left-[7px] top-2 w-px border-l border-dashed border-champagne/70"
            />
            {planned.map((def) => {
              const status = statusFor(def)
              const meta = STATUS_META[status]
              const dates = windowDates(def)
              const actionable = status === 'now' || status === 'open' || status === 'missed'
              return (
                <li key={def.id} className="relative flex gap-3 pb-4 pl-0 last:pb-0">
                  <span
                    aria-hidden="true"
                    className={cn(
                      'relative z-10 mt-1 h-[15px] w-[15px] shrink-0 rounded-full border-2 border-card',
                      meta.dot,
                    )}
                  >
                    {status === 'done' && (
                      <Check className="absolute inset-0 m-auto h-2.5 w-2.5 text-paper" strokeWidth={3} />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                      <p className="font-display text-sm font-medium leading-tight text-foreground">
                        {localized(def.title, locale)}
                      </p>
                      <span className={cn('text-[10px] font-semibold uppercase tracking-[0.12em]', meta.text)}>
                        {meta.label}
                      </span>
                    </div>
                    <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                      SSW {def.sswFrom}–{def.sswTo}
                      {dates ? <span className="normal-case tracking-normal"> · {dates}</span> : null}
                    </p>
                    {actionable && (
                      <button
                        type="button"
                        onClick={() => onSchedule(def.id, localized(def.title, locale))}
                        className="mt-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                      >
                        {vp.schedule} →
                      </button>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      )}
    </section>
  )
}
