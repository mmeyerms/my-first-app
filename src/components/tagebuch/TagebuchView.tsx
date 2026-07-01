'use client'

import { useEffect, useRef, useState } from 'react'
import { getMilestonesUpToSSW, getNextMilestone, getMilestoneTitle, getMilestoneDescription } from '@/lib/milestones'
import { useLocale, useT } from '@/lib/i18n/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

type DiaryEntry = {
  ssw: number
  rating: number | null
  word: string | null
  surprise: string | null
}

const RATING_VALUES: Array<1 | 2 | 3 | 4 | 5> = [1, 2, 3, 4, 5]
const RATING_EMOJI: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: '😔',
  2: '😕',
  3: '🙂',
  4: '😊',
  5: '🤩',
}

interface Props {
  ssw: number
  babyName: string
}

export function TagebuchView({ ssw, babyName }: Props) {
  const { locale } = useLocale()
  const t = useT()
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [currentEntry, setCurrentEntry] = useState<DiaryEntry>({ ssw, rating: null, word: null, surprise: null })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeSSW, setActiveSSW] = useState(ssw)
  const saveTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    fetch('/api/tagebuch')
      .then((r) => r.json())
      .then((data: DiaryEntry[]) => {
        if (!Array.isArray(data)) return
        setEntries(data)
        const existing = data.find((e) => e.ssw === ssw)
        if (existing) setCurrentEntry(existing)
      })
      .catch(() => {})
  }, [ssw])

  function selectSSW(s: number) {
    setActiveSSW(s)
    const existing = entries.find((e) => e.ssw === s)
    setCurrentEntry(existing ?? { ssw: s, rating: null, word: null, surprise: null })
    setSaved(false)
  }

  function handleChange(field: keyof DiaryEntry, value: unknown) {
    const updated = { ...currentEntry, ssw: activeSSW, [field]: value }
    setCurrentEntry(updated as DiaryEntry)
    clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(() => autosave(updated as DiaryEntry), 800)
  }

  async function autosave(entry: DiaryEntry) {
    setSaving(true)
    setSaved(false)
    try {
      await fetch('/api/tagebuch', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ssw: entry.ssw, rating: entry.rating ?? undefined, word: entry.word ?? undefined, surprise: entry.surprise ?? undefined }),
      })
      setEntries((prev) => {
        const idx = prev.findIndex((e) => e.ssw === entry.ssw)
        if (idx >= 0) return prev.map((e, i) => (i === idx ? entry : e))
        return [...prev, entry]
      })
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  const reached = getMilestonesUpToSSW(ssw)
  const next = getNextMilestone(ssw)
  const isCurrentSSW = activeSSW === ssw
  const hasAnyEntries = entries.some((e) => e.rating || e.word || e.surprise)
  const isCurrentEmpty =
    !currentEntry.rating && !currentEntry.word && !currentEntry.surprise
  const showEmptyIntro = isCurrentSSW && isCurrentEmpty && !hasAnyEntries

  const sswHeading = t.tagebuch.sswHeading.replace('{ssw}', String(activeSSW))
  const surprisePlaceholder = t.tagebuch.surprisePlaceholder.replace('{babyName}', babyName)
  const backToCurrent = t.tagebuch.backToCurrent.replace('{ssw}', String(ssw))

  return (
    <div className="space-y-6">
      {/* Milestones */}
      {reached.length > 0 && (
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-foreground">{t.tagebuch.milestones.heading}</h2>
          <div className="space-y-2">
            {reached.map((m) => (
              <div key={m.ssw} className="flex items-start gap-3">
                <span className="text-xl">{m.emoji}</span>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {t.tagebuch.milestones.nextDetail
                      .replace('{ssw}', String(m.ssw))
                      .replace('{title}', getMilestoneTitle(m, locale))}
                  </p>
                  <p className="text-xs text-muted-foreground">{getMilestoneDescription(m, locale)}</p>
                </div>
              </div>
            ))}
          </div>
          {next && (
            <div className="mt-3 rounded-xl bg-secondary px-4 py-3 text-sm text-primary">
              {t.tagebuch.milestones.nextLabel}{' '}
              <strong>
                {t.tagebuch.milestones.nextDetail
                  .replace('{ssw}', String(next.ssw))
                  .replace('{title}', getMilestoneTitle(next, locale))}
              </strong>{' '}
              {t.tagebuch.milestones.nextWeeks.replace('{weeks}', String(next.ssw - ssw))}
            </div>
          )}
        </div>
      )}

      {/* SSW selector */}
      <div className="rounded-2xl bg-card p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-foreground">{t.tagebuch.weekSelector}</h2>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: ssw }, (_, i) => i + 1).map((s) => {
            const hasEntry = entries.some((e) => e.ssw === s && (e.rating || e.word || e.surprise))
            return (
              <button
                key={s}
                onClick={() => selectSSW(s)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeSSW === s
                    ? 'bg-primary text-primary-foreground'
                    : hasEntry
                    ? 'bg-secondary text-primary'
                    : 'bg-muted text-muted-foreground hover:bg-muted/70'
                }`}
              >
                {t.tagebuch.sswHeading.replace('{ssw}', String(s))}
                {hasEntry && activeSSW !== s && <span className="ml-1">✓</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Entry form */}
      <div className="rounded-2xl bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            {sswHeading} {isCurrentSSW ? t.tagebuch.currentWeekTag : ''}
          </h2>
          <div className="flex items-center gap-2">
            {saving && <span className="text-xs text-muted-foreground">{t.tagebuch.saving}</span>}
            {saved && !saving && <span className="text-xs text-green-500">{t.tagebuch.savedShort}</span>}
          </div>
        </div>
        {showEmptyIntro && (
          <p className="mb-4 rounded-xl border border-dashed border-border/60 bg-secondary/30 p-3 font-display text-sm italic leading-relaxed text-muted-foreground">
            {t.emptyStates.tagebuchIntro}
          </p>
        )}

        {/* Rating */}
        <div className="mb-5">
          <p className="mb-2 text-xs font-medium text-muted-foreground">{t.tagebuch.ratingPrompt}</p>
          <div className="flex gap-2">
            {RATING_VALUES.map((value) => {
              const label = t.tagebuch.ratings[value]
              return (
                <button
                  key={value}
                  onClick={() => handleChange('rating', value)}
                  title={label}
                  className={`flex flex-col items-center rounded-xl p-2 transition-all ${
                    currentEntry.rating === value
                      ? 'bg-secondary ring-2 ring-primary/40'
                      : 'bg-muted hover:bg-muted/70'
                  }`}
                >
                  <span className="text-2xl">{RATING_EMOJI[value]}</span>
                  <span className="mt-0.5 text-[10px] text-muted-foreground">{label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Word */}
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            {t.tagebuch.wordLabel}
          </label>
          <input
            type="text"
            maxLength={100}
            placeholder={t.tagebuch.wordPlaceholder}
            value={currentEntry.word ?? ''}
            onChange={(e) => handleChange('word', e.target.value || null)}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
          />
        </div>

        {/* Surprise */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            {t.tagebuch.surpriseLabel}
          </label>
          <Textarea
            placeholder={surprisePlaceholder}
            value={currentEntry.surprise ?? ''}
            onChange={(e) => handleChange('surprise', e.target.value || null)}
            className="min-h-[80px] resize-none text-sm"
          />
        </div>

        {!isCurrentSSW && (
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={() => selectSSW(ssw)}>
              {backToCurrent}
            </Button>
          </div>
        )}
      </div>

      {/* Filled entries overview */}
      {entries.filter((e) => e.rating || e.word || e.surprise).length > 0 && (
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-foreground">{t.tagebuch.entriesTitle}</h2>
          <div className="space-y-2">
            {entries
              .filter((e) => e.rating || e.word || e.surprise)
              .sort((a, b) => b.ssw - a.ssw)
              .map((e) => {
                const emoji = e.rating ? RATING_EMOJI[e.rating as 1 | 2 | 3 | 4 | 5] : '📝'
                return (
                  <button
                    key={e.ssw}
                    onClick={() => selectSSW(e.ssw)}
                    className="flex w-full items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 text-left hover:bg-rose-50 transition-colors"
                  >
                    <span className="text-xl">{emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-700">{t.tagebuch.sswHeading.replace('{ssw}', String(e.ssw))}</p>
                      {e.word && <p className="truncate text-xs text-muted-foreground">„{e.word}"</p>}
                    </div>
                    {e.ssw === ssw && <Badge variant="secondary" className="text-xs shrink-0">{t.tagebuch.current}</Badge>}
                  </button>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}
