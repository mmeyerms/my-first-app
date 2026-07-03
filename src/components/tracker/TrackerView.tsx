'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, Footprints, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLocale, useT } from '@/lib/i18n/client'
import { cn } from '@/lib/utils'

interface KicksPayload {
  count: number
  durationMin?: number | null
  startedAt?: string | null
}

interface SymptomPayload {
  weight?: number | null
  mood?: number | null
  symptoms?: string[]
  note?: string | null
}

interface TrackingRow<P> {
  id: string
  date: string
  kind: 'kicks' | 'symptom'
  payload: P
}

const MOOD_EMOJI: Record<number, string> = { 1: '💧', 2: '🌥️', 3: '🌸', 4: '☀️', 5: '✨' }
const SYMPTOM_KEYS = [
  'uebelkeit', 'sodbrennen', 'ruecken', 'schlaflos', 'muede',
  'kopfschmerz', 'wassereinlagerung', 'krampfadern', 'verstopfung', 'stimmung',
] as const

function todayISO(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/**
 * PROJ-15 — Kick-Counter (Cardiff method) + Symptom-/Gewichtstagebuch.
 * One page, two tabs. Data goes to /api/tracking (one row per user+day+kind).
 */
export function TrackerView() {
  const t = useT()
  const { locale } = useLocale()
  const tk = t.tracker

  return (
    <Tabs defaultValue="kicks" className="w-full">
      <TabsList className="mb-5 grid w-full grid-cols-2">
        <TabsTrigger value="kicks">{tk.tabs.kicks}</TabsTrigger>
        <TabsTrigger value="symptoms">{tk.tabs.symptoms}</TabsTrigger>
      </TabsList>
      <TabsContent value="kicks"><KickCounter /></TabsContent>
      <TabsContent value="symptoms"><SymptomTracker locale={locale} /></TabsContent>
    </Tabs>
  )
}

/* ═══════════════════ Kick-Counter ═══════════════════ */

function KickCounter() {
  const t = useT()
  const tk = t.tracker.kicks
  const [count, setCount] = useState(0)
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [finishedMin, setFinishedMin] = useState<number | null>(null)
  const [saved, setSaved] = useState(false)
  const [todayEntry, setTodayEntry] = useState<KicksPayload | null>(null)
  const [history, setHistory] = useState<TrackingRow<KicksPayload>[]>([])

  useEffect(() => {
    fetch('/api/tracking?kind=kicks')
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: TrackingRow<KicksPayload>[]) => {
        if (!Array.isArray(rows)) return
        setHistory(rows)
        const today = rows.find((r) => r.date === todayISO())
        if (today) setTodayEntry(today.payload)
      })
      .catch(() => {})
  }, [])

  function tap() {
    if (count >= 10) return
    const next = count + 1
    if (count === 0) setStartedAt(Date.now())
    setCount(next)
    if (next === 10 && startedAt) {
      setFinishedMin(Math.max(1, Math.round((Date.now() - startedAt) / 60000)))
    }
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(10) } catch { /* not supported */ }
    }
  }

  function reset() {
    setCount(0)
    setStartedAt(null)
    setFinishedMin(null)
    setSaved(false)
  }

  async function save() {
    const payload: KicksPayload = {
      count,
      durationMin: finishedMin,
      startedAt: startedAt ? new Date(startedAt).toISOString() : null,
    }
    const res = await fetch('/api/tracking', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ kind: 'kicks', date: todayISO(), payload }),
    })
    if (res.ok) {
      setSaved(true)
      setTodayEntry(payload)
      setHistory((prev) => {
        const others = prev.filter((r) => r.date !== todayISO())
        return [{ id: 'today', date: todayISO(), kind: 'kicks' as const, payload }, ...others]
      })
    }
  }

  const isDone = count >= 10

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-border/60 bg-card p-5 text-center shadow-sm">
        <h2 className="font-display text-base font-medium text-foreground">{tk.heading}</h2>
        <p className="mx-auto mt-1 max-w-sm font-display text-xs italic text-muted-foreground">
          {tk.explainer}
        </p>

        {todayEntry && count === 0 && (
          <p className="mt-3 rounded-lg bg-secondary/40 px-3 py-2 text-xs text-primary">
            {tk.todayAlready
              .replace('{count}', String(todayEntry.count))
              .replace('{duration}', todayEntry.durationMin ? ` in ${todayEntry.durationMin} Min.` : '')}
          </p>
        )}

        {/* Big tap target */}
        <button
          type="button"
          onClick={tap}
          disabled={isDone}
          aria-label={tk.tapLabel}
          className={cn(
            'mx-auto mt-6 flex h-44 w-44 flex-col items-center justify-center gap-1 rounded-full border-4 transition-all',
            'active:scale-95 disabled:cursor-default',
            isDone
              ? 'border-sage bg-sage/10 text-sage'
              : 'border-primary bg-secondary/40 text-primary hover:bg-secondary/70',
          )}
        >
          {isDone ? (
            <Check className="h-10 w-10" strokeWidth={1.5} />
          ) : (
            <Footprints className="h-10 w-10" strokeWidth={1.5} />
          )}
          <span className="font-display text-2xl font-medium tabular-nums">
            {tk.count.replace('{count}', String(count))}
          </span>
          {!isDone && <span className="text-[11px] uppercase tracking-[0.15em]">{tk.tapLabel}</span>}
        </button>

        {isDone && (
          <p className="mt-4 font-display text-base italic text-sage">
            {finishedMin ? tk.doneIn.replace('{min}', String(finishedMin)) : tk.done}
          </p>
        )}

        <div className="mt-5 flex justify-center gap-2">
          <Button variant="outline" size="sm" onClick={reset} className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} /> {tk.reset}
          </Button>
          {count > 0 && (
            <Button size="sm" onClick={save} disabled={saved} className="gap-1.5">
              {saved ? <><Check className="h-3.5 w-3.5" /> {tk.saved}</> : tk.save}
            </Button>
          )}
        </div>
      </section>

      {history.length > 0 && (
        <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {tk.history}
          </h3>
          <ul className="space-y-1.5">
            {history.slice(0, 7).map((row) => (
              <li key={row.date} className="flex items-baseline justify-between border-b border-dashed border-border/60 pb-1.5 text-sm last:border-0">
                <span className="text-muted-foreground">{formatShort(row.date)}</span>
                <span className="font-display font-medium tabular-nums text-foreground">
                  {row.payload.count}/10
                  {row.payload.durationMin ? (
                    <span className="ml-1 text-xs text-muted-foreground">· {row.payload.durationMin} Min.</span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="rounded-xl border border-dashed border-alert/40 bg-alert/5 p-3 text-xs leading-relaxed text-ink-body">
        {tk.hint}
      </p>
    </div>
  )
}

/* ═══════════════════ Symptom-Tracker ═══════════════════ */

function SymptomTracker({ locale }: { locale: 'de' | 'en' }) {
  const t = useT()
  const ts = t.tracker.symptoms
  const [weight, setWeight] = useState('')
  const [mood, setMood] = useState<number | null>(null)
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)
  const [history, setHistory] = useState<TrackingRow<SymptomPayload>[]>([])
  const loadedToday = useRef(false)

  useEffect(() => {
    fetch('/api/tracking?kind=symptom')
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: TrackingRow<SymptomPayload>[]) => {
        if (!Array.isArray(rows)) return
        setHistory(rows)
        const today = rows.find((r) => r.date === todayISO())
        if (today && !loadedToday.current) {
          loadedToday.current = true
          setWeight(today.payload.weight != null ? String(today.payload.weight) : '')
          setMood(today.payload.mood ?? null)
          setSymptoms(today.payload.symptoms ?? [])
          setNote(today.payload.note ?? '')
        }
      })
      .catch(() => {})
  }, [])

  function toggleSymptom(key: string) {
    setSymptoms((prev) => (prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]))
    setSaved(false)
  }

  async function save() {
    const w = parseFloat(weight.replace(',', '.'))
    const payload: SymptomPayload = {
      weight: Number.isFinite(w) ? w : null,
      mood,
      symptoms,
      note: note.trim() || null,
    }
    const res = await fetch('/api/tracking', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ kind: 'symptom', date: todayISO(), payload }),
    })
    if (res.ok) {
      setSaved(true)
      setHistory((prev) => {
        const others = prev.filter((r) => r.date !== todayISO())
        return [{ id: 'today', date: todayISO(), kind: 'symptom' as const, payload }, ...others]
      })
    }
  }

  // Weight sparkline data — oldest→newest, only entries with weight.
  const weightSeries = useMemo(
    () =>
      [...history]
        .filter((r) => r.payload.weight != null)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-30),
    [history],
  )

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <h2 className="mb-4 font-display text-base font-medium text-foreground">{ts.heading}</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="tr-weight" className="text-xs">{ts.weight}</Label>
              <Input
                id="tr-weight"
                inputMode="decimal"
                value={weight}
                onChange={(e) => { setWeight(e.target.value.slice(0, 6)); setSaved(false) }}
                placeholder={ts.weightPlaceholder}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">{ts.mood}</Label>
              <div className="flex gap-1" role="radiogroup" aria-label={ts.mood}>
                {[1, 2, 3, 4, 5].map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={mood === m}
                    onClick={() => { setMood(m); setSaved(false) }}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg border text-lg transition-all',
                      mood === m
                        ? 'border-primary bg-secondary/60 ring-2 ring-primary/30'
                        : 'border-border bg-card opacity-60 hover:opacity-100',
                    )}
                  >
                    {MOOD_EMOJI[m]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Label className="mb-2 block text-xs">{ts.symptomsLabel}</Label>
            <div className="flex flex-wrap gap-1.5">
              {SYMPTOM_KEYS.map((key) => {
                const active = symptoms.includes(key)
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleSymptom(key)}
                    aria-pressed={active}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs transition-all',
                      active
                        ? 'border-primary bg-secondary/70 font-medium text-primary'
                        : 'border-border bg-card text-muted-foreground hover:border-primary/40',
                    )}
                  >
                    {ts.items[key]}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="tr-note" className="text-xs">{ts.note}</Label>
            <Textarea
              id="tr-note"
              value={note}
              onChange={(e) => { setNote(e.target.value.slice(0, 500)); setSaved(false) }}
              placeholder={ts.notePlaceholder}
              rows={2}
            />
          </div>

          <Button onClick={save} disabled={saved} className="w-full gap-1.5">
            {saved ? <><Check className="h-4 w-4" /> {ts.saved}</> : ts.save}
          </Button>
        </div>
      </section>

      {/* Weight curve — pure SVG sparkline, no chart lib */}
      {weightSeries.length >= 2 && (
        <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {ts.weightCurve}
          </h3>
          <WeightSparkline
            series={weightSeries.map((r) => ({ date: r.date, value: r.payload.weight as number }))}
            locale={locale}
          />
        </section>
      )}

      {/* History */}
      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {ts.history}
        </h3>
        {history.length === 0 ? (
          <p className="font-display text-sm italic text-muted-foreground">{ts.historyEmpty}</p>
        ) : (
          <>
            <ul className="space-y-2">
              {history.slice(0, 7).map((row) => (
                <li key={row.date} className="border-b border-dashed border-border/60 pb-2 text-sm last:border-0">
                  <div className="flex items-baseline justify-between">
                    <span className="text-muted-foreground">{formatShort(row.date)}</span>
                    <span className="font-display tabular-nums text-foreground">
                      {row.payload.mood ? MOOD_EMOJI[row.payload.mood] : ''}
                      {row.payload.weight != null ? ` ${row.payload.weight} kg` : ''}
                    </span>
                  </div>
                  {(row.payload.symptoms?.length ?? 0) > 0 && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {(row.payload.symptoms ?? []).map((s) => ts.items[s as keyof typeof ts.items] ?? s).join(' · ')}
                    </p>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-3 font-display text-xs italic text-muted-foreground">{ts.exportHint}</p>
          </>
        )}
      </section>
    </div>
  )
}

/* ═══════════════════ Sparkline ═══════════════════ */

function WeightSparkline({ series, locale }: { series: Array<{ date: string; value: number }>; locale: 'de' | 'en' }) {
  const W = 320
  const H = 80
  const PAD = 8
  const values = series.map((s) => s.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const points = series.map((s, i) => {
    const x = PAD + (i / (series.length - 1)) * (W - PAD * 2)
    const y = H - PAD - ((s.value - min) / range) * (H - PAD * 2)
    return { x, y }
  })
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const last = points[points.length - 1]
  const fmt = new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-US', { maximumFractionDigits: 1 })

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Gewichtsverlauf">
        <path d={path} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={last.x} cy={last.y} r="3.5" fill="hsl(var(--primary))" />
      </svg>
      <div className="mt-1 flex justify-between text-[10px] uppercase tracking-[0.1em] text-muted-foreground tabular-nums">
        <span>{fmt.format(min)} kg</span>
        <span className="font-semibold text-primary">{fmt.format(values[values.length - 1])} kg</span>
        <span>{fmt.format(max)} kg</span>
      </div>
    </div>
  )
}

function formatShort(iso: string): string {
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${d}.${m}.`
}
