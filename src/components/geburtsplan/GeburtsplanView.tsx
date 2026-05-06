'use client'

import { useRef, useState } from 'react'
import { STAGE_UNLOCK, countAnswered, getStageQuestions } from '@/lib/questions'
import { exportGeburtsplanPDF } from '@/lib/pdfExport'
import { QuestionCard } from './QuestionCard'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface Props {
  initialAnswers: Record<string, unknown>
  ssw: number
  babyName: string
  dueDate: string
}

const STAGE_LABELS = {
  1: { title: 'Kern-Entscheidungen', emoji: '💛', total: 5 },
  2: { title: 'Vertiefung', emoji: '🌿', total: 7 },
  3: { title: 'Wochenbett', emoji: '🛏️', total: 5 },
}

export function GeburtsplanView({ initialAnswers, ssw, babyName, dueDate }: Props) {
  const [answers, setAnswers] = useState<Record<string, unknown>>(initialAnswers)
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

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
      await exportGeburtsplanPDF({ babyName, dueDate, answers })
    } finally {
      setExporting(false)
    }
  }

  const totalAnswered = ([1, 2, 3] as const).reduce((sum, s) => sum + countAnswered(answers, s), 0)
  const totalUnlocked = ([1, 2, 3] as const).reduce((sum, s) => ssw >= STAGE_UNLOCK[s] ? sum + getStageQuestions(s).length : sum, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Gesamtfortschritt</p>
            <p className="text-2xl font-bold text-rose-500">{totalAnswered} / {totalUnlocked}</p>
          </div>
          <Button onClick={handleExport} disabled={exporting} variant="outline" className="border-rose-200 text-rose-500 hover:bg-rose-50">
            {exporting ? 'Erstelle PDF...' : '📄 Als PDF exportieren'}
          </Button>
        </div>
        <Progress value={totalUnlocked > 0 ? (totalAnswered / totalUnlocked) * 100 : 0} className="h-2" />
        {saving && <p className="mt-2 text-xs text-gray-400">Speichern...</p>}
      </div>

      {/* Stages */}
      {([1, 2, 3] as const).map((stage) => {
        const isUnlocked = ssw >= STAGE_UNLOCK[stage]
        const questions = getStageQuestions(stage)
        const answered = countAnswered(answers, stage)
        const meta = STAGE_LABELS[stage]
        const unlockSSW = STAGE_UNLOCK[stage]

        return (
          <section key={stage}>
            <div className="mb-3 flex items-center gap-3">
              <span className="text-xl">{meta.emoji}</span>
              <h2 className="font-semibold text-gray-800">{meta.title}</h2>
              {isUnlocked ? (
                <Badge variant="secondary" className="text-xs">{answered} / {questions.length} beantwortet</Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-gray-400">Ab SSW {unlockSSW}</Badge>
              )}
            </div>

            {!isUnlocked ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-5 py-8 text-center">
                <p className="text-2xl">🔒</p>
                <p className="mt-2 text-sm font-medium text-gray-500">
                  Wird in SSW {unlockSSW} freigeschaltet
                </p>
                <p className="text-xs text-gray-400">Du bist in SSW {ssw} — noch {unlockSSW - ssw} Wochen</p>
              </div>
            ) : (
              <div className="space-y-3">
                {questions.map((q) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    value={answers[q.id] as string | string[] | undefined}
                    onChange={handleChange}
                  />
                ))}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
