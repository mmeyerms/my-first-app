'use client'

import { useState } from 'react'
import { getPartnerTipForDay, PARTNER_TIP_LABELS, type PartnerTipType } from '@/lib/partnerTips'
import { getCoupleQuestionForDay, type CoupleQuestion } from '@/lib/coupleQuestions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Props {
  ssw: number
  babyName: string
}

const CATEGORY_LABELS: Record<CoupleQuestion['category'], string> = {
  traum: 'Träume',
  erinnerung: 'Erinnerungen',
  zukunft: 'Zukunft',
  spass: 'Spaß',
  gefuehl: 'Gefühle',
}

function tipBadgeClass(type: PartnerTipType): string {
  if (type === 'witzig') return 'border-transparent bg-amber-100 text-amber-800 hover:bg-amber-100'
  if (type === 'positiv') return 'border-transparent bg-rose-100 text-rose-800 hover:bg-rose-100'
  return ''
}

function tipBadgeVariant(type: PartnerTipType): 'secondary' | 'default' {
  if (type === 'witzig' || type === 'positiv') return 'default'
  return 'secondary'
}

export function PartnerContentView({ ssw, babyName }: Props) {
  const tip = getPartnerTipForDay(ssw)
  const question = getCoupleQuestionForDay()

  const [questionCopied, setQuestionCopied] = useState(false)
  const [tipCopied, setTipCopied] = useState(false)

  async function handleShareQuestion() {
    const text = `💕 MamaMap Frage des Tages\n\n${question.emoji} ${question.question}\n\n– Stellt euch diese Frage heute gemeinsam 🌸`

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ text })
      } else {
        await navigator.clipboard.writeText(text)
        setQuestionCopied(true)
        setTimeout(() => setQuestionCopied(false), 2000)
      }
    } catch {
      // User cancelled share or copy failed silently
    }
  }

  async function handleShareTip() {
    const text = `💛 Tipp für werdende Papas (SSW ${ssw})\n\n${tip.emoji} ${tip.text}\n\n– MamaMap`

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ text })
      } else {
        await navigator.clipboard.writeText(text)
        setTipCopied(true)
        setTimeout(() => setTipCopied(false), 2000)
      }
    } catch {
      // User cancelled share or copy failed silently
    }
  }

  return (
    <div className="mt-6 space-y-6">
      {/* Section A — Partner Tipp des Tages */}
      <section
        aria-labelledby="partner-tip-heading"
        className="rounded-2xl bg-white p-5 shadow-sm"
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 id="partner-tip-heading" className="text-base font-semibold text-gray-800">
            Tipp des Tages
          </h2>
          <Badge
            variant={tipBadgeVariant(tip.type)}
            className={tipBadgeClass(tip.type)}
          >
            {PARTNER_TIP_LABELS[tip.type]}
          </Badge>
        </div>

        <p className="mb-3 text-xs text-gray-500">
          Heute für {babyName} 💛
        </p>

        <div className="flex items-start gap-3">
          <span className="text-3xl" aria-hidden="true">
            {tip.emoji}
          </span>
          <p className="text-sm leading-relaxed text-gray-700">{tip.text}</p>
        </div>
      </section>

      {/* Section B — Frage des Tages */}
      <section
        aria-labelledby="couple-question-heading"
        className="rounded-2xl bg-rose-50 p-5 shadow-sm ring-1 ring-rose-100"
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2
            id="couple-question-heading"
            className="text-base font-semibold text-rose-900"
          >
            Frage des Tages
          </h2>
          <Badge
            variant="default"
            className="border-transparent bg-rose-200 text-rose-900 hover:bg-rose-200"
          >
            <span className="mr-1" aria-hidden="true">
              {question.emoji}
            </span>
            {CATEGORY_LABELS[question.category]}
          </Badge>
        </div>

        <p className="mb-5 text-lg font-medium leading-relaxed text-rose-950">
          {question.question}
        </p>

        <Button
          onClick={handleShareQuestion}
          className="w-full bg-rose-500 text-white hover:bg-rose-600"
          aria-label="Frage des Tages teilen oder kopieren"
        >
          {questionCopied ? '✓ Kopiert!' : '📤 Teilen / Kopieren'}
        </Button>
      </section>

      {/* Section C — Tipp für deinen Partner teilen */}
      <section
        aria-labelledby="share-tip-heading"
        className="rounded-2xl bg-white p-5 shadow-sm"
      >
        <h2
          id="share-tip-heading"
          className="mb-2 text-base font-semibold text-gray-800"
        >
          Kein App nötig!
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-gray-600">
          Schick deinem Partner diese Nachricht — er braucht dafür keine App.
        </p>

        <Button
          variant="outline"
          onClick={handleShareTip}
          className="w-full border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
          aria-label="Aktuellen Partner-Tipp teilen oder kopieren"
        >
          {tipCopied ? '✓ Kopiert!' : 'Tipp teilen'}
        </Button>
      </section>
    </div>
  )
}
