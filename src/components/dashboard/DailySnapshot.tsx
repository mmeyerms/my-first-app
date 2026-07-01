'use client'

import { useRouter } from 'next/navigation'
import { CalendarDays, NotebookPen, Sparkle, Stethoscope } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useLocale, useT } from '@/lib/i18n/client'
import { useTheme } from '@/lib/theme/client'
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
}

const RATING_EMOJI: Record<number, string> = {
  1: '💧',
  2: '🌥️',
  3: '🌸',
  4: '☀️',
  5: '✨',
}

function formatDateShort(dateISO: string, locale: 'de' | 'en'): string {
  // dateISO is YYYY-MM-DD — construct a local Date so we don't drift by a day.
  const [y, m, d] = dateISO.split('-').map((n) => parseInt(n, 10))
  if (!y || !m || !d) return dateISO
  const dt = new Date(y, m - 1, d)
  return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(dt)
}

function daysBetween(fromISO: string, todayISO: string): number {
  const [y1, m1, d1] = fromISO.split('T')[0]!.split('-').map((n) => parseInt(n, 10))
  const [y2, m2, d2] = todayISO.split('-').map((n) => parseInt(n, 10))
  if (!y1 || !m1 || !d1 || !y2 || !m2 || !d2) return 0
  const a = new Date(y1, m1 - 1, d1)
  const b = new Date(y2, m2 - 1, d2)
  const diffMs = b.getTime() - a.getTime()
  return Math.round(diffMs / (1000 * 60 * 60 * 24))
}

function todayLocalISO(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
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
}

function SnapshotCard({
  onClick,
  ariaLabel,
  icon,
  eyebrow,
  title,
  body,
  isClassic,
  emphasis = false,
}: SnapshotCardProps) {
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
          'card-elevated flex h-full min-h-[112px] flex-col gap-1.5 border-border/60 bg-card p-3.5 transition-all',
          'hover:-translate-y-0.5 hover:shadow-md sm:p-4',
          emphasis && 'bg-secondary/40',
        )}
      >
        <div className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-secondary text-primary"
          >
            {icon}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {eyebrow}
          </span>
        </div>
        <p
          className={cn(
            'text-sm font-semibold leading-tight text-foreground',
            isClassic ? '' : 'font-display',
          )}
        >
          {title}
        </p>
        <div
          className={cn(
            'mt-auto line-clamp-2 text-xs leading-snug text-muted-foreground',
            isClassic ? '' : 'font-display italic',
          )}
        >
          {body}
        </div>
      </Card>
    </button>
  )
}

export function DailySnapshot({
  tipEmoji,
  tipTextDe,
  tipTextEn,
  nextTermin,
  latestDiary,
}: DailySnapshotProps) {
  const router = useRouter()
  const t = useT()
  const { locale } = useLocale()
  const { theme } = useTheme()
  const isClassic = theme === 'classic'

  const tipText = locale === 'en' ? tipTextEn : tipTextDe

  const nextTerminBody = (() => {
    if (!nextTermin) {
      return (
        <span className="inline-flex flex-col">
          <span>{t.dashboard.snapshot.noNextTermin}</span>
          <span className="mt-0.5 text-primary">
            {t.dashboard.snapshot.addTerminHint}
          </span>
        </span>
      )
    }
    const dateLabel = formatDateShort(nextTermin.date, locale)
    const time = nextTermin.time ? `, ${nextTermin.time}` : ''
    return (
      <span className="inline-flex flex-col">
        <span>
          {dateLabel}
          {time}
        </span>
        <span className="truncate text-foreground/80">{nextTermin.title}</span>
      </span>
    )
  })()

  const latestDiaryBody = (() => {
    if (!latestDiary) {
      return t.dashboard.snapshot.noDiary
    }
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

  const openChat = () => {
    if (typeof window === 'undefined') return
    window.dispatchEvent(new CustomEvent('mamamap:open-chat'))
  }

  return (
    <section
      aria-label={t.dashboard.snapshot.today}
      className="mb-8 grid grid-cols-2 gap-3 sm:gap-4"
    >
      <SnapshotCard
        onClick={() => router.push('/tipps')}
        ariaLabel={t.dashboard.snapshot.tipTitle}
        icon={
          isClassic ? (
            <span className="text-sm leading-none" aria-hidden="true">
              {tipEmoji}
            </span>
          ) : (
            <Sparkle className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
          )
        }
        eyebrow={t.dashboard.snapshot.today}
        title={t.dashboard.snapshot.tipTitle}
        body={tipText}
        isClassic={isClassic}
      />

      <SnapshotCard
        onClick={() => router.push('/termine')}
        ariaLabel={t.dashboard.snapshot.nextTerminTitle}
        icon={<CalendarDays className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />}
        eyebrow={t.dashboard.snapshot.nextTerminTitle}
        title={
          nextTermin
            ? formatDateShort(nextTermin.date, locale)
            : t.dashboard.snapshot.noNextTermin
        }
        body={nextTerminBody}
        isClassic={isClassic}
      />

      <SnapshotCard
        onClick={() => router.push('/tagebuch')}
        ariaLabel={t.dashboard.snapshot.latestDiaryTitle}
        icon={<NotebookPen className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />}
        eyebrow={t.dashboard.snapshot.latestDiaryTitle}
        title={
          latestDiary
            ? `SSW ${latestDiary.ssw}`
            : t.dashboard.snapshot.latestDiaryTitle
        }
        body={latestDiaryBody}
        isClassic={isClassic}
      />

      <SnapshotCard
        onClick={openChat}
        ariaLabel={t.dashboard.snapshot.askMidwifeTitle}
        icon={<Stethoscope className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />}
        eyebrow={t.hebamme.title}
        title={t.dashboard.snapshot.askMidwifeTitle}
        body={t.dashboard.snapshot.askMidwifeSubtitle}
        isClassic={isClassic}
        emphasis
      />
    </section>
  )
}
