'use client'

import { Switch } from '@/components/ui/switch'
import { usePreferences } from '@/lib/preferences/client'
import { useT } from '@/lib/i18n/client'
import type { LifeCircumstances } from '@/lib/preferences/types'

const FLAG_KEYS: ReadonlyArray<keyof LifeCircumstances> = [
  'afterLoss',
  'riskPregnancy',
  'bedRest',
  'plannedSectio',
  'soloMama',
  'ivf',
  'premature',
  'prenatalFinding',
]

/**
 * "Meine Situation" (Sonderfaelle): 8 Lebensumstands-Flags, die Ansprache
 * und Inhalte app-weit anpassen. Reihenfolge: haeufige/vorgeburtliche
 * zuerst, die schwersten (premature, prenatalFinding) bewusst am Ende —
 * niemand soll beim Scannen zuerst ueber sie stolpern.
 */
export function SituationSection() {
  const { prefs, update } = usePreferences()
  const t = useT()
  const ts = t.situation

  function setFlag(key: keyof LifeCircumstances, value: boolean) {
    update({ lifeCircumstances: { ...prefs.lifeCircumstances, [key]: value } })
  }

  return (
    <div className="space-y-4">
      <p className="rounded-xl border border-dashed border-border bg-secondary/30 p-4 font-display text-sm italic text-muted-foreground">
        {ts.intro}
      </p>
      <ul className="space-y-2">
        {FLAG_KEYS.map((key) => (
          <li key={key} className="flex items-start gap-3 rounded-xl border border-border bg-card p-3">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-foreground">{ts.flags[key].label}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{ts.flags[key].hint}</div>
            </div>
            <Switch
              checked={prefs.lifeCircumstances[key]}
              onCheckedChange={(v) => setFlag(key, v)}
              aria-label={ts.flags[key].label}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
