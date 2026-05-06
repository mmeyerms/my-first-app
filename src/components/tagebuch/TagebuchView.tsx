'use client'

import { useEffect, useRef, useState } from 'react'
import { getMilestonesUpToSSW, getNextMilestone } from '@/lib/milestones'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

type DiaryEntry = {
  ssw: number
  rating: number | null
  word: string | null
  surprise: string | null
}

const RATINGS = [
  { value: 1, emoji: '😔', label: 'Schwer' },
  { value: 2, emoji: '😕', label: 'Ok' },
  { value: 3, emoji: '🙂', label: 'Gut' },
  { value: 4, emoji: '😊', label: 'Toll' },
  { value: 5, emoji: '🤩', label: 'Fantastisch' },
]

interface Props {
  ssw: number
  babyName: string
}

export function TagebuchView({ ssw, babyName }: Props) {
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

  return (
    <div className="space-y-6">
      {/* Meilensteine */}
      {reached.length > 0 && (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-gray-700">🏆 Eure Meilensteine</h2>
          <div className="space-y-2">
            {reached.map((m) => (
              <div key={m.ssw} className="flex items-start gap-3">
                <span className="text-xl">{m.emoji}</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">SSW {m.ssw} — {m.title}</p>
                  <p className="text-xs text-gray-500">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
          {next && (
            <div className="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
              Nächster Meilenstein: <strong>SSW {next.ssw} — {next.title}</strong> ({next.ssw - ssw} Wochen)
            </div>
          )}
        </div>
      )}

      {/* SSW selector */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-700">📖 Woche wählen</h2>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: ssw }, (_, i) => i + 1).map((s) => {
            const hasEntry = entries.some((e) => e.ssw === s && (e.rating || e.word || e.surprise))
            return (
              <button
                key={s}
                onClick={() => selectSSW(s)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeSSW === s
                    ? 'bg-rose-500 text-white'
                    : hasEntry
                    ? 'bg-rose-100 text-rose-600'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                SSW {s}
                {hasEntry && activeSSW !== s && <span className="ml-1">✓</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Entry form */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">
            SSW {activeSSW} {isCurrentSSW ? '(aktuelle Woche)' : ''}
          </h2>
          <div className="flex items-center gap-2">
            {saving && <span className="text-xs text-gray-400">Speichern...</span>}
            {saved && !saving && <span className="text-xs text-green-500">✓ Gespeichert</span>}
          </div>
        </div>

        {/* Rating */}
        <div className="mb-5">
          <p className="mb-2 text-xs font-medium text-gray-600">Wie war diese Woche?</p>
          <div className="flex gap-2">
            {RATINGS.map((r) => (
              <button
                key={r.value}
                onClick={() => handleChange('rating', r.value)}
                title={r.label}
                className={`flex flex-col items-center rounded-xl p-2 transition-all ${
                  currentEntry.rating === r.value
                    ? 'bg-rose-100 ring-2 ring-rose-400'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl">{r.emoji}</span>
                <span className="mt-0.5 text-[10px] text-gray-500">{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Word */}
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-medium text-gray-600">
            Ein Wort für diese Woche
          </label>
          <input
            type="text"
            maxLength={100}
            placeholder={`z.B. „aufgeregt", „müde", „verliebt"...`}
            value={currentEntry.word ?? ''}
            onChange={(e) => handleChange('word', e.target.value || null)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-200"
          />
        </div>

        {/* Surprise */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-600">
            Was hat dich diese Woche überrascht?
          </label>
          <Textarea
            placeholder={`Ein Gedanke, ein Moment, etwas Schönes mit ${babyName}...`}
            value={currentEntry.surprise ?? ''}
            onChange={(e) => handleChange('surprise', e.target.value || null)}
            className="min-h-[80px] resize-none text-sm"
          />
        </div>

        {!isCurrentSSW && (
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={() => selectSSW(ssw)}>
              Zurück zu SSW {ssw}
            </Button>
          </div>
        )}
      </div>

      {/* Filled entries overview */}
      {entries.filter((e) => e.rating || e.word || e.surprise).length > 0 && (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-gray-700">📚 Deine Einträge</h2>
          <div className="space-y-2">
            {entries
              .filter((e) => e.rating || e.word || e.surprise)
              .sort((a, b) => b.ssw - a.ssw)
              .map((e) => {
                const r = RATINGS.find((rt) => rt.value === e.rating)
                return (
                  <button
                    key={e.ssw}
                    onClick={() => selectSSW(e.ssw)}
                    className="flex w-full items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 text-left hover:bg-rose-50 transition-colors"
                  >
                    <span className="text-xl">{r?.emoji ?? '📝'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-700">SSW {e.ssw}</p>
                      {e.word && <p className="truncate text-xs text-gray-500">„{e.word}"</p>}
                    </div>
                    {e.ssw === ssw && <Badge variant="secondary" className="text-xs shrink-0">Aktuell</Badge>}
                  </button>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}
