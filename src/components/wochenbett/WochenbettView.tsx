'use client'

import { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, Plus, RotateCcw, Undo2, X } from 'lucide-react'

import { WOCHENBETT_KATEGORIEN } from '@/lib/wochenbett'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { useLocale } from '@/lib/i18n/client'
import { localized } from '@/lib/i18n/localized'
import { useChecklistState } from '@/hooks/useChecklistState'
import { ChecklistItemNote } from '@/components/checklist/ChecklistItemNote'
import { usePreferences } from '@/lib/preferences/client'
import { ChecklistPresetBanner } from '@/components/packliste/ChecklistPresetBanner'

const STORAGE_KEY = 'mamamap-wochenbett'

export function WochenbettView() {
  const { locale, t } = useLocale()
  const { prefs } = usePreferences()
  const {
    state,
    isChecked,
    isExcluded,
    toggleChecked,
    exclude,
    restore,
    addCustom,
    removeCustom,
    getNote,
    setNote,
    resetAll,
  } = useChecklistState(STORAGE_KEY)

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    () => Object.fromEntries(WOCHENBETT_KATEGORIEN.map((c) => [c.id, true])),
  )
  const [customDraftCategory, setCustomDraftCategory] = useState<string | null>(null)
  const [customDraft, setCustomDraft] = useState('')

  // All visible (non-excluded) item IDs across all categories — including custom items
  const { totalVisible, checkedCount } = useMemo(() => {
    let total = 0
    let checkedC = 0
    for (const cat of WOCHENBETT_KATEGORIEN) {
      for (const it of cat.items) {
        if (state.excluded.includes(it.id)) continue
        total += 1
        if (state.checked.includes(it.id)) checkedC += 1
      }
    }
    for (const c of state.custom) {
      if (state.excluded.includes(c.id)) continue
      total += 1
      if (state.checked.includes(c.id)) checkedC += 1
    }
    return { totalVisible: total, checkedCount: checkedC }
  }, [state])

  const progress = totalVisible === 0 ? 0 : Math.round((checkedCount / totalVisible) * 100)
  const allDone = checkedCount === totalVisible && totalVisible > 0
  const remaining = totalVisible - checkedCount

  const customByCategory = useMemo(() => {
    const map: Record<string, typeof state.custom> = {}
    for (const c of state.custom) {
      if (state.excluded.includes(c.id)) continue
      if (!map[c.categoryId]) map[c.categoryId] = []
      map[c.categoryId].push(c)
    }
    return map
  }, [state.custom, state.excluded])

  // Excluded items (built items + custom items) for the bottom section
  const excludedRendered = useMemo(() => {
    const builtIn = WOCHENBETT_KATEGORIEN.flatMap((cat) =>
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
        const cat = WOCHENBETT_KATEGORIEN.find((x) => x.id === c.categoryId)
        return {
          id: c.id,
          label: c.label,
          categoryTitle: cat ? localized(cat.title, locale) : '',
          isCustom: true,
        }
      })
    return [...builtIn, ...custom]
  }, [state.excluded, state.custom, locale])

  function toggleCategory(id: string) {
    setOpenCategories((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function handleResetAll() {
    if (window.confirm(t.wochenbett.confirmReset)) {
      resetAll()
    }
  }

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
    <div className="space-y-5">
      <ChecklistPresetBanner presets={prefs.listPresets} />

      {/* Progress card */}
      <section
        aria-label={t.wochenbett.progressLabel}
        className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm"
      >
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm font-medium text-foreground">
            {t.wochenbett.progressLabel}
          </span>
          <span className="text-sm text-muted-foreground">
            {checkedCount} / {totalVisible}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="mt-3 text-sm text-muted-foreground">
          {allDone
            ? t.wochenbett.allDone
            : checkedCount === 0
              ? t.wochenbett.encourageEmpty
              : t.wochenbett.encourageRemaining.replace('{remaining}', String(remaining))}
        </p>
      </section>

      {/* Congratulatory empty state when all suggested items are handled AND no custom items */}
      {totalVisible === 0 && state.custom.length === 0 && (
        <section className="rounded-2xl border border-dashed border-border/60 bg-secondary/30 p-6 text-center">
          <p className="font-display text-base font-medium text-foreground">
            {t.emptyStates.listCompleteTitle}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.emptyStates.listCompleteBody}
          </p>
        </section>
      )}

      {/* Categories */}
      {WOCHENBETT_KATEGORIEN.map((cat) => {
        const isOpen = openCategories[cat.id]
        const customItems = customByCategory[cat.id] ?? []
        const visibleItems = cat.items.filter((it) => !state.excluded.includes(it.id))
        const totalVisibleInCat = visibleItems.length + customItems.length
        const catChecked =
          visibleItems.filter((it) => isChecked(it.id)).length +
          customItems.filter((it) => isChecked(it.id)).length

        return (
          <section
            key={cat.id}
            aria-label={localized(cat.title, locale)}
            className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm"
          >
            <button
              type="button"
              onClick={() => toggleCategory(cat.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {cat.emoji}
                </span>
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    {localized(cat.title, locale)}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {t.wochenbett.catProgress
                      .replace('{checked}', String(catChecked))
                      .replace('{total}', String(totalVisibleInCat))}
                  </p>
                </div>
              </div>
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>

            {isOpen && (
              <div className="border-t border-border/60 px-5 py-4">
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
                              checked
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
                          <ChecklistItemNote
                            itemId={item.id}
                            note={getNote(item.id)}
                            onSave={(n) => setNote(item.id, n)}
                          />
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
                          {c.tip && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              💡 {c.tip}
                            </p>
                          )}
                          <ChecklistItemNote
                            itemId={c.id}
                            note={getNote(c.id)}
                            onSave={(n) => setNote(c.id, n)}
                          />
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

                {/* Add custom */}
                {customDraftCategory === cat.id ? (
                  <div className="mt-4 flex flex-col gap-2">
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
                    className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                    {t.checklist.addCustom}
                  </button>
                )}
              </div>
            )}
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

      {/* Reset */}
      <div className="pt-2">
        <Button
          variant="outline"
          onClick={handleResetAll}
          className="w-full"
        >
          <RotateCcw className="mr-2 h-4 w-4" strokeWidth={1.5} />
          {t.wochenbett.resetAll}
        </Button>
      </div>

      {/* SR live region */}
      <div className="sr-only" aria-live="polite">
        {checkedCount} / {totalVisible}
      </div>
    </div>
  )
}
