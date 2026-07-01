'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays, NotebookPen, Sparkle, Stethoscope, Baby, Hourglass, HandHeart, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useLocale, useT } from '@/lib/i18n/client'
import { useTheme } from '@/lib/theme/client'
import { usePreferences } from '@/lib/preferences/client'
import type { SnapshotCardKey } from '@/lib/preferences/types'
import { getZodiacForDate } from '@/lib/sternzeichen'
import { cn } from '@/lib/utils'

interface NextTerminSnapshot {
  title: string
  date: string
  time?: string | null
}
interface LatestDiarySnapshot {
  ssw: number
  word: string | null
  rating: number | null
  updatedAt: string
}

interface DailySnapshotProps {
  tipEmoji: string
  tipTextDe: string
  tipTextEn: string
  nextTermin: NextTerminSnapshot | null
  latestDiary: LatestDiarySnapshot | null
  ssw: number | null
  dueDate: string | null
  helpRequestsOpen: number
}

const RATING_EMOJI: Record<number, string> = { 1: '💧', 2: '🌥️', 3: '🌸', 4: '☀️', 5: '✨' }

function formatDateShort(dateISO: string, locale: 'de' | 'en'): string {
  const [y, m, d] = dateISO.split('-').map((n) => parseInt(n, 10))
  if (!y || !m || !d) return dateISO
  const dt = new Date(y, m - 1, d)
  return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-US', {
    weekday: 'short', day: 'numeric', month: 'short',
  }).format(dt)
}

function daysBetween(fromISO: string, todayISO: string): number {
  const [y1, m1, d1] = fromISO.split('T')[0]!.split('-').map((n) => parseInt(n, 10))
  const [y2, m2, d2] = todayISO.split('-').map((n) => parseInt(n, 10))
  if (!y1 || !m1 || !d1 || !y2 || !m2 || !d2) return 0
  const a = new Date(y1, m1 - 1, d1)
  const b = new Date(y2, m2 - 1, d2)
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

function todayLocalISO(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

interface SnapshotCardProps {
  onClick: () => void
  ariaLabel: string
  icon: React.ReactNode
  eyebrow: string
  title: string
  body: React.ReactNode
  isClassic: boolean
  emphasis?: boolean
  compact?: boolean
}

function SnapshotCard({ onClick, ariaLabel, icon, eyebrow, title, body, isClassic, emphasis = false, compact = false }: SnapshotCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        'group block rounded-2xl text-left outline-none',
        'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      )}
    >
      <Card
        className={cn(
          'card-elevated flex h-full flex-col gap-1.5 border-border/60 bg-card transition-all',
          'hover:-translate-y-0.5 hover:shadow-md',
          compact ? 'min-h-[80px] p-2.5 sm:p-3' : 'min-h-[112px] p-3.5 sm:p-4',
          emphasis && 'bg-secondary/40',
        )}
      >
        <div className="flex items-center gap-1.5">
          <span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
            {icon}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{eyebrow}</span>
        </div>
        <p className={cn('text-sm font-semibold leading-tight text-foreground', isClassic ? '' : 'font-display')}>
          {title}
        </p>
        {!compact && (
          <div className={cn('mt-auto line-clamp-2 text-xs leading-snug text-muted-foreground', isClassic ? '' : 'font-display italic')}>
            {body}
          </div>
        )}
      </Card>
    </button>
  )
}

export function DailySnapshot({
  tipEmoji, tipTextDe, tipTextEn, nextTermin, latestDiary, ssw, dueDate, helpRequestsOpen,
}: DailySnapshotProps) {
  const router = useRouter()
  const t = useT()
  const { locale } = useLocale()
  const { theme } = useTheme()
  const { prefs } = usePreferences()
  const isClassic = theme === 'classic'
  const compact = prefs.snapshotDensity === 'compact'
  const tipText = locale === 'en' ? tipTextEn : tipTextDe

  const openChat = () => {
    if (typeof window === 'undefined') return
    window.dispatchEvent(new CustomEvent('mamamap:open-chat'))
  }

  const daysToEt = useMemo(() => {
    if (!dueDate) return null
    return daysBetween(todayLocalISO(), dueDate)
  }, [dueDate])

  const cardRenderers: Record<SnapshotCardKey, () => React.ReactNode> = {
    nextTermin: () => (
      <SnapshotCard
        key="nextTermin"
        onClick={() => router.push('/termine')}
        ariaLabel={t.dashboard.snapshot.nextTerminTitle}
        icon={<CalendarDays className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />}
        eyebrow={t.dashboard.snapshot.nextTerminTitle}
        title={nextTermin ? formatDateShort(nextTermin.date, locale) : t.dashboard.snapshot.noNextTermin}
        body={
          !nextTermin ? (
            <span className="inline-flex flex-col">
              <span>{t.dashboard.snapshot.noNextTermin}</span>
              <span className="mt-0.5 text-primary">{t.dashboard.snapshot.addTerminHint}</span>
            </span>
          ) : (
            <span className="inline-flex flex-col">
              <span>{formatDateShort(nextTermin.date, locale)}{nextTermin.time ? `, ${nextTermin.time}` : ''}</span>
              <span className="truncate text-foreground/80">{nextTermin.title}</span>
            </span>
          )
        }
        isClassic={isClassic}
        compact={compact}
      />
    ),
    ssw: () => (
      <SnapshotCard
        key="ssw"
        onClick={() => router.push('/woche')}
        ariaLabel="Aktuelle Woche"
        icon={isClassic ? <span className="text-sm">🤰</span> : <Baby className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />}
        eyebrow="Diese Woche"
        title={ssw !== null ? `SSW ${ssw}` : '—'}
        body={ssw !== null ? 'Baby-Update ansehen' : 'Trage dein ET im Profil ein'}
        isClassic={isClassic}
        compact={compact}
      />
    ),
    tipp: () => (
      <SnapshotCard
        key="tipp"
        onClick={() => router.push('/tipps')}
        ariaLabel={t.dashboard.snapshot.tipTitle}
        icon={isClassic ? <span className="text-sm">{tipEmoji}</span> : <Sparkle className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />}
        eyebrow={t.dashboard.snapshot.today}
        title={t.dashboard.snapshot.tipTitle}
        body={tipText}
        isClassic={isClassic}
        compact={compact}
      />
    ),
    tagebuch: () => (
      <SnapshotCard
        key="tagebuch"
        onClick={() => router.push('/tagebuch')}
        ariaLabel={t.dashboard.snapshot.latestDiaryTitle}
        icon={<NotebookPen className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />}
        eyebrow={t.dashboard.snapshot.latestDiaryTitle}
        title={latestDiary ? `SSW ${latestDiary.ssw}` : t.dashboard.snapshot.latestDiaryTitle}
        body={
          !latestDiary ? (
            t.dashboard.snapshot.noDiary
          ) : (() => {
            const days = daysBetween(latestDiary.updatedAt, todayLocalISO())
            const ratingEmoji = latestDiary.rating ? RATING_EMOJI[latestDiary.rating] : null
            const word = latestDiary.word?.trim()
            const wordOrEmoji = word && word.length > 0 ? `„${word}"` : ratingEmoji ?? '—'
            let timeLabel: string
            if (days <= 0) timeLabel = t.dashboard.snapshot.latestDiaryToday
            else if (days === 1) timeLabel = t.dashboard.snapshot.latestDiaryYesterday
            else timeLabel = t.dashboard.snapshot.latestDiaryPrefix.replace('{days}', String(days))
            return (
              <span className="inline-flex flex-col">
                <span className="text-foreground/80">{wordOrEmoji}</span>
                <span>{timeLabel}</span>
              </span>
            )
          })()
        }
        isClassic={isClassic}
        compact={compact}
      />
    ),
    countdown: () => (
      <SnapshotCard
        key="countdown"
        onClick={() => router.push('/woche')}
        ariaLabel="Countdown zum ET"
        icon={<Hourglass className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />}
        eyebrow="Bis zum ET"
        title={daysToEt === null ? '—' : daysToEt <= 0 ? 'Jetzt!' : `${daysToEt} Tage`}
        body={dueDate ? `ET: ${formatDateShort(dueDate, locale)}` : 'Trage dein ET ein'}
        isClassic={isClassic}
        compact={compact}
      />
    ),
    wochenbettChef: () => (
      <SnapshotCard
        key="wochenbettChef"
        onClick={() => router.push('/wochenbett-chef')}
        ariaLabel="Wochenbett-Chef"
        icon={<HandHeart className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />}
        eyebrow="Hilfe organisieren"
        title={helpRequestsOpen > 0 ? `${helpRequestsOpen} offen` : 'Neu anlegen'}
        body={helpRequestsOpen > 0 ? 'Antworten & Termine' : 'Wer hilft dir im Wochenbett?'}
        isClassic={isClassic}
        emphasis={helpRequestsOpen > 0}
        compact={compact}
      />
    ),
    sternzeichen: () => {
      const zodiac = dueDate ? getZodiacForDate(dueDate) : null
      return (
        <SnapshotCard
          key="sternzeichen"
          onClick={() => router.push('/woche')}
          ariaLabel="Baby-Sternzeichen"
          icon={isClassic ? <span className="text-sm">{zodiac?.emoji ?? '✨'}</span> : <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />}
          eyebrow="Baby-Sternzeichen"
          title={zodiac ? `${zodiac.label} ${zodiac.emoji}` : 'Trage dein ET ein'}
          body={zodiac?.hint ?? 'Dein Baby-Sternzeichen erscheint hier.'}
          isClassic={isClassic}
          compact={compact}
        />
      )
    },
  }

  // KI-Hebamme card is always shown as final "emphasis" tile — 1 klick zur Hebamme
  const chatCard = (
    <SnapshotCard
      key="chat"
      onClick={openChat}
      ariaLabel={t.dashboard.snapshot.askMidwifeTitle}
      icon={<Stethoscope className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />}
      eyebrow={t.hebamme.title}
      title={t.dashboard.snapshot.askMidwifeTitle}
      body={t.dashboard.snapshot.askMidwifeSubtitle}
      isClassic={isClassic}
      emphasis
      compact={compact}
    />
  )

  const cards = prefs.snapshotCards.map((k) => cardRenderers[k]?.()).filter(Boolean)

  return (
    <section
      aria-label={t.dashboard.snapshot.today}
      className="mb-8 grid grid-cols-2 gap-3 sm:gap-4"
    >
      {cards}
      {chatCard}
    </section>
  )
}
