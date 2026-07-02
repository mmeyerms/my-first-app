'use client'

import { usePreferences } from '@/lib/preferences/client'
import type { WocheBlockKey, WocheComparisonCategory, WocheProgressStyle } from '@/lib/preferences/types'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { useT } from '@/lib/i18n/client'

const COMPARISON_EMOJIS: Record<WocheComparisonCategory, string> = {
  frucht: '🍓',
  suessigkeit: '🍬',
  spielzeug: '🧸',
  tier: '🐣',
  alltag: '🖇️',
  sport: '⚽',
  beauty: '💄',
}
const ALL_CATS: WocheComparisonCategory[] = ['frucht', 'suessigkeit', 'spielzeug', 'tier', 'alltag', 'sport', 'beauty']

export function WocheSection() {
  const { prefs, update } = usePreferences()
  const t = useT()

  const BLOCKS: Array<{ key: WocheBlockKey; label: string; hint: string }> = [
    { key: 'development', label: t.settings.woche.blocks.development, hint: 'Was passiert diese Woche' },
    { key: 'comparisons', label: t.settings.woche.blocks.comparisons, hint: 'Frucht, Süßigkeit, Spielzeug…' },
    { key: 'momBody', label: t.settings.woche.blocks.momBody, hint: 'Was passiert in dir' },
    { key: 'funFact', label: t.settings.woche.blocks.funFact, hint: 'Fun-Fact der Woche' },
    { key: 'partnerTip', label: t.settings.woche.blocks.partnerTip, hint: 'Tipp fürs Team' },
    { key: 'nextWeek', label: t.settings.woche.blocks.nextWeek, hint: 'Vorschau am Ende' },
  ]

  const COMPARISON_LABELS: Record<WocheComparisonCategory, string> = {
    frucht: t.settings.woche.comparisonCategories.fruits,
    suessigkeit: t.settings.woche.comparisonCategories.candies,
    spielzeug: t.settings.woche.comparisonCategories.toys,
    tier: t.settings.woche.comparisonCategories.animals,
    alltag: t.settings.woche.comparisonCategories.everyday,
    sport: 'Sport',
    beauty: 'Beauty',
  }

  const PROGRESS_STYLES: Array<{ key: WocheProgressStyle; label: string; hint: string }> = [
    { key: 'bar', label: t.settings.woche.progressStyle.bar, hint: 'Fortschritt als Bar' },
    { key: 'percent', label: t.settings.woche.progressStyle.percent, hint: '„42 %"' },
    { key: 'weeksLeft', label: t.settings.woche.progressStyle.weeksLeft, hint: '„noch 12 Wochen"' },
    { key: 'none', label: 'Aus', hint: 'Keine Progress-Anzeige' },
  ]

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
        <h2 className="mb-1 text-sm font-semibold text-foreground">{t.settings.woche.blocks.title}</h2>
        <p className="mb-3 text-xs text-muted-foreground">{t.settings.woche.blocks.description}</p>
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
        <h2 className="mb-1 text-sm font-semibold text-foreground">{t.settings.woche.comparisonCategories.title}</h2>
        <p className="mb-3 text-xs text-muted-foreground">Welche Vergleiche sollen erscheinen?</p>
        <div className="flex flex-wrap gap-2">
          {ALL_CATS.map((c) => {
            const on = prefs.wocheComparisonCategories.includes(c)
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
                <span>{COMPARISON_EMOJIS[c]}</span>
                <span>{COMPARISON_LABELS[c]}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-sm font-semibold text-foreground">{t.settings.woche.progressStyle.title}</h2>
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
