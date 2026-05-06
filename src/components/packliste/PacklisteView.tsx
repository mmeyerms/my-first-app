'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

import { PACK_CATEGORIES } from '@/lib/packliste'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'

const STORAGE_KEY = 'mamamap-packliste'

export function PacklisteView() {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    () => Object.fromEntries(PACK_CATEGORIES.map((c) => [c.id, true])),
  )
  const [hydrated, setHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as string[]
        if (Array.isArray(parsed)) {
          setChecked(new Set(parsed))
        }
      }
    } catch {
      // ignore parse errors
    }
    setHydrated(true)
  }, [])

  // Persist on change
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(checked)))
    } catch {
      // ignore quota errors
    }
  }, [checked, hydrated])

  const totalItems = useMemo(
    () => PACK_CATEGORIES.reduce((sum, c) => sum + c.items.length, 0),
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

  return (
    <div className="space-y-5">
      {/* Progress card */}
      <section
        aria-label="Fortschritt"
        className="rounded-2xl bg-white p-5 shadow-sm"
      >
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm font-medium text-gray-700">
            Fortschritt
          </span>
          <span className="text-sm text-gray-500">
            {checkedCount} / {totalItems}
          </span>
        </div>
        <Progress value={progress} className="h-2 bg-rose-100 [&>div]:bg-rose-500" />
        <p className="mt-3 text-sm text-gray-600">
          {allDone
            ? 'Super vorbereitet! 🎉 Du kannst loslegen.'
            : checkedCount === 0
              ? 'Lass uns gemeinsam alles zusammenpacken — du schaffst das!'
              : `Stark! Noch ${totalItems - checkedCount} Punkte bis zur fertigen Tasche.`}
        </p>
      </section>

      {/* Categories */}
      {PACK_CATEGORIES.map((cat) => {
        const isOpen = openCategories[cat.id]
        const catChecked = cat.items.filter((it) => checked.has(it.id)).length
        return (
          <section
            key={cat.id}
            aria-label={cat.title}
            className="overflow-hidden rounded-2xl bg-white shadow-sm"
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
                  <h2 className="text-base font-semibold text-gray-800">
                    {cat.title}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {catChecked} / {cat.items.length} eingepackt
                  </p>
                </div>
              </div>
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {isOpen && (
              <ul className="space-y-3 border-t border-gray-100 px-5 py-4">
                {cat.items.map((item) => {
                  const isChecked = checked.has(item.id)
                  return (
                    <li key={item.id} className="flex items-start gap-3">
                      <Checkbox
                        id={item.id}
                        checked={isChecked}
                        onCheckedChange={() => toggleItem(item.id)}
                        className="mt-1 data-[state=checked]:border-rose-500 data-[state=checked]:bg-rose-500"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor={item.id}
                          className={`block cursor-pointer text-sm leading-snug ${
                            isChecked
                              ? 'text-gray-400 line-through'
                              : 'text-gray-800'
                          }`}
                        >
                          {item.label}
                        </Label>
                        {item.tip && (
                          <p className="mt-1 text-xs text-gray-500">
                            💡 {item.tip}
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

      {/* Reset */}
      <div className="pt-2">
        <Button
          variant="outline"
          onClick={resetAll}
          className="w-full border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
        >
          Alles zurücksetzen
        </Button>
      </div>

      {/* Tiny status badge for screen readers */}
      <div className="sr-only" aria-live="polite">
        <Badge variant="secondary">
          {checkedCount} von {totalItems} eingepackt
        </Badge>
      </div>
    </div>
  )
}
