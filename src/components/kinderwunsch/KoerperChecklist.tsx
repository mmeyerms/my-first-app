'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

import { KOERPER_KATEGORIEN } from '@/lib/kinderwunsch/koerper'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { useLocale } from '@/lib/i18n/client'
import { localized } from '@/lib/i18n/localized'
import { useTheme } from '@/lib/theme/client'

const STORAGE_KEY = 'mamamap-kw-koerper'
const ISLAND = 'koerper'

export function KoerperChecklist() {
  const { locale } = useLocale()
  const { theme } = useTheme()
  const isClassic = theme === 'classic'
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    () => Object.fromEntries(KOERPER_KATEGORIEN.map((c) => [c.id, true])),
  )
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/kinderwunsch')
      .then((r) => r.json())
      .then(async (data) => {
        if (cancelled) return
        const apiState: string[] = Array.isArray(data?.[ISLAND]) ? data[ISLAND] : []
        const isEmpty = apiState.length === 0

        if (isEmpty && typeof window !== 'undefined') {
          try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw) {
              const parsed = JSON.parse(raw) as unknown
              if (Array.isArray(parsed) && parsed.length > 0) {
                const onlyStrings = parsed.filter(
                  (x): x is string => typeof x === 'string',
                )
                await fetch(`/api/kinderwunsch/${ISLAND}`, {
                  method: 'PUT',
                  headers: { 'content-type': 'application/json' },
                  body: JSON.stringify({ state: onlyStrings }),
                })
                localStorage.removeItem(STORAGE_KEY)
                if (!cancelled) setChecked(new Set(onlyStrings))
                return
              }
            }
          } catch {
            // ignore migration errors
          }
        }
        if (!cancelled) setChecked(new Set(apiState))
      })
      .catch(() => {
        // ignore fetch errors — keep empty state
      })
      .finally(() => {
        if (!cancelled) setHydrated(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    const handle = setTimeout(() => {
      fetch(`/api/kinderwunsch/${ISLAND}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ state: Array.from(checked) }),
      }).catch(() => {
        // ignore save errors silently
      })
    }, 500)
    return () => clearTimeout(handle)
  }, [checked, hydrated])

  const totalItems = useMemo(
    () => KOERPER_KATEGORIEN.reduce((sum, c) => sum + c.items.length, 0),
    [],
  )
  const checkedCount = checked.size
  const progress = totalItems === 0 ? 0 : Math.round((checkedCount / totalItems) * 100)
  const allDone = checkedCount === totalItems && totalItems > 0

  function toggleItem(id: string) {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function toggleCategory(id: string) {
    setOpenCategories((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function resetAll() {
    if (window.confirm('Möchtest du wirklich alle Häkchen entfernen?')) {
      setChecked(new Set())
    }
  }

  if (!hydrated) {
    return (
      <div className="rounded-2xl bg-card p-5 text-sm text-muted-foreground shadow-sm">
        Lade...
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <section
        aria-label="Fortschritt"
        className="rounded-2xl bg-card p-5 shadow-sm"
      >
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm font-medium text-foreground/80">Fortschritt</span>
          <span className="text-sm text-muted-foreground">
            {checkedCount} / {totalItems}
          </span>
        </div>
        <Progress value={progress} className="h-2 bg-secondary [&>div]:bg-primary" />
        <p className="mt-3 text-sm text-muted-foreground">
          {allDone
            ? isClassic
              ? 'Stark — dein Körper ist bestens vorbereitet. 🌷'
              : 'Stark — dein Körper ist bestens vorbereitet.'
            : checkedCount === 0
              ? 'Kein Druck — dies ist kein Test, sondern ein liebevoller Check für deinen Körper.'
              : `Schon ${checkedCount} Punkte erledigt. Weiter so!`}
        </p>
      </section>

      {KOERPER_KATEGORIEN.map((cat) => {
        const isOpen = openCategories[cat.id]
        const catChecked = cat.items.filter((it) => checked.has(it.id)).length
        return (
          <section
            key={cat.id}
            aria-label={localized(cat.title, locale)}
            className="overflow-hidden rounded-2xl bg-card shadow-sm"
          >
            <button
              type="button"
              onClick={() => toggleCategory(cat.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <div className="flex items-center gap-3">
                {isClassic && (
                  <span className="text-2xl" aria-hidden="true">
                    {cat.emoji}
                  </span>
                )}
                <div>
                  <h2
                    className={
                      isClassic
                        ? 'text-base font-semibold text-foreground'
                        : 'font-display text-lg font-medium text-foreground'
                    }
                  >
                    {localized(cat.title, locale)}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {catChecked} / {cat.items.length} erledigt
                  </p>
                </div>
              </div>
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground/70" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground/70" />
              )}
            </button>

            {isOpen && (
              <ul className="space-y-3 border-t border-border px-5 py-4">
                {cat.items.map((item) => {
                  const isChecked = checked.has(item.id)
                  return (
                    <li key={item.id} className="flex items-start gap-3">
                      <Checkbox
                        id={item.id}
                        checked={isChecked}
                        onCheckedChange={() => toggleItem(item.id)}
                        className="mt-1 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor={item.id}
                          className={`block cursor-pointer text-sm leading-snug ${
                            isChecked
                              ? 'text-muted-foreground/70 line-through'
                              : 'text-foreground'
                          }`}
                        >
                          {localized(item.label, locale)}
                        </Label>
                        {item.tip && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {isClassic ? '💡 ' : ''}
                            {localized(item.tip, locale)}
                          </p>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        )
      })}

      <div className="pt-2">
        <Button
          variant="outline"
          onClick={resetAll}
          className="w-full border-primary/20 text-primary hover:bg-secondary hover:text-primary"
        >
          Alles zurücksetzen
        </Button>
      </div>

      <div className="sr-only" aria-live="polite">
        <Badge variant="secondary">
          {checkedCount} von {totalItems} erledigt
        </Badge>
      </div>
    </div>
  )
}
