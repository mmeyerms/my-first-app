'use client'

import { usePreferences } from '@/lib/preferences/client'
import { useT } from '@/lib/i18n/client'
import type { GreetingTone } from '@/lib/preferences/types'
import { cn } from '@/lib/utils'

interface ToneEntry {
  key: GreetingTone
  label: string
  example: string
}

export function GreetingSection() {
  const { prefs, update } = usePreferences()
  const t = useT()
  const ts = t.settings.greeting

  const tones: ToneEntry[] = [
    { key: 'warm', label: ts.tone.warm, example: ts.tone.warmExample },
    { key: 'sachlich', label: ts.tone.neutral, example: ts.tone.neutralExample },
    { key: 'locker', label: ts.tone.casual, example: ts.tone.casualExample },
    { key: 'liebevoll', label: ts.tone.affectionate, example: ts.tone.affectionateExample },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h2 className="mb-1 text-sm font-semibold text-foreground">{ts.tone.title}</h2>
        <p className="mb-3 text-xs text-muted-foreground">{ts.tone.description}</p>
      </div>
      <div className="space-y-2">
        {tones.map((tone) => {
          const isActive = prefs.greetingTone === tone.key
          return (
            <button
              key={tone.key}
              type="button"
              onClick={() => update({ greetingTone: tone.key })}
              aria-pressed={isActive}
              className={cn(
                'flex w-full flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all',
                isActive ? 'border-primary bg-secondary/60 ring-2 ring-primary/40' : 'border-border bg-card hover:border-primary/40',
              )}
            >
              <span className="text-sm font-semibold">{tone.label}</span>
              <span className="font-display text-sm italic text-muted-foreground">{tone.example}</span>
            </button>
          )
        })}
      </div>
      <p className="text-xs text-muted-foreground">{ts.footer}</p>
    </div>
  )
}
