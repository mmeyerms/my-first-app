'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { TEAM_FRAGEN } from '@/lib/kinderwunsch/teamFragen'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { useLocale } from '@/lib/i18n/client'
import { localized } from '@/lib/i18n/localized'
import { useTheme } from '@/lib/theme/client'

const STORAGE_KEY = 'mamamap-kw-team'

export function TeamFragen() {
  const { locale } = useLocale()
  const { theme } = useTheme()
  const isClassic = theme === 'classic'
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [hydrated, setHydrated] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, string>
        if (parsed && typeof parsed === 'object') {
          setAnswers(parsed)
        }
      }
    } catch {
      // ignore parse errors
    }
    setHydrated(true)
  }, [])

  // Debounced autosave
  useEffect(() => {
    if (!hydrated) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
        setSavedAt(Date.now())
      } catch {
        // ignore quota errors
      }
    }, 500)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [answers, hydrated])

  const answeredCount = useMemo(
    () =>
      TEAM_FRAGEN.filter((f) => {
        const a = answers[f.id]
        return typeof a === 'string' && a.trim().length > 0
      }).length,
    [answers],
  )

  const total = TEAM_FRAGEN.length
  const progress = total === 0 ? 0 : Math.round((answeredCount / total) * 100)

  function updateAnswer(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  // Show "saved" indicator briefly after save
  const showSaved = savedAt !== null && Date.now() - savedAt < 2000

  return (
    <div className="space-y-5">
      <section
        aria-label="10 Fragen für euch als Team"
        className="rounded-2xl bg-white p-5 shadow-sm"
      >
        <h2
          className={
            isClassic
              ? 'text-base font-semibold text-gray-800'
              : 'font-display text-xl font-medium text-foreground'
          }
        >
          {isClassic ? '💛 ' : ''}Wir als Team
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          10 tiefe Fragen, die ihr gemeinsam beantworten könnt. Es gibt keine
          richtigen Antworten — nur eure.
        </p>
        <div className="mt-4">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-sm font-medium text-gray-700">
              {answeredCount} von {total} beantwortet
            </span>
            {showSaved && (
              <span className="text-xs text-rose-500">✓ Gespeichert</span>
            )}
          </div>
          <Progress value={progress} className="h-2 bg-rose-100 [&>div]:bg-rose-500" />
        </div>
      </section>

      {TEAM_FRAGEN.map((frage, idx) => {
        const value = answers[frage.id] ?? ''
        const isAnswered = value.trim().length > 0
        return (
          <section
            key={frage.id}
            aria-label={`Frage ${idx + 1}`}
            className="rounded-2xl bg-white p-5 shadow-sm"
          >
            <div className="flex items-start gap-3">
              {isClassic && (
                <span className="text-2xl" aria-hidden="true">
                  {frage.emoji}
                </span>
              )}
              <div className="flex-1">
                <p
                  className={
                    isClassic
                      ? 'text-xs font-medium text-rose-500'
                      : 'text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground'
                  }
                >
                  Frage {idx + 1} / {total}
                </p>
                <p
                  className={
                    isClassic
                      ? 'mt-1 text-base font-semibold leading-snug text-gray-800'
                      : 'mt-1 font-display text-lg font-medium leading-snug text-foreground'
                  }
                >
                  {localized(frage.question, locale)}
                </p>
                {frage.hint && (
                  <p className="mt-2 text-xs text-gray-500">{localized(frage.hint, locale)}</p>
                )}
              </div>
              {isAnswered && (
                <Badge variant="secondary" className="bg-rose-100 text-rose-600">
                  ✓
                </Badge>
              )}
            </div>
            <div className="mt-4">
              <Textarea
                value={value}
                onChange={(e) => updateAnswer(frage.id, e.target.value)}
                placeholder="Eure gemeinsame Antwort..."
                aria-label={`Antwort auf Frage ${idx + 1}: ${localized(frage.question, locale)}`}
                className="min-h-[80px] resize-y border-rose-100 focus-visible:ring-rose-500"
              />
            </div>
          </section>
        )
      })}

      <div className="sr-only" aria-live="polite">
        {answeredCount} von {total} Fragen beantwortet
      </div>
    </div>
  )
}
