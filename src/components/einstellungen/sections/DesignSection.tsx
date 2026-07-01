'use client'

import { Check } from 'lucide-react'
import { useTheme } from '@/lib/theme/client'
import { THEMES, type Theme } from '@/lib/theme/types'
import { usePreferences } from '@/lib/preferences/client'
import type { AccentColor, FontSize } from '@/lib/preferences/types'
import { cn } from '@/lib/utils'

const ACCENTS: Array<{ key: AccentColor; label: string; swatch: string }> = [
  { key: 'burgundy', label: 'Burgunder', swatch: 'hsl(354 26% 30%)' },
  { key: 'rose', label: 'Rosé', swatch: 'hsl(340 65% 45%)' },
  { key: 'sage', label: 'Sage', swatch: 'hsl(145 25% 35%)' },
  { key: 'blue', label: 'Blau', swatch: 'hsl(210 55% 40%)' },
]

const FONT_SIZES: Array<{ key: FontSize; label: string; hint: string }> = [
  { key: 'sm', label: 'Klein', hint: 'kompakter, mehr auf dem Screen' },
  { key: 'md', label: 'Normal', hint: 'Standard' },
  { key: 'lg', label: 'Groß', hint: 'leichter lesbar' },
]

const THEME_META: Record<Theme, { title: string; description: string; swatches: string[] }> = {
  editorial: {
    title: 'Editorial',
    description: 'Elegant, mit Serif und ruhigen Tönen.',
    swatches: ['hsl(354 26% 30%)', 'hsl(38 47% 62%)', 'hsl(33 33% 96%)'],
  },
  classic: {
    title: 'Classic',
    description: 'Verspielt, bunt, emoji-freundlich.',
    swatches: ['hsl(350 89% 60%)', 'hsl(316 60% 88%)', 'hsl(0 0% 100%)'],
  },
}

export function DesignSection() {
  const { theme, setTheme } = useTheme()
  const { prefs, update } = usePreferences()

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-1 text-sm font-semibold text-foreground">Theme</h2>
        <p className="mb-3 text-xs text-muted-foreground">Wähle die Gesamt-Stimmung.</p>
        <div className="grid grid-cols-2 gap-3">
          {THEMES.map((option) => {
            const meta = THEME_META[option]
            const isActive = theme === option
            return (
              <button
                key={option}
                type="button"
                onClick={() => !isActive && setTheme(option)}
                aria-pressed={isActive}
                className={cn(
                  'group relative flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all',
                  isActive
                    ? 'border-primary bg-secondary/60 ring-2 ring-primary/40'
                    : 'border-border bg-card hover:border-primary/40 hover:shadow-sm',
                )}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm font-semibold">{meta.title}</span>
                  {isActive && <Check className="h-4 w-4 text-primary" />}
                </div>
                <span className="text-xs text-muted-foreground">{meta.description}</span>
                <div className="mt-1 flex gap-1.5">
                  {meta.swatches.map((s, i) => (
                    <span key={i} className="h-3 w-3 rounded-full border border-border/20" style={{ backgroundColor: s }} />
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-sm font-semibold text-foreground">Akzent-Farbe</h2>
        <p className="mb-3 text-xs text-muted-foreground">Wirkt auf Buttons, Links und Highlights.</p>
        <div className="grid grid-cols-4 gap-2">
          {ACCENTS.map((a) => {
            const isActive = prefs.accentColor === a.key
            return (
              <button
                key={a.key}
                type="button"
                onClick={() => update({ accentColor: a.key })}
                aria-pressed={isActive}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border p-3 transition-all',
                  isActive ? 'border-primary bg-secondary/60 ring-2 ring-primary/40' : 'border-border bg-card hover:border-primary/40',
                )}
              >
                <span className="h-8 w-8 rounded-full ring-2 ring-white ring-offset-2 ring-offset-transparent" style={{ backgroundColor: a.swatch }} />
                <span className="text-xs font-medium">{a.label}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-sm font-semibold text-foreground">Schriftgröße</h2>
        <p className="mb-3 text-xs text-muted-foreground">Für einfachere Lesbarkeit.</p>
        <div className="grid grid-cols-3 gap-2">
          {FONT_SIZES.map((f) => {
            const isActive = prefs.fontSize === f.key
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => update({ fontSize: f.key })}
                aria-pressed={isActive}
                className={cn(
                  'rounded-xl border p-3 text-left transition-all',
                  isActive ? 'border-primary bg-secondary/60 ring-2 ring-primary/40' : 'border-border bg-card hover:border-primary/40',
                )}
              >
                <div className="text-sm font-semibold">{f.label}</div>
                <div className="text-[11px] text-muted-foreground">{f.hint}</div>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
