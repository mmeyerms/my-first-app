'use client'

import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { usePreferences } from '@/lib/preferences/client'
import type { PartnerRole } from '@/lib/preferences/types'
import { cn } from '@/lib/utils'
import { PartnerTodosManager } from './PartnerTodosManager'

const ROLES: Array<{ key: PartnerRole; label: string; hint: string }> = [
  { key: 'partner', label: 'Partner:in', hint: 'Der/die andere Elternteil' },
  { key: 'grandparent', label: 'Oma / Opa', hint: 'Zukünftige Großeltern' },
  { key: 'friend', label: 'Freund:in', hint: 'Enge Vertrauensperson' },
  { key: 'other', label: 'Andere', hint: 'Wie es zu dir passt' },
]

const VISIBILITY_KEYS = [
  { key: 'termine', label: 'Termine', hint: 'Deine Termine sichtbar' },
  { key: 'tagebuch', label: 'Tagebuch', hint: 'Persönliche Einträge' },
  { key: 'geburtsplan', label: 'Geburtsplan', hint: 'Antworten & Präferenzen' },
  { key: 'woche', label: 'Woche', hint: 'SSW-Ansicht' },
  { key: 'wochenbett', label: 'Wochenbett', hint: 'Hilfe-Anfragen etc.' },
  { key: 'partnerTodos', label: 'To-Dos', hint: 'Von dir zugeteilte Aufgaben' },
] as const

export function PartnerSection() {
  const { prefs, update } = usePreferences()

  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-1 text-sm font-semibold text-foreground">Rolle</h2>
        <p className="mb-3 text-xs text-muted-foreground">Wer nutzt den Partner-Bereich?</p>
        <div className="grid grid-cols-2 gap-2">
          {ROLES.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => update({ partnerRole: r.key })}
              aria-pressed={prefs.partnerRole === r.key}
              className={cn(
                'rounded-xl border p-3 text-left',
                prefs.partnerRole === r.key ? 'border-primary bg-secondary/60 ring-2 ring-primary/40' : 'border-border bg-card hover:border-primary/40',
              )}
            >
              <div className="text-sm font-semibold">{r.label}</div>
              <div className="text-xs text-muted-foreground">{r.hint}</div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-sm font-semibold text-foreground">Bezeichnung</h2>
        <p className="mb-3 text-xs text-muted-foreground">Wie soll die Person angesprochen werden?</p>
        <Input
          value={prefs.partnerLabel}
          onChange={(e) => update({ partnerLabel: e.target.value.slice(0, 40) })}
          placeholder="z.B. Papa, Sarah, Elternteil…"
        />
      </section>

      <section>
        <h2 className="mb-1 text-sm font-semibold text-foreground">Sichtbarkeit</h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Bestimme, welche Bereiche für deine:n Partner:in sichtbar sind.
        </p>
        <ul className="space-y-2">
          {VISIBILITY_KEYS.map((v) => (
            <li key={v.key} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{v.label}</div>
                <div className="text-xs text-muted-foreground">{v.hint}</div>
              </div>
              <Switch
                checked={prefs.partnerVisibility[v.key]}
                onCheckedChange={(checked) =>
                  update({
                    partnerVisibility: { ...prefs.partnerVisibility, [v.key]: checked },
                  })
                }
              />
            </li>
          ))}
        </ul>
      </section>

      <PartnerTodosManager />
    </div>
  )
}
