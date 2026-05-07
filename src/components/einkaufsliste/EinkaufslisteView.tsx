'use client'

import { useEffect, useMemo, useState } from 'react'

import { EINKAUF_KATEGORIEN, type EinkaufKategorie } from '@/lib/einkaufsliste'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { useLocale } from '@/lib/i18n/client'
import { localized } from '@/lib/i18n/localized'

const STORAGE_KEY = 'mamamap-einkaufsliste'

type Priority = 'must' | 'nice' | 'skip'

const PRIORITY_META: Record<
  Priority,
  { title: string; emoji: string; description: string; badge: string }
> = {
  must: {
    title: 'Unbedingt nötig',
    emoji: '✅',
    description: 'Diese Dinge brauchst du wirklich vom ersten Tag an.',
    badge: 'Must-have',
  },
  nice: {
    title: 'Sehr praktisch',
    emoji: '⭐',
    description: 'Macht den Alltag leichter — schöne Ergänzungen.',
    badge: 'Nice-to-have',
  },
  skip: {
    title: 'Oft überschätzt',
    emoji: '🤷',
    description: 'Viele kaufen das — du brauchst es meistens nicht.',
    badge: 'Optional',
  },
}

export function EinkaufslisteView() {
  const { locale } = useLocale()
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [hydrated, setHydrated] = useState(false)

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
      // ignore
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(checked)))
    } catch {
      // ignore
    }
  }, [checked, hydrated])

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

  return (
    <div className="space-y-6">
      {priorities.map((priority) => {
        const cats = grouped[priority]
        if (cats.length === 0) return null

        const allItems = cats.flatMap((c) => c.items)
        const sectionChecked = allItems.filter((it) => checked.has(it.id)).length
        const sectionTotal = allItems.length
        const sectionProgress =
          sectionTotal === 0 ? 0 : Math.round((sectionChecked / sectionTotal) * 100)
        const meta = PRIORITY_META[priority]
        const isSkip = priority === 'skip'

        return (
          <section
            key={priority}
            aria-label={meta.title}
            className={`overflow-hidden rounded-2xl shadow-sm ${
              isSkip ? 'bg-gray-50' : 'bg-white'
            }`}
          >
            <header className="px-5 pt-5">
              <div className="mb-1 flex items-center justify-between">
                <h2
                  className={`flex items-center gap-2 text-base font-semibold ${
                    isSkip ? 'text-gray-600' : 'text-gray-800'
                  }`}
                >
                  <span className="text-xl" aria-hidden="true">
                    {meta.emoji}
                  </span>
                  {meta.title}
                </h2>
                <Badge
                  variant="secondary"
                  className={
                    isSkip
                      ? 'bg-gray-200 text-gray-600'
                      : priority === 'must'
                        ? 'bg-rose-100 text-rose-600'
                        : 'bg-amber-100 text-amber-700'
                  }
                >
                  {meta.badge}
                </Badge>
              </div>
              <p className={`text-xs ${isSkip ? 'text-gray-500' : 'text-gray-500'}`}>
                {meta.description}
              </p>
              <div className="mt-3">
                <div className="mb-1 flex items-baseline justify-between text-xs">
                  <span className={isSkip ? 'text-gray-500' : 'text-gray-600'}>
                    Fortschritt
                  </span>
                  <span className={isSkip ? 'text-gray-500' : 'text-gray-500'}>
                    {sectionChecked} / {sectionTotal}
                  </span>
                </div>
                <Progress
                  value={sectionProgress}
                  className={`h-1.5 ${
                    isSkip
                      ? 'bg-gray-200 [&>div]:bg-gray-400'
                      : 'bg-rose-100 [&>div]:bg-rose-500'
                  }`}
                />
              </div>
            </header>

            <div className="space-y-5 px-5 py-5">
              {cats.map((cat) => {
                const catChecked = cat.items.filter((it) => checked.has(it.id)).length
                return (
                  <div key={cat.id}>
                    <div className="mb-2 flex items-center justify-between">
                      <h3
                        className={`flex items-center gap-2 text-sm font-medium ${
                          isSkip ? 'text-gray-600' : 'text-gray-700'
                        }`}
                      >
                        <span aria-hidden="true">{cat.emoji}</span>
                        {localized(cat.title, locale)}
                      </h3>
                      <span className="text-xs text-gray-400">
                        {catChecked} / {cat.items.length}
                      </span>
                    </div>
                    <ul className="space-y-3">
                      {cat.items.map((item) => {
                        const isChecked = checked.has(item.id)
                        return (
                          <li key={item.id} className="flex items-start gap-3">
                            <Checkbox
                              id={item.id}
                              checked={isChecked}
                              onCheckedChange={() => toggleItem(item.id)}
                              className={`mt-1 ${
                                isSkip
                                  ? 'data-[state=checked]:border-gray-500 data-[state=checked]:bg-gray-500'
                                  : 'data-[state=checked]:border-rose-500 data-[state=checked]:bg-rose-500'
                              }`}
                            />
                            <div className="flex-1">
                              <Label
                                htmlFor={item.id}
                                className={`block cursor-pointer text-sm leading-snug ${
                                  isSkip
                                    ? isChecked
                                      ? 'text-gray-400 line-through'
                                      : 'text-gray-500 line-through decoration-gray-300'
                                    : isChecked
                                      ? 'text-gray-400 line-through'
                                      : 'text-gray-800'
                                }`}
                              >
                                {localized(item.label, locale)}
                              </Label>
                              {item.tip && (
                                <p
                                  className={`mt-1 text-xs ${
                                    isSkip ? 'text-gray-400' : 'text-gray-500'
                                  }`}
                                >
                                  💡 {localized(item.tip, locale)}
                                </p>
                              )}
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
