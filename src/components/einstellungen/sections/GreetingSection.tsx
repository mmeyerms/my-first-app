'use client'

import { usePreferences } from '@/lib/preferences/client'
import type { GreetingTone } from '@/lib/preferences/types'
import { cn } from '@/lib/utils'

const TONES: Array<{ key: GreetingTone; label: string; example: string }> = [
  { key: 'warm', label: 'Warm', example: 'Schön dass du da bist, {name}.' },
  { key: 'sachlich', label: 'Sachlich', example: 'Hallo {name}.' },
  { key: 'locker', label: 'Locker', example: 'Hey {name} 👋' },
  { key: 'liebevoll', label: 'Liebevoll', example: 'Guten Morgen liebe {name} 💛' },
]

export function GreetingSection() {
  const { prefs, update } = usePreferences()
  return (
    <div className="space-y-4">
      <div>
        <h2 className="mb-1 text-sm font-semibold text-foreground">Anrede-Ton</h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Wie MamaMap dich begrüßt — auf dem Home-Screen und in Tipps.
        </p>
      </div>
      <div className="space-y-2">
        {TONES.map((t) => {
          const isActive = prefs.greetingTone === t.key
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => update({ greetingTone: t.key })}
              aria-pressed={isActive}
              className={cn(
                'flex w-full flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all',
                isActive ? 'border-primary bg-secondary/60 ring-2 ring-primary/40' : 'border-border bg-card hover:border-primary/40',
              )}
            >
              <span className="text-sm font-semibold">{t.label}</span>
              <span className="font-display text-sm italic text-muted-foreground">{t.example}</span>
            </button>
          )
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        Die Tageszeit (Morgen / Tag / Abend) fließt automatisch mit ein.
      </p>
    </div>
  )
}
