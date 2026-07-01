'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Download, ImagePlus, X } from 'lucide-react'
import { getMilestonesUpToSSW, getNextMilestone, getMilestoneTitle, getMilestoneDescription } from '@/lib/milestones'
import { useLocale, useT } from '@/lib/i18n/client'
import { usePreferences } from '@/lib/preferences/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { VoiceInputButton } from '@/components/tagebuch/VoiceInputButton'

type DiaryEntry = {
  ssw: number
  rating: number | null
  word: string | null
  surprise: string | null
  photo_url?: string | null
}

const RATING_VALUES: Array<1 | 2 | 3 | 4 | 5> = [1, 2, 3, 4, 5]
const RATING_EMOJI: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: '😔',
  2: '😕',
  3: '🙂',
  4: '😊',
  5: '🤩',
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

interface Props {
  ssw: number
  babyName: string
}

export function TagebuchView({ ssw, babyName }: Props) {
  const { locale } = useLocale()
  const t = useT()
  const { prefs } = usePreferences()
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [currentEntry, setCurrentEntry] = useState<DiaryEntry>({ ssw, rating: null, word: null, surprise: null, photo_url: null })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeSSW, setActiveSSW] = useState(ssw)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const saveTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)

  const currentPrompt = useMemo(() => {
    const prompts = prefs.tagebuchCustomPrompts
    if (prompts.length === 0) return null
    if (!prefs.tagebuchPromptRotation) return prompts[0]
    // Rotate based on activeSSW so it's stable for the same week
    return prompts[activeSSW % prompts.length]
  }, [prefs.tagebuchCustomPrompts, prefs.tagebuchPromptRotation, activeSSW])

  const rueckblickEntry = useMemo(() => {
    if (!prefs.tagebuchShowRueckblick) return null
    // Entry 4 weeks ago
    const target = activeSSW - 4
    if (target < 1) return null
    return entries.find((e) => e.ssw === target && (e.rating || e.word || e.surprise)) ?? null
  }, [entries, activeSSW, prefs.tagebuchShowRueckblick])

  function exportPdf() {
    const relevant = entries.filter((e) => e.rating || e.word || e.surprise).sort((a, b) => a.ssw - b.ssw)
    if (relevant.length === 0) {
      alert('Noch keine Einträge zum Exportieren.')
      return
    }
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Baby-Buch für ${babyName}</title>
<style>
  body { font-family: Georgia, serif; max-width: 620px; margin: 40px auto; padding: 0 24px; color: #2a1f22; }
  h1 { font-size: 32px; font-weight: 500; margin-bottom: 8px; }
  h2 { font-size: 18px; margin-top: 24px; color: #5E3D44; border-bottom: 1px solid #dcc; padding-bottom: 4px; }
  .lead { font-style: italic; color: #666; margin-bottom: 32px; }
  .entry { margin: 20px 0; padding: 12px 16px; background: #faf5ee; border-radius: 8px; }
  .word { font-style: italic; margin: 6px 0; }
  .surprise { margin: 6px 0; }
  .rating { display: inline-block; font-size: 20px; }
  @media print { body { margin: 20px auto; } }
</style></head><body>
  <h1>Baby-Buch für ${escapeHtml(babyName)}</h1>
  <p class="lead">Aus dem Tagebuch — deine Reise durch die Schwangerschaft.</p>
  ${relevant.map((e) => `
    <div class="entry">
      <h2>SSW ${e.ssw} ${e.rating ? `<span class="rating">${RATING_EMOJI[e.rating as 1|2|3|4|5]}</span>` : ''}</h2>
      ${e.word ? `<div class="word">„${escapeHtml(e.word)}"</div>` : ''}
      ${e.surprise ? `<div class="surprise">${escapeHtml(e.surprise)}</div>` : ''}
    </div>
  `).join('')}
</body></html>`
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(html)
    win.document.close()
    setTimeout(() => win.print(), 500)
  }

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
    setCurrentEntry(existing ?? { ssw: s, rating: null, word: null, surprise: null, photo_url: null })
    setSaved(false)
    setPhotoError(null)
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
        body: JSON.stringify({
          ssw: entry.ssw,
          rating: entry.rating ?? undefined,
          word: entry.word ?? undefined,
          surprise: entry.surprise ?? undefined,
          photo_url: entry.photo_url ?? null,
        }),
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

  async function handlePhotoSelect(file: File | null) {
    if (!file) return
    setPhotoError(null)
    if (file.size > 3 * 1024 * 1024) {
      setPhotoError('Bild ist zu groß (max. 3 MB).')
      return
    }
    if (!file.type.startsWith('image/')) {
      setPhotoError('Bitte ein Bild auswählen.')
      return
    }
    setUploadingPhoto(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/uploads/diary', { method: 'POST', body: form })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setPhotoError(err.error ?? 'Upload fehlgeschlagen.')
        return
      }
      const { url } = (await res.json()) as { url: string; path: string }
      const updated: DiaryEntry = { ...currentEntry, ssw: activeSSW, photo_url: url }
      setCurrentEntry(updated)
      clearTimeout(saveTimeout.current)
      await autosave(updated)
    } catch {
      setPhotoError('Upload fehlgeschlagen.')
    } finally {
      setUploadingPhoto(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function handleRemovePhoto() {
    const updated: DiaryEntry = { ...currentEntry, ssw: activeSSW, photo_url: null }
    setCurrentEntry(updated)
    setPhotoError(null)
    clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(() => autosave(updated), 300)
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
        {currentPrompt && (
          <div className="mb-4 rounded-xl border border-primary/20 bg-secondary/30 p-3">
            <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary">Impuls</div>
            <p className="mt-1 font-display text-sm italic text-foreground">{currentPrompt}</p>
          </div>
        )}
        {rueckblickEntry && (
          <div className="mb-4 rounded-xl border border-border bg-secondary/20 p-3">
            <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Vor 4 Wochen</div>
            <p className="mt-1 text-sm text-foreground">
              {rueckblickEntry.word ? `„${rueckblickEntry.word}"` : rueckblickEntry.surprise?.slice(0, 80) ?? '—'}
            </p>
          </div>
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
          <div className="flex items-center gap-2">
            <input
              type="text"
              maxLength={100}
              placeholder={t.tagebuch.wordPlaceholder}
              value={currentEntry.word ?? ''}
              onChange={(e) => handleChange('word', e.target.value || null)}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
            />
            <VoiceInputButton
              locale={locale}
              size="sm"
              variant="ghost"
              className="h-9 w-9 p-0"
              onTranscript={(text) => {
                const existing = (currentEntry.word ?? '').trim()
                // Take just the first word for the one-word capture.
                const firstWord = text.trim().split(/\s+/)[0] ?? ''
                if (!firstWord) return
                const next = existing ? `${existing} ${firstWord}`.slice(0, 100) : firstWord.slice(0, 100)
                handleChange('word', next || null)
              }}
            />
          </div>
        </div>

        {/* Surprise */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            {t.tagebuch.surpriseLabel}
          </label>
          <div className="flex items-start gap-2">
            <Textarea
              placeholder={surprisePlaceholder}
              value={currentEntry.surprise ?? ''}
              onChange={(e) => handleChange('surprise', e.target.value || null)}
              className="min-h-[80px] resize-none text-sm"
            />
            <VoiceInputButton
              locale={locale}
              size="icon"
              variant="outline"
              onTranscript={(text) => {
                const trimmed = text.trim()
                if (!trimmed) return
                const existing = (currentEntry.surprise ?? '').trim()
                const next = existing ? `${existing} ${trimmed}` : trimmed
                handleChange('surprise', next || null)
              }}
            />
          </div>
        </div>

        {/* Photo attachment */}
        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Foto anhängen
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            aria-label="Foto für Tagebuch-Eintrag auswählen"
            onChange={(e) => handlePhotoSelect(e.target.files?.[0] ?? null)}
          />
          {currentEntry.photo_url ? (
            <div className="flex items-start gap-3">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentEntry.photo_url}
                  alt="Angehängtes Foto"
                  className="h-24 w-24 rounded-lg border border-border object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-background text-foreground shadow ring-1 ring-border hover:bg-muted"
                  aria-label="Foto entfernen"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Foto ist gespeichert. Du kannst es jederzeit entfernen oder ersetzen.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                disabled={uploadingPhoto}
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus className="h-3.5 w-3.5" />
                {uploadingPhoto ? 'Lädt hoch…' : 'Foto anhängen'}
              </Button>
              <span className="text-[10px] text-muted-foreground">max. 3 MB</span>
            </div>
          )}
          {photoError && (
            <p role="alert" className="mt-2 text-xs text-red-600">
              {photoError}
            </p>
          )}
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
      {entries.filter((e) => e.rating || e.word || e.surprise || e.photo_url).length > 0 && (
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">{t.tagebuch.entriesTitle}</h2>
            <Button variant="outline" size="sm" onClick={exportPdf} className="gap-1.5">
              <Download className="h-3.5 w-3.5" /> Baby-Buch PDF
            </Button>
          </div>
          <div className="space-y-2">
            {entries
              .filter((e) => e.rating || e.word || e.surprise || e.photo_url)
              .sort((a, b) => b.ssw - a.ssw)
              .map((e) => {
                const emoji = e.rating ? RATING_EMOJI[e.rating as 1 | 2 | 3 | 4 | 5] : '📝'
                return (
                  <button
                    key={e.ssw}
                    onClick={() => selectSSW(e.ssw)}
                    className="flex w-full items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 text-left hover:bg-rose-50 transition-colors"
                  >
                    {e.photo_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={e.photo_url}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="text-xl">{emoji}</span>
                    )}
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
