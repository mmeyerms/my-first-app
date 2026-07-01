'use client'

import { useMemo, useState } from 'react'
import { Plus, Undo2, X } from 'lucide-react'

import { EINKAUF_KATEGORIEN, type EinkaufKategorie } from '@/lib/einkaufsliste'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { useLocale } from '@/lib/i18n/client'
import { localized } from '@/lib/i18n/localized'
import { useChecklistState } from '@/hooks/useChecklistState'

const STORAGE_KEY = 'mamamap-einkaufsliste'

type Priority = 'must' | 'nice' | 'skip'

const PRIORITY_EMOJI: Record<Priority, string> = {
  must: '✅',
  nice: '⭐',
  skip: '🤷',
}

export function EinkaufslisteView() {
  const { locale, t } = useLocale()
  const {
    state,
    isChecked,
    toggleChecked,
    exclude,
    restore,
    addCustom,
    removeCustom,
  } = useChecklistState(STORAGE_KEY)

  const [customDraftCategory, setCustomDraftCategory] = useState<string | null>(null)
  const [customDraft, setCustomDraft] = useState('')

  // Total visible items across all built-in categories (excluding hidden ones)
  const totalVisibleItems = useMemo(() => {
    let total = 0
    for (const cat of EINKAUF_KATEGORIEN) {
      for (const it of cat.items) {
        if (!state.excluded.includes(it.id)) total += 1
      }
    }
    for (const c of state.custom) {
      if (!state.excluded.includes(c.id)) total += 1
    }
    return total
  }, [state])

  // Group categories by priority
  const grouped = useMemo(() => {
    const map: Record<Priority, EinkaufKategorie[]> = {
      must: [],
      nice: [],
      skip: [],
    }
    for (const cat of EINKAUF_KATEGORIEN) {
      map[cat.prioritaet].push(cat)
    }
    return map
  }, [])

  const priorities: Priority[] = ['must', 'nice', 'skip']

  const customByCategory = useMemo(() => {
    const map: Record<string, typeof state.custom> = {}
    for (const c of state.custom) {
      if (state.excluded.includes(c.id)) continue
      if (!map[c.categoryId]) map[c.categoryId] = []
      map[c.categoryId].push(c)
    }
    return map
  }, [state.custom, state.excluded])

  const excludedRendered = useMemo(() => {
    const builtIn = EINKAUF_KATEGORIEN.flatMap((cat) =>
      cat.items
        .filter((it) => state.excluded.includes(it.id))
        .map((it) => ({
          id: it.id,
          label: localized(it.label, locale),
          categoryTitle: localized(cat.title, locale),
          isCustom: false,
        })),
    )
    const custom = state.custom
      .filter((c) => state.excluded.includes(c.id))
      .map((c) => {
        const cat = EINKAUF_KATEGORIEN.find((x) => x.id === c.categoryId)
        return {
          id: c.id,
          label: c.label,
          categoryTitle: cat ? localized(cat.title, locale) : '',
          isCustom: true,
        }
      })
    return [...builtIn, ...custom]
  }, [state.excluded, state.custom, locale])

  function startCustomDraft(catId: string) {
    setCustomDraftCategory(catId)
    setCustomDraft('')
  }

  function commitCustomDraft() {
    if (customDraftCategory && customDraft.trim()) {
      addCustom(customDraftCategory, customDraft.trim())
    }
    setCustomDraftCategory(null)
    setCustomDraft('')
  }

  function cancelCustomDraft() {
    setCustomDraftCategory(null)
    setCustomDraft('')
  }

  return (
    <div className="space-y-6">
      {/* Congratulatory empty state when all suggested items are hidden AND no custom items */}
      {totalVisibleItems === 0 && (
        <section className="rounded-2xl border border-dashed border-border/60 bg-secondary/30 p-6 text-center">
          <p className="font-display text-base font-medium text-foreground">
            {t.emptyStates.listCompleteTitle}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.emptyStates.listCompleteBody}
          </p>
        </section>
      )}

      {priorities.map((priority) => {
        const cats = grouped[priority]
        if (cats.length === 0) return null

        const allItems = cats.flatMap((c) => c.items.filter((it) => !state.excluded.includes(it.id)))
        const allCustomInPriority = cats
          .flatMap((c) => customByCategory[c.id] ?? [])
        const sectionTotal = allItems.length + allCustomInPriority.length
        const sectionChecked =
          allItems.filter((it) => isChecked(it.id)).length +
          allCustomInPriority.filter((c) => isChecked(c.id)).length
        const sectionProgress =
          sectionTotal === 0 ? 0 : Math.round((sectionChecked / sectionTotal) * 100)
        const isSkip = priority === 'skip'
        const meta = t.einkaufsliste.priorityMeta[priority]
        const title = t.einkaufsliste.priorities[priority]

        return (
          <section
            key={priority}
            aria-label={title}
            className={`overflow-hidden rounded-2xl border border-border/60 shadow-sm ${
              isSkip ? 'bg-muted/40' : 'bg-card'
            }`}
          >
            <header className="px-5 pt-5">
              <div className="mb-1 flex items-center justify-between">
                <h2
                  className={`flex items-center gap-2 text-base font-semibold ${
                    isSkip ? 'text-muted-foreground' : 'text-foreground'
                  }`}
                >
                  <span className="text-xl" aria-hidden="true">
                    {PRIORITY_EMOJI[priority]}
                  </span>
                  {title}
                </h2>
                <Badge variant="secondary">{meta.badge}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{meta.description}</p>
              <div className="mt-3">
                <div className="mb-1 flex items-baseline justify-between text-xs">
                  <span className="text-muted-foreground">{t.einkaufsliste.progressLabel}</span>
                  <span className="text-muted-foreground">
                    {sectionChecked} / {sectionTotal}
                  </span>
                </div>
                <Progress value={sectionProgress} className="h-1.5" />
              </div>
            </header>

            <div className="space-y-5 px-5 py-5">
              {cats.map((cat) => {
                const visibleItems = cat.items.filter((it) => !state.excluded.includes(it.id))
                const customItems = customByCategory[cat.id] ?? []
                const totalVisibleInCat = visibleItems.length + customItems.length
                const catChecked =
                  visibleItems.filter((it) => isChecked(it.id)).length +
                  customItems.filter((it) => isChecked(it.id)).length

                return (
                  <div key={cat.id}>
                    <div className="mb-2 flex items-center justify-between">
                      <h3
                        className={`flex items-center gap-2 text-sm font-medium ${
                          isSkip ? 'text-muted-foreground' : 'text-foreground'
                        }`}
                      >
                        <span aria-hidden="true">{cat.emoji}</span>
                        {localized(cat.title, locale)}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {catChecked} / {totalVisibleInCat}
                      </span>
                    </div>
                    <ul className="space-y-3">
                      {visibleItems.map((item) => {
                        const checked = isChecked(item.id)
                        return (
                          <li key={item.id} className="flex items-start gap-3">
                            <Checkbox
                              id={item.id}
                              checked={checked}
                              onCheckedChange={() => toggleChecked(item.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <Label
                                htmlFor={item.id}
                                className={`block cursor-pointer text-sm leading-snug ${
                                  isSkip
                                    ? checked
                                      ? 'text-muted-foreground line-through'
                                      : 'text-muted-foreground line-through decoration-muted-foreground/40'
                                    : checked
                                      ? 'text-muted-foreground line-through'
                                      : 'text-foreground'
                                }`}
                              >
                                {localized(item.label, locale)}
                              </Label>
                              {item.tip && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                  💡 {localized(item.tip, locale)}
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => exclude(item.id)}
                              aria-label={t.checklist.hideItem}
                              title={t.checklist.hideItem}
                              className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            >
                              <X className="h-4 w-4" strokeWidth={1.5} />
                            </button>
                          </li>
                        )
                      })}
                      {customItems.map((c) => {
                        const checked = isChecked(c.id)
                        return (
                          <li key={c.id} className="flex items-start gap-3">
                            <Checkbox
                              id={c.id}
                              checked={checked}
                              onCheckedChange={() => toggleChecked(c.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <Label
                                htmlFor={c.id}
                                className={`block cursor-pointer text-sm leading-snug ${
                                  checked
                                    ? 'text-muted-foreground line-through'
                                    : 'text-foreground'
                                }`}
                              >
                                {c.label}
                                <Badge
                                  variant="secondary"
                                  className="ml-2 px-1.5 py-0 text-[10px] uppercase tracking-wider"
                                >
                                  {t.checklist.customBadge}
                                </Badge>
                              </Label>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeCustom(c.id)}
                              aria-label={t.checklist.removeCustom}
                              title={t.checklist.removeCustom}
                              className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            >
                              <X className="h-4 w-4" strokeWidth={1.5} />
                            </button>
                          </li>
                        )
                      })}
                    </ul>

                    {customDraftCategory === cat.id ? (
                      <div className="mt-3 flex flex-col gap-2">
                        <Input
                          autoFocus
                          value={customDraft}
                          onChange={(e) => setCustomDraft(e.target.value)}
                          placeholder={t.checklist.customPlaceholder}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              commitCustomDraft()
                            } else if (e.key === 'Escape') {
                              e.preventDefault()
                              cancelCustomDraft()
                            }
                          }}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={commitCustomDraft}
                            disabled={!customDraft.trim()}
                          >
                            {t.checklist.customSave}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={cancelCustomDraft}>
                            {t.checklist.customCancel}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startCustomDraft(cat.id)}
                        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                      >
                        <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                        {t.checklist.addCustom}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}

      {/* Excluded items */}
      {excludedRendered.length > 0 && (
        <section
          aria-label={t.checklist.hidden}
          className="rounded-2xl border border-dashed border-border/60 bg-muted/40 p-5"
        >
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">
            {t.checklist.hidden} ·{' '}
            <span className="text-xs">
              {t.checklist.hiddenCount.replace('{count}', String(excludedRendered.length))}
            </span>
          </h2>
          <ul className="space-y-2">
            {excludedRendered.map((it) => (
              <li
                key={it.id}
                className="flex items-start justify-between gap-2 text-sm text-muted-foreground line-through"
              >
                <span className="flex-1">
                  {it.label}
                  {it.categoryTitle && (
                    <span className="ml-2 text-[11px] no-underline opacity-70">
                      · {it.categoryTitle}
                    </span>
                  )}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => (it.isCustom ? removeCustom(it.id) : restore(it.id))}
                  className="h-7 shrink-0 px-2 text-xs no-underline"
                  aria-label={it.isCustom ? t.checklist.removeCustom : t.checklist.restore}
                >
                  {it.isCustom ? (
                    <>
                      <X className="mr-1 h-3.5 w-3.5" strokeWidth={1.5} />
                      {t.checklist.removeCustom}
                    </>
                  ) : (
                    <>
                      <Undo2 className="mr-1 h-3.5 w-3.5" strokeWidth={1.5} />
                      {t.checklist.restore}
                    </>
                  )}
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
