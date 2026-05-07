'use client'

import { useMemo, useRef, useState } from 'react'
import { Question, STAGE_UNLOCK, getStageQuestions } from '@/lib/questions'
import { exportGeburtsplanPDF } from '@/lib/pdfExport'
import { useLocale } from '@/lib/i18n/client'
import { QuestionCard } from './QuestionCard'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface Props {
  initialAnswers: Record<string, unknown>
  ssw: number
  babyName: string
  dueDate: string
}

const STAGE_LABELS: Record<1 | 2 | 3, { title: string; emoji: string }> = {
  1: { title: 'Kern-Entscheidungen', emoji: '💛' },
  2: { title: 'Vertiefung', emoji: '🌿' },
  3: { title: 'Wochenbett', emoji: '🛏️' },
}

function isAnsweredValue(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'string') return value.trim().length > 0
  return false
}

export function GeburtsplanView({ initialAnswers, ssw, babyName, dueDate }: Props) {
  const { locale } = useLocale()
  const [answers, setAnswers] = useState<Record<string, unknown>>(initialAnswers)
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Build the flat list of all unlocked questions, in stage order, preserving question order within each stage
  const allQuestions: Question[] = useMemo(() => {
    return ([1, 2, 3] as const).flatMap((stage) =>
      ssw >= STAGE_UNLOCK[stage] ? getStageQuestions(stage) : [],
    )
  }, [ssw])

  // Find first unanswered question to start at
  const initialIndex = useMemo(() => {
    if (allQuestions.length === 0) return 0
    const idx = allQuestions.findIndex((q) => !isAnsweredValue(initialAnswers[q.id]))
    return idx === -1 ? 0 : idx
  }, [allQuestions, initialAnswers])

  const initiallyAllAnswered = useMemo(() => {
    return allQuestions.length > 0 && allQuestions.every((q) => isAnsweredValue(initialAnswers[q.id]))
  }, [allQuestions, initialAnswers])

  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex)
  const [showCompletion, setShowCompletion] = useState<boolean>(initiallyAllAnswered)

  const lockedStages = useMemo(
    () => ([1, 2, 3] as const).filter((stage) => ssw < STAGE_UNLOCK[stage]),
    [ssw],
  )

  const answered = useMemo(
    () => allQuestions.filter((q) => isAnsweredValue(answers[q.id])).length,
    [allQuestions, answers],
  )

  const progressPct = allQuestions.length > 0 ? (answered / allQuestions.length) * 100 : 0

  function handleChange(id: string, value: string | string[]) {
    const updated = { ...answers, [id]: value }
    setAnswers(updated)
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => autosave(updated), 800)
  }

  async function autosave(data: Record<string, unknown>) {
    setSaving(true)
    try {
      await fetch('/api/geburtsplan', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ answers: data }),
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleExport() {
    setExporting(true)
    try {
      await exportGeburtsplanPDF({ babyName, dueDate, answers, locale })
    } finally {
      setExporting(false)
    }
  }

  function prev() {
    setCurrentIndex((i) => Math.max(0, i - 1))
  }

  function next() {
    if (currentIndex >= allQuestions.length - 1) {
      setShowCompletion(true)
      return
    }
    setCurrentIndex((i) => Math.min(allQuestions.length - 1, i + 1))
  }

  // Empty state — no unlocked questions at all (shouldn't happen since stage 1 is always unlocked, but guard anyway)
  if (allQuestions.length === 0) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm text-center space-y-3">
          <p className="text-3xl">🔒</p>
          <p className="text-sm text-gray-500">Es sind noch keine Fragen freigeschaltet.</p>
        </div>
        <div className="text-center">
          <Link href="/dashboard">
            <Button variant="ghost">← Zum Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Completion screen
  if (showCompletion) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm text-center space-y-3">
          <p className="text-4xl">🎉</p>
          <h2 className="text-xl font-bold text-gray-800">Dein Geburtsplan ist vollständig!</h2>
          <p className="text-sm text-gray-500">{answered} Fragen beantwortet</p>
          <Button
            onClick={handleExport}
            disabled={exporting}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {exporting ? 'Erstelle PDF...' : '📄 Als PDF exportieren'}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setShowCompletion(false)
              setCurrentIndex(0)
            }}
          >
            Fragen nochmal ansehen
          </Button>
        </div>

        {lockedStages.length > 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 space-y-2">
            {lockedStages.map((stage) => (
              <p key={stage} className="text-xs text-gray-500">
                <span className="mr-1">🔒</span>
                Stufe {stage} ({STAGE_LABELS[stage].title}) wird ab SSW {STAGE_UNLOCK[stage]} freigeschaltet
              </p>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link href="/dashboard">
            <Button variant="ghost">← Zum Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const currentQuestion = allQuestions[currentIndex]
  const currentStage = currentQuestion.stage
  const stageMeta = STAGE_LABELS[currentStage]
  const isLastQuestion = currentIndex === allQuestions.length - 1

  return (
    <div className="space-y-4">
      {/* Progress header */}
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
          <span>
            Frage {currentIndex + 1} von {allQuestions.length}
          </span>
          <span>
            {answered} von {allQuestions.length} beantwortet
          </span>
        </div>
        <Progress value={progressPct} className="h-2" />
        {saving && <p className="mt-2 text-xs text-gray-400">Speichern...</p>}
      </div>

      {/* Stage badge */}
      <div className="flex items-center gap-2 px-1">
        <span aria-hidden>{stageMeta.emoji}</span>
        <span className="text-xs font-medium text-gray-500">
          Stufe {currentStage} · {stageMeta.title}
        </span>
      </div>

      {/* Current question */}
      <QuestionCard
        key={currentQuestion.id}
        question={currentQuestion}
        value={answers[currentQuestion.id] as string | string[] | undefined}
        onChange={handleChange}
      />

      {/* Navigation */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={prev}
          disabled={currentIndex === 0}
          aria-label="Vorherige Frage"
        >
          ← Zurück
        </Button>
        <Button
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={next}
          aria-label={isLastQuestion ? 'Geburtsplan abschließen' : 'Nächste Frage'}
        >
          {isLastQuestion ? 'Fertig ✓' : 'Weiter →'}
        </Button>
      </div>

      {/* Locked stages info */}
      {lockedStages.length > 0 && (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 space-y-2">
          {lockedStages.map((stage) => (
            <div key={stage} className="flex items-start gap-2">
              <span aria-hidden>🔒</span>
              <p className="text-xs text-gray-500">
                Stufe {stage} ({STAGE_LABELS[stage].title}) wird ab SSW {STAGE_UNLOCK[stage]} freigeschaltet — du bist
                in SSW {ssw}.
              </p>
            </div>
          ))}
          <Link href="/dashboard" className="text-xs text-primary hover:underline">
            Zum Dashboard →
          </Link>
        </div>
      )}

      {/* Bottom dashboard link */}
      <div className="text-center">
        <Link href="/dashboard" className="text-xs text-gray-400 hover:text-gray-600">
          ← Zurück zum Dashboard
        </Link>
      </div>
    </div>
  )
}
