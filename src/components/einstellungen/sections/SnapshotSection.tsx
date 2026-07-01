'use client'

import { GripVertical, Check, Plus } from 'lucide-react'
import { usePreferences } from '@/lib/preferences/client'
import type { SnapshotCardKey, SnapshotDensity } from '@/lib/preferences/types'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const CARD_META: Record<SnapshotCardKey, { label: string; hint: string; emoji: string }> = {
  nextTermin: { label: 'Nächster Termin', hint: 'Datum + Uhrzeit', emoji: '📅' },
  ssw: { label: 'Aktuelle SSW', hint: 'Woche + Baby-Vergleich', emoji: '👶' },
  tipp: { label: 'Tipp des Tages', hint: 'Impuls für heute', emoji: '💡' },
  tagebuch: { label: 'Letzter Tagebuch-Eintrag', hint: 'Rückblick', emoji: '📝' },
  countdown: { label: 'Countdown zum ET', hint: 'Verbleibende Tage', emoji: '⏳' },
  wochenbettChef: { label: 'Wochenbett-Anfragen', hint: 'Wer will helfen?', emoji: '🤝' },
}
const ALL_KEYS: SnapshotCardKey[] = ['nextTermin', 'ssw', 'tipp', 'tagebuch', 'countdown', 'wochenbettChef']

export function SnapshotSection() {
  const { prefs, update } = usePreferences()
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const active = prefs.snapshotCards
  const inactive = ALL_KEYS.filter((k) => !active.includes(k))

  function toggle(key: SnapshotCardKey) {
    const next = active.includes(key) ? active.filter((k) => k !== key) : [...active, key]
    update({ snapshotCards: next })
  }

  function move(from: number, to: number) {
    if (from === to) return
    const next = [...active]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    update({ snapshotCards: next })
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-1 text-sm font-semibold text-foreground">Home-Kacheln</h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Wähle & sortiere die Kacheln auf deinem Home-Screen. Ziehe zum Umsortieren.
        </p>
        <ul className="space-y-2">
          {active.map((key, i) => {
            const meta = CARD_META[key]
            return (
              <li
                key={key}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragIndex !== null) move(dragIndex, i)
                  setDragIndex(null)
                }}
                className={cn(
                  'flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-all',
                  dragIndex === i && 'opacity-50',
                )}
              >
                <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
                <span className="text-xl" aria-hidden="true">{meta.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">{meta.label}</div>
                  <div className="text-xs text-muted-foreground">{meta.hint}</div>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(key)}
                  aria-label="Entfernen"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:opacity-90"
                >
                  <Check className="h-4 w-4" />
                </button>
              </li>
            )
          })}
        </ul>

        {inactive.length > 0 && (
          <>
            <p className="mb-2 mt-4 text-xs uppercase tracking-wider text-muted-foreground">Verfügbar</p>
            <ul className="space-y-2">
              {inactive.map((key) => {
                const meta = CARD_META[key]
                return (
                  <li key={key} className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-card/50 p-3">
                    <span className="text-xl opacity-60" aria-hidden="true">{meta.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold">{meta.label}</div>
                      <div className="text-xs text-muted-foreground">{meta.hint}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggle(key)}
                      aria-label="Hinzufügen"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-primary/40 text-primary hover:bg-secondary"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </section>

      <section>
        <h2 className="mb-1 text-sm font-semibold text-foreground">Darstellung</h2>
        <p className="mb-3 text-xs text-muted-foreground">Wie kompakt die Kacheln erscheinen sollen.</p>
        <div className="grid grid-cols-2 gap-2">
          {(['compact', 'expanded'] as SnapshotDensity[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => update({ snapshotDensity: d })}
              aria-pressed={prefs.snapshotDensity === d}
              className={cn(
                'rounded-xl border p-3 text-left',
                prefs.snapshotDensity === d ? 'border-primary bg-secondary/60 ring-2 ring-primary/40' : 'border-border bg-card',
              )}
            >
              <div className="text-sm font-semibold">{d === 'compact' ? 'Kompakt' : 'Erweitert'}</div>
              <div className="text-xs text-muted-foreground">
                {d === 'compact' ? 'Nur das Wichtigste' : 'Mit mehr Kontext'}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
        <div>
          <div className="text-sm font-semibold">Countdown-Widget</div>
          <div className="text-xs text-muted-foreground">Immer sichtbar auf Home neben SSW-Anzeige.</div>
        </div>
        <Switch
          checked={prefs.showCountdownWidget}
          onCheckedChange={(v) => update({ showCountdownWidget: v })}
        />
      </section>
    </div>
  )
}
