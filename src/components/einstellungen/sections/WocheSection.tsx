'use client'

import { usePreferences } from '@/lib/preferences/client'
import type { WocheBlockKey, WocheComparisonCategory, WocheProgressStyle } from '@/lib/preferences/types'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

const BLOCKS: Array<{ key: WocheBlockKey; label: string; hint: string }> = [
  { key: 'development', label: 'Entwicklung', hint: 'Was passiert diese Woche' },
  { key: 'comparisons', label: 'Größenvergleiche', hint: 'Frucht, Süßigkeit, Spielzeug…' },
  { key: 'momBody', label: 'Mama-Körper', hint: 'Was passiert in dir' },
  { key: 'funFact', label: 'Wusstest du?', hint: 'Fun-Fact der Woche' },
  { key: 'partnerTip', label: 'Für Partner', hint: 'Tipp fürs Team' },
  { key: 'nextWeek', label: 'Nächste Woche', hint: 'Vorschau am Ende' },
]

const COMPARISON_META: Record<WocheComparisonCategory, { label: string; emoji: string }> = {
  frucht: { label: 'Früchte', emoji: '🍓' },
  suessigkeit: { label: 'Süßigkeiten', emoji: '🍬' },
  spielzeug: { label: 'Spielzeug', emoji: '🧸' },
  tier: { label: 'Tiere', emoji: '🐣' },
  alltag: { label: 'Alltag', emoji: '🖇️' },
  sport: { label: 'Sport', emoji: '⚽' },
  beauty: { label: 'Beauty', emoji: '💄' },
}
const ALL_CATS: WocheComparisonCategory[] = ['frucht', 'suessigkeit', 'spielzeug', 'tier', 'alltag', 'sport', 'beauty']

const PROGRESS_STYLES: Array<{ key: WocheProgressStyle; label: string; hint: string }> = [
  { key: 'bar', label: 'Balken', hint: 'Fortschritt als Bar' },
  { key: 'percent', label: 'Prozent', hint: '„42 %"' },
  { key: 'weeksLeft', label: 'Wochen bis ET', hint: '„noch 12 Wochen"' },
  { key: 'none', label: 'Aus', hint: 'Keine Progress-Anzeige' },
]

export function WocheSection() {
  const { prefs, update } = usePreferences()

  function toggleBlock(key: WocheBlockKey) {
    const next = prefs.wocheBlocks.includes(key)
      ? prefs.wocheBlocks.filter((k) => k !== key)
      : [...prefs.wocheBlocks, key]
    update({ wocheBlocks: next })
  }
  function toggleCat(cat: WocheComparisonCategory) {
    const next = prefs.wocheComparisonCategories.includes(cat)
      ? prefs.wocheComparisonCategories.filter((c) => c !== cat)
      : [...prefs.wocheComparisonCategories, cat]
    update({ wocheComparisonCategories: next })
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-1 text-sm font-semibold text-foreground">Blöcke auf der Wochen-Seite</h2>
        <p className="mb-3 text-xs text-muted-foreground">Blende aus, was dich nicht interessiert.</p>
        <ul className="space-y-2">
          {BLOCKS.map((b) => (
            <li key={b.key} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{b.label}</div>
                <div className="text-xs text-muted-foreground">{b.hint}</div>
              </div>
              <Switch
                checked={prefs.wocheBlocks.includes(b.key)}
                onCheckedChange={() => toggleBlock(b.key)}
              />
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-1 text-sm font-semibold text-foreground">Vergleichs-Kategorien</h2>
        <p className="mb-3 text-xs text-muted-foreground">Welche Vergleiche sollen erscheinen?</p>
        <div className="flex flex-wrap gap-2">
          {ALL_CATS.map((c) => {
            const on = prefs.wocheComparisonCategories.includes(c)
            const meta = COMPARISON_META[c]
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggleCat(c)}
                aria-pressed={on}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-all',
                  on ? 'border-primary bg-secondary text-primary' : 'border-border bg-card text-muted-foreground hover:border-primary/40',
                )}
              >
                <span>{meta.emoji}</span>
                <span>{meta.label}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-sm font-semibold text-foreground">Progress-Stil</h2>
        <p className="mb-3 text-xs text-muted-foreground">Wie SSW-Fortschritt angezeigt wird.</p>
        <div className="grid grid-cols-2 gap-2">
          {PROGRESS_STYLES.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => update({ wocheProgressStyle: s.key })}
              aria-pressed={prefs.wocheProgressStyle === s.key}
              className={cn(
                'rounded-xl border p-3 text-left',
                prefs.wocheProgressStyle === s.key ? 'border-primary bg-secondary/60 ring-2 ring-primary/40' : 'border-border bg-card hover:border-primary/40',
              )}
            >
              <div className="text-sm font-semibold">{s.label}</div>
              <div className="text-xs text-muted-foreground">{s.hint}</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
