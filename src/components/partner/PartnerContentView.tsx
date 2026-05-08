'use client'

import { useState } from 'react'
import { getPartnerTipForDay, getPartnerTipText, getPartnerTipLabel, type PartnerTipType } from '@/lib/partnerTips'
import { getCoupleQuestionForDay, getCoupleQuestionText, type CoupleQuestion } from '@/lib/coupleQuestions'
import { useLocale, useT } from '@/lib/i18n/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Props {
  ssw: number
  babyName: string
}

const CATEGORY_LABELS: Record<CoupleQuestion['category'], { de: string; en: string }> = {
  traum: { de: 'Träume', en: 'Dreams' },
  erinnerung: { de: 'Erinnerungen', en: 'Memories' },
  zukunft: { de: 'Zukunft', en: 'Future' },
  spass: { de: 'Spaß', en: 'Fun' },
  gefuehl: { de: 'Gefühle', en: 'Feelings' },
}

function tipBadgeClass(type: PartnerTipType): string {
  if (type === 'witzig') return 'border-transparent bg-amber-100 text-amber-800 hover:bg-amber-100'
  if (type === 'positiv') return 'border-transparent bg-secondary text-primary hover:bg-secondary'
  return ''
}

function tipBadgeVariant(type: PartnerTipType): 'secondary' | 'default' {
  if (type === 'witzig' || type === 'positiv') return 'default'
  return 'secondary'
}

export function PartnerContentView({ ssw, babyName }: Props) {
  const { locale } = useLocale()
  const t = useT()
  const tip = getPartnerTipForDay(ssw)
  const question = getCoupleQuestionForDay()
  const tipText = getPartnerTipText(tip, locale)
  const tipLabel = getPartnerTipLabel(tip.type, locale)
  const questionText = getCoupleQuestionText(question, locale)

  const [questionCopied, setQuestionCopied] = useState(false)
  const [tipCopied, setTipCopied] = useState(false)

  async function handleShareQuestion() {
    const text = `💕 MamaMap Frage des Tages\n\n${question.emoji} ${questionText}\n\n– Stellt euch diese Frage heute gemeinsam 🌸`

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
    const text = `💛 Tipp für werdende Papas (SSW ${ssw})\n\n${tip.emoji} ${tipText}\n\n– MamaMap`

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
        className="rounded-2xl bg-card p-5 shadow-sm"
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 id="partner-tip-heading" className="text-base font-semibold text-foreground">
            {t.partner.content.tipToday}
          </h2>
          <Badge
            variant={tipBadgeVariant(tip.type)}
            className={tipBadgeClass(tip.type)}
          >
            {tipLabel}
          </Badge>
        </div>

        <p className="mb-3 text-xs text-muted-foreground">
          {t.partner.content.todayFor.replace('{babyName}', babyName)}
        </p>

        <div className="flex items-start gap-3">
          <span className="text-3xl" aria-hidden="true">
            {tip.emoji}
          </span>
          <p className="text-sm leading-relaxed text-foreground">{tipText}</p>
        </div>
      </section>

      {/* Section B — Frage des Tages */}
      <section
        aria-labelledby="couple-question-heading"
        className="rounded-2xl bg-secondary/60 p-5 shadow-sm ring-1 ring-primary/15"
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2
            id="couple-question-heading"
            className="text-base font-semibold text-primary"
          >
            {t.partner.content.questionToday}
          </h2>
          <Badge
            variant="default"
            className="border-transparent bg-primary/15 text-primary hover:bg-primary/15"
          >
            <span className="mr-1" aria-hidden="true">
              {question.emoji}
            </span>
            {CATEGORY_LABELS[question.category][locale]}
          </Badge>
        </div>

        <p className="mb-5 text-lg font-medium leading-relaxed text-foreground">
          {questionText}
        </p>

        <Button
          onClick={handleShareQuestion}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          aria-label={t.partner.content.shareQuestionAria}
        >
          {questionCopied ? `✓ ${t.common.copied}` : `📤 ${t.common.share} / ${t.common.copy}`}
        </Button>
      </section>

      {/* Section C — Tipp für deinen Partner teilen */}
      <section
        aria-labelledby="share-tip-heading"
        className="rounded-2xl bg-card p-5 shadow-sm"
      >
        <h2
          id="share-tip-heading"
          className="mb-2 text-base font-semibold text-foreground"
        >
          {t.partner.content.noAppTitle}
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          {t.partner.content.noAppBody}
        </p>

        <Button
          variant="outline"
          onClick={handleShareTip}
          className="w-full border-primary/20 text-primary hover:bg-secondary hover:text-primary"
          aria-label={t.partner.content.shareTipAria}
        >
          {tipCopied ? `✓ ${t.common.copied}` : t.partner.content.shareTip}
        </Button>
      </section>
    </div>
  )
}
