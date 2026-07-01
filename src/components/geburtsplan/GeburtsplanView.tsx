'use client'

import { useMemo, useRef, useState } from 'react'
import { Question, STAGE_UNLOCK, getStageQuestions } from '@/lib/questions'
import { exportGeburtsplanPDF } from '@/lib/pdfExport'
import { useLocale, useT } from '@/lib/i18n/client'
import { usePreferences } from '@/lib/preferences/client'
import { QuestionCard } from './QuestionCard'
import { AudioBriefing } from './AudioBriefing'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

const SHORT_SET = new Set([
  'location',
  'companions',
  'pain_management',
  'wishes',
  'no_gos',
])

const CLINIC_PRESET_LABEL: Record<string, string> = {
  klinik: 'Klinikgeburt',
  hausgeburt: 'Hausgeburt',
  geburtshaus: 'Geburtshaus',
  ambulant: 'Ambulante Geburt',
}

interface Props {
  initialAnswers: Record<string, unknown>
  ssw: number
  babyName: string
  dueDate: string
}

const STAGE_EMOJI: Record<1 | 2 | 3, string> = {
  1: '💛',
  2: '🌿',
  3: '🛏️',
}

function isAnsweredValue(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'string') return value.trim().length > 0
  return false
}

/** Narrow the loose `Record<string, unknown>` answers to the shape the briefing expects. */
function toBriefingAnswers(
  answers: Record<string, unknown>,
): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {}
  for (const [key, value] of Object.entries(answers)) {
    if (Array.isArray(value)) {
      const strs = value.filter((v): v is string => typeof v === 'string')
      if (strs.length > 0) out[key] = strs
    } else if (typeof value === 'string' && value.trim().length > 0) {
      out[key] = value
    }
  }
  return out
}

export function GeburtsplanView({ initialAnswers, ssw, babyName, dueDate }: Props) {
  const { locale } = useLocale()
  const t = useT()
  const { prefs } = usePreferences()
  const [answers, setAnswers] = useState<Record<string, unknown>>(initialAnswers)
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const stageTitle = (stage: 1 | 2 | 3) => t.geburtsplan.stages[stage]
  const isShort = prefs.geburtsplanQuestionSet === 'short'
  const clinicPreset = prefs.geburtsplanClinicPreset

  const allQuestions: Question[] = useMemo(() => {
    const all = ([1, 2, 3] as const).flatMap((stage) =>
      ssw >= STAGE_UNLOCK[stage] ? getStageQuestions(stage) : [],
    )
    if (isShort) return all.filter((q) => SHORT_SET.has(q.id))
    return all
  }, [ssw, isShort])

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

  const briefingAnswers = useMemo(() => toBriefingAnswers(answers), [answers])

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

  // Empty state
  if (allQuestions.length === 0) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm text-center space-y-3">
          <p className="text-3xl">🔒</p>
          <p className="text-sm text-gray-500">{t.geburtsplan.emptyTitle}</p>
        </div>
        <div className="text-center">
          <Link href="/dashboard">
            <Button variant="ghost">{t.geburtsplan.navigation.bottomBack}</Button>
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
          <h2 className="text-xl font-bold text-gray-800">{t.geburtsplan.completed.title}</h2>
          <p className="text-sm text-gray-500">{t.geburtsplan.completed.subtitle.replace('{answered}', String(answered))}</p>
          <Button
            onClick={handleExport}
            disabled={exporting}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {exporting ? t.geburtsplan.completed.exportingPdf : t.geburtsplan.completed.exportPdf}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setShowCompletion(false)
              setCurrentIndex(0)
            }}
          >
            {t.geburtsplan.completed.viewAgain}
          </Button>
        </div>

        <AudioBriefing answers={briefingAnswers} locale={locale} babyName={babyName} />

        {lockedStages.length > 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 space-y-2">
            {lockedStages.map((stage) => (
              <p key={stage} className="text-xs text-gray-500">
                <span className="mr-1">🔒</span>
                {t.geburtsplan.lockedStage
                  .replace('{stage}', String(stage))
                  .replace('{title}', stageTitle(stage))
                  .replace('{unlockSsw}', String(STAGE_UNLOCK[stage]))}
              </p>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link href="/dashboard">
            <Button variant="ghost">{t.geburtsplan.navigation.bottomBack}</Button>
          </Link>
        </div>
      </div>
    )
  }

  const currentQuestion = allQuestions[currentIndex]
  const currentStage = currentQuestion.stage
  const isLastQuestion = currentIndex === allQuestions.length - 1

  return (
    <div className="space-y-4">
      {(isShort || clinicPreset) && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/20 bg-secondary/40 px-3 py-2 text-xs">
          {isShort && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">Kurzform</span>
          )}
          {clinicPreset && CLINIC_PRESET_LABEL[clinicPreset] && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
              {CLINIC_PRESET_LABEL[clinicPreset]}
            </span>
          )}
          <Link href="/einstellungen" className="ml-auto text-muted-foreground underline decoration-dotted hover:text-primary">
            ändern
          </Link>
        </div>
      )}

      {/* Progress header */}
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
          <span>
            {t.geburtsplan.questionOfTotal
              .replace('{current}', String(currentIndex + 1))
              .replace('{total}', String(allQuestions.length))}
          </span>
          <span>
            {t.geburtsplan.progress
              .replace('{answered}', String(answered))
              .replace('{total}', String(allQuestions.length))}
          </span>
        </div>
        <Progress value={progressPct} className="h-2" />
        {saving && <p className="mt-2 text-xs text-gray-400">{t.geburtsplan.saving}</p>}
      </div>

      {/* Stage badge */}
      <div className="flex items-center gap-2 px-1">
        <span aria-hidden>{STAGE_EMOJI[currentStage]}</span>
        <span className="text-xs font-medium text-gray-500">
          {t.geburtsplan.stageBadge
            .replace('{stage}', String(currentStage))
            .replace('{title}', stageTitle(currentStage))}
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
          aria-label={t.geburtsplan.navigation.backAria}
        >
          {t.geburtsplan.navigation.back}
        </Button>
        <Button
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={next}
          aria-label={isLastQuestion ? t.geburtsplan.navigation.finishAria : t.geburtsplan.navigation.nextAria}
        >
          {isLastQuestion ? t.geburtsplan.navigation.finish : t.geburtsplan.navigation.next}
        </Button>
      </div>

      {/* Locked stages info */}
      {lockedStages.length > 0 && (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 space-y-2">
          {lockedStages.map((stage) => (
            <div key={stage} className="flex items-start gap-2">
              <span aria-hidden>🔒</span>
              <p className="text-xs text-gray-500">
                {t.geburtsplan.lockedStageWithSsw
                  .replace('{stage}', String(stage))
                  .replace('{title}', stageTitle(stage))
                  .replace('{unlockSsw}', String(STAGE_UNLOCK[stage]))
                  .replace('{ssw}', String(ssw))}
              </p>
            </div>
          ))}
          <Link href="/dashboard" className="text-xs text-primary hover:underline">
            {t.geburtsplan.navigation.dashboardLink}
          </Link>
        </div>
      )}

      {/* Audio briefing preview (shown once enough questions are answered) */}
      <AudioBriefing answers={briefingAnswers} locale={locale} babyName={babyName} />

      {/* Bottom dashboard link */}
      <div className="text-center">
        <Link href="/dashboard" className="text-xs text-gray-400 hover:text-gray-600">
          {t.geburtsplan.navigation.bottomBack}
        </Link>
      </div>
    </div>
  )
}
