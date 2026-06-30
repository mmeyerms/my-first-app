import type { Locale } from '@/lib/i18n/types'
import { QUESTIONS } from '@/lib/questions'
import { localized } from '@/lib/i18n/localized'

/**
 * Build a natural-language briefing from birth plan answers, ready for TTS.
 *
 * The result is a short, warm spoken-style text that a partner can play in
 * the delivery room — so they do not have to read a multi-page document.
 */
export function buildBriefingText(
  answers: Record<string, string | string[]>,
  locale: Locale,
  babyName?: string | null,
): string {
  const trimmedBabyName = babyName?.trim() ? babyName.trim() : null

  // Open with a warm intro
  const intro = locale === 'de'
    ? `Hallo. Hier sind die wichtigsten Wünsche${trimmedBabyName ? ` von ${trimmedBabyName}s Mama` : ''} für die Geburt.`
    : `Hello. Here are the most important wishes${trimmedBabyName ? ` from ${trimmedBabyName}'s mom` : ''} for the birth.`

  const parts: string[] = [intro, '']

  // Iterate through answered questions and turn them into natural sentences
  for (const q of QUESTIONS) {
    const answer = answers[q.id]
    if (answer === undefined || answer === null) continue
    if (Array.isArray(answer) && answer.length === 0) continue
    if (typeof answer === 'string' && !answer.trim()) continue

    const questionText = localized(q.label, locale)
    const answerText = Array.isArray(answer)
      ? answer.join(locale === 'de' ? ', ' : ', ')
      : answer

    parts.push(formatAnswerSentence(questionText, answerText, locale))
  }

  // Close with a respectful sign-off
  const close = locale === 'de'
    ? 'Vielen Dank, dass ihr meine Wünsche respektiert.'
    : 'Thank you for respecting these wishes.'
  parts.push('')
  parts.push(close)

  return parts.join(' ').replace(/\s+/g, ' ').trim()
}

function formatAnswerSentence(question: string, answer: string, locale: Locale): string {
  const trimmedAnswer = answer.trim().replace(/\s+/g, ' ')
  const punctuated = /[.!?]$/.test(trimmedAnswer) ? trimmedAnswer : `${trimmedAnswer}.`
  return locale === 'de'
    ? `Zu „${question}“: ${punctuated}`
    : `On "${question}": ${punctuated}`
}

/**
 * Estimated spoken duration in seconds.
 * Average speaking rate ≈ 160 wpm ≈ 2.6 words per second.
 */
export function estimateDuration(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 2.6))
}
