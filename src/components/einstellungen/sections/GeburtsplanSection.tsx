'use client'

import { usePreferences } from '@/lib/preferences/client'
import type { QuestionSetMode } from '@/lib/preferences/types'
import { cn } from '@/lib/utils'

const QUESTION_SETS: Array<{ key: QuestionSetMode; label: string; hint: string }> = [
  { key: 'short', label: 'Kurzform', hint: 'Ca. 5 Kernfragen, in 5 Min beantwortet' },
  { key: 'full', label: 'Ausführlich', hint: 'Alle Fragen, 20+ Minuten' },
]

const CLINIC_PRESETS = [
  { key: '', label: 'Kein Preset', hint: 'Neutrale Formulierung' },
  { key: 'klinik', label: 'Klinikgeburt', hint: 'Formulierungen für Klinik-Team' },
  { key: 'hausgeburt', label: 'Hausgeburt', hint: 'Vertrauter, Fokus auf Hebamme' },
  { key: 'geburtshaus', label: 'Geburtshaus', hint: 'Zwischen Klinik und Hausgeburt' },
  { key: 'ambulant', label: 'Ambulante Geburt', hint: 'Baldige Entlassung' },
]

export function GeburtsplanSection() {
  const { prefs, update } = usePreferences()

  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-1 text-sm font-semibold text-foreground">Fragen-Set</h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Wie ausführlich der Geburtsplan sein soll.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {QUESTION_SETS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => update({ geburtsplanQuestionSet: s.key })}
              aria-pressed={prefs.geburtsplanQuestionSet === s.key}
              className={cn(
                'rounded-xl border p-3 text-left',
                prefs.geburtsplanQuestionSet === s.key
                  ? 'border-primary bg-secondary/60 ring-2 ring-primary/40'
                  : 'border-border bg-card hover:border-primary/40',
              )}
            >
              <div className="text-sm font-semibold">{s.label}</div>
              <div className="text-xs text-muted-foreground">{s.hint}</div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-sm font-semibold text-foreground">Klinik-Preset</h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Wähle ein Setting — die Antwort-Vorschläge im Wizard werden entsprechend zugeschnitten.
        </p>
        <div className="space-y-2">
          {CLINIC_PRESETS.map((p) => {
            const active = (prefs.geburtsplanClinicPreset ?? '') === p.key
            return (
              <button
                key={p.key || 'none'}
                type="button"
                onClick={() => update({ geburtsplanClinicPreset: p.key || null })}
                aria-pressed={active}
                className={cn(
                  'flex w-full items-start gap-3 rounded-xl border p-3 text-left',
                  active ? 'border-primary bg-secondary/60 ring-2 ring-primary/40' : 'border-border bg-card hover:border-primary/40',
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">{p.label}</div>
                  <div className="text-xs text-muted-foreground">{p.hint}</div>
                </div>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
