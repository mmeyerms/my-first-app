'use client'

import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'

import {
  ERSTE_30_MIN_VORSCHLAEGE,
  REVERSE_BUCKET_VORSCHLAEGE,
} from '@/lib/kinderwunsch/vorfreude'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useLocale } from '@/lib/i18n/client'
import { localized } from '@/lib/i18n/localized'

const STORAGE_KEY = 'mamamap-kw-vorfreude'

type Letter = {
  content: string
  writtenAt: string
  sealed: boolean
}

type BoxItem = {
  id: string
  text: string
  done: boolean
}

type VorfreudeState = {
  letter?: Letter
  first30: BoxItem[]
  bucket: BoxItem[]
}

const DEFAULT_STATE: VorfreudeState = {
  letter: undefined,
  first30: [],
  bucket: [],
}

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

export function VorfreudeView() {
  const { locale } = useLocale()
  const [hydrated, setHydrated] = useState(false)
  const [state, setState] = useState<VorfreudeState>(DEFAULT_STATE)

  // Letter form state
  const [letterDraft, setLetterDraft] = useState('')
  const [letterRevealed, setLetterRevealed] = useState(false)

  // Custom inputs for box / bucket
  const [customFirst30, setCustomFirst30] = useState('')
  const [customBucket, setCustomBucket] = useState('')

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as VorfreudeState
        if (parsed && typeof parsed === 'object') {
          setState({
            letter: parsed.letter,
            first30: Array.isArray(parsed.first30) ? parsed.first30 : [],
            bucket: Array.isArray(parsed.bucket) ? parsed.bucket : [],
          })
          if (parsed.letter && !parsed.letter.sealed) {
            setLetterDraft(parsed.letter.content)
          }
        }
      }
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore
    }
  }, [state, hydrated])

  // ───── Letter ─────
  function saveLetter() {
    setState((prev) => ({
      ...prev,
      letter: {
        content: letterDraft,
        writtenAt: prev.letter?.writtenAt ?? new Date().toISOString(),
        sealed: false,
      },
    }))
  }

  function sealLetter() {
    if (!letterDraft.trim()) return
    setState((prev) => ({
      ...prev,
      letter: {
        content: letterDraft,
        writtenAt: prev.letter?.writtenAt ?? new Date().toISOString(),
        sealed: true,
      },
    }))
    setLetterRevealed(false)
  }

  function unsealLetter() {
    setState((prev) =>
      prev.letter
        ? {
            ...prev,
            letter: { ...prev.letter, sealed: false },
          }
        : prev,
    )
    if (state.letter) setLetterDraft(state.letter.content)
    setLetterRevealed(false)
  }

  // ───── First 30 min Box ─────
  const first30Texts = useMemo(
    () => new Set(state.first30.map((it) => it.text)),
    [state.first30],
  )

  function addFirst30FromSuggestion(text: string) {
    if (first30Texts.has(text)) return
    setState((prev) => ({
      ...prev,
      first30: [...prev.first30, { id: makeId('f30'), text, done: false }],
    }))
  }

  function addCustomFirst30() {
    const text = customFirst30.trim()
    if (!text) return
    setState((prev) => ({
      ...prev,
      first30: [...prev.first30, { id: makeId('f30'), text, done: false }],
    }))
    setCustomFirst30('')
  }

  function removeFirst30(id: string) {
    setState((prev) => ({
      ...prev,
      first30: prev.first30.filter((it) => it.id !== id),
    }))
  }

  // ───── Bucket List ─────
  const bucketTexts = useMemo(
    () => new Set(state.bucket.map((it) => it.text)),
    [state.bucket],
  )

  function addBucketFromSuggestion(text: string) {
    if (bucketTexts.has(text)) return
    setState((prev) => ({
      ...prev,
      bucket: [...prev.bucket, { id: makeId('bk'), text, done: false }],
    }))
  }

  function addCustomBucket() {
    const text = customBucket.trim()
    if (!text) return
    setState((prev) => ({
      ...prev,
      bucket: [...prev.bucket, { id: makeId('bk'), text, done: false }],
    }))
    setCustomBucket('')
  }

  function removeBucket(id: string) {
    setState((prev) => ({
      ...prev,
      bucket: prev.bucket.filter((it) => it.id !== id),
    }))
  }

  function toggleBucketDone(id: string) {
    setState((prev) => ({
      ...prev,
      bucket: prev.bucket.map((it) =>
        it.id === id ? { ...it, done: !it.done } : it,
      ),
    }))
  }

  const bucketDoneCount = state.bucket.filter((it) => it.done).length
  const sealed = state.letter?.sealed === true

  return (
    <Tabs defaultValue="letter" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-rose-100">
        <TabsTrigger
          value="letter"
          className="data-[state=active]:bg-white data-[state=active]:text-rose-700"
        >
          Brief
        </TabsTrigger>
        <TabsTrigger
          value="first30"
          className="data-[state=active]:bg-white data-[state=active]:text-rose-700"
        >
          30 Minuten
        </TabsTrigger>
        <TabsTrigger
          value="bucket"
          className="data-[state=active]:bg-white data-[state=active]:text-rose-700"
        >
          Bucket List
        </TabsTrigger>
      </TabsList>

      {/* Tab 1 — Brief */}
      <TabsContent value="letter" className="mt-4">
        <section aria-label="Brief an dein zukünftiges Ich" className="space-y-4">
          {!hydrated ? (
            <div className="rounded-2xl bg-white p-5 text-sm text-gray-500 shadow-sm">
              Lade…
            </div>
          ) : sealed && state.letter ? (
            <div className="space-y-4 rounded-2xl bg-gradient-to-br from-amber-50 to-rose-50 p-6 shadow-sm ring-1 ring-amber-200">
              <div className="flex flex-col items-center text-center">
                <span className="mb-3 text-5xl" aria-hidden="true">
                  🔒
                </span>
                <p className="text-sm text-gray-700">
                  Versiegelt am{' '}
                  <span className="font-medium">
                    {formatDate(state.letter.writtenAt)}
                  </span>
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Lies ihn am Tag des positiven Tests wieder.
                </p>
              </div>

              {letterRevealed ? (
                <pre className="whitespace-pre-wrap rounded-xl bg-white/80 p-4 text-sm leading-relaxed text-gray-800">
                  {state.letter.content}
                </pre>
              ) : (
                <Button
                  onClick={() => setLetterRevealed(true)}
                  className="w-full bg-rose-500 text-white hover:bg-rose-600"
                >
                  Brief öffnen
                </Button>
              )}

              <Button
                variant="outline"
                onClick={unsealLetter}
                className="w-full border-rose-200 text-rose-700 hover:bg-rose-50"
              >
                Versiegelung lösen
              </Button>
            </div>
          ) : (
            <div className="space-y-3 rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-600">
                Schreib einen Brief an dich selbst. Versiegele ihn — und lies
                ihn am Tag des positiven Tests wieder.
              </p>
              <Textarea
                value={letterDraft}
                onChange={(e) => setLetterDraft(e.target.value)}
                placeholder="Liebes zukünftiges Ich, wenn du das liest, ist der Test positiv und du..."
                className="min-h-[200px] resize-y"
                aria-label="Briefinhalt"
              />
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="outline"
                  onClick={saveLetter}
                  disabled={!letterDraft.trim()}
                  className="flex-1 border-rose-200 text-rose-700 hover:bg-rose-50"
                >
                  Speichern
                </Button>
                <Button
                  onClick={sealLetter}
                  disabled={!letterDraft.trim()}
                  className="flex-1 bg-rose-500 text-white hover:bg-rose-600"
                >
                  ✉️ Versiegeln
                </Button>
              </div>
              {state.letter && !state.letter.sealed && (
                <p className="text-xs text-gray-500">
                  Entwurf gespeichert am {formatDate(state.letter.writtenAt)}.
                </p>
              )}
            </div>
          )}
        </section>
      </TabsContent>

      {/* Tab 2 — Erste 30 Minuten */}
      <TabsContent value="first30" className="mt-4">
        <section aria-label="Erste 30 Minuten Box" className="space-y-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-600">
              Was wollt ihr in der ersten halben Stunde nach dem positiven
              Test tun? Wählt aus oder fügt eigenes hinzu.
            </p>
          </div>

          {/* Eure Box */}
          <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100 p-5 shadow-sm ring-1 ring-rose-200">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-rose-900">
                💝 Eure Box
              </h3>
              <Badge
                variant="secondary"
                className="bg-rose-200 text-rose-900 hover:bg-rose-200"
              >
                {hydrated ? state.first30.length : 0} Sachen
              </Badge>
            </div>
            {hydrated && state.first30.length === 0 ? (
              <p className="text-xs text-gray-600">
                Noch leer — wählt unten Vorschläge oder fügt eigene hinzu.
              </p>
            ) : (
              <ul className="space-y-2">
                {state.first30.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-2 rounded-xl bg-white px-3 py-2"
                  >
                    <span className="flex-1 text-sm text-gray-800">
                      {item.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFirst30(item.id)}
                      aria-label="Entfernen"
                      className="text-gray-400 hover:text-rose-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Custom add */}
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="mb-2 text-xs font-medium text-gray-700">
              + Eigenes hinzufügen
            </p>
            <div className="flex gap-2">
              <Input
                value={customFirst30}
                onChange={(e) => setCustomFirst30(e.target.value)}
                placeholder="z.B. Ein Tagebuch anlegen"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addCustomFirst30()
                  }
                }}
                aria-label="Eigene Idee"
              />
              <Button
                onClick={addCustomFirst30}
                disabled={!customFirst30.trim()}
                className="bg-rose-500 text-white hover:bg-rose-600"
              >
                +
              </Button>
            </div>
          </div>

          {/* Suggestions */}
          <div className="space-y-2">
            <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Vorschläge
            </h3>
            <ul className="space-y-2">
              {ERSTE_30_MIN_VORSCHLAEGE.map((suggestion) => {
                const text = localized(suggestion, locale)
                const added = first30Texts.has(text)
                return (
                  <li key={text}>
                    <button
                      type="button"
                      onClick={() => addFirst30FromSuggestion(text)}
                      disabled={added}
                      className={`flex w-full items-start gap-3 rounded-2xl px-4 py-3 text-left text-sm shadow-sm transition-colors ${
                        added
                          ? 'cursor-default bg-rose-50 text-rose-700'
                          : 'bg-white text-gray-800 hover:bg-rose-50'
                      }`}
                    >
                      <span
                        className={`mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          added
                            ? 'bg-rose-500 text-white'
                            : 'border border-rose-300 text-rose-500'
                        }`}
                        aria-hidden="true"
                      >
                        {added ? '✓' : '+'}
                      </span>
                      <span className="flex-1 leading-snug">{text}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      </TabsContent>

      {/* Tab 3 — Bucket List */}
      <TabsContent value="bucket" className="mt-4">
        <section aria-label="Reverse Bucket List" className="space-y-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-600">
              Was wollt ihr noch erleben — bevor das Baby kommt?
            </p>
          </div>

          {/* Counter / Eure Liste */}
          <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100 p-5 shadow-sm ring-1 ring-rose-200">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-rose-900">
                🌟 Eure Liste
              </h3>
              <Badge
                variant="secondary"
                className="bg-rose-200 text-rose-900 hover:bg-rose-200"
              >
                {hydrated ? bucketDoneCount : 0} von{' '}
                {hydrated ? state.bucket.length : 0} erlebt
              </Badge>
            </div>
            {hydrated && state.bucket.length === 0 ? (
              <p className="text-xs text-gray-600">
                Noch leer — wählt unten Vorschläge oder fügt eigene hinzu.
              </p>
            ) : (
              <ul className="space-y-2">
                {state.bucket.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-2 rounded-xl bg-white px-3 py-2"
                  >
                    <button
                      type="button"
                      onClick={() => toggleBucketDone(item.id)}
                      aria-pressed={item.done}
                      aria-label={
                        item.done ? 'Als unerlebt markieren' : 'Als erlebt markieren'
                      }
                      className={`mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        item.done
                          ? 'bg-green-500 text-white'
                          : 'border border-gray-300 text-gray-400 hover:border-green-400'
                      }`}
                    >
                      {item.done ? '✓' : ''}
                    </button>
                    <span
                      className={`flex-1 text-sm ${
                        item.done
                          ? 'text-gray-400 line-through'
                          : 'text-gray-800'
                      }`}
                    >
                      {item.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeBucket(item.id)}
                      aria-label="Entfernen"
                      className="text-gray-400 hover:text-rose-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Custom add */}
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="mb-2 text-xs font-medium text-gray-700">
              + Eigenes hinzufügen
            </p>
            <div className="flex gap-2">
              <Input
                value={customBucket}
                onChange={(e) => setCustomBucket(e.target.value)}
                placeholder="z.B. Ein Wochenende am Meer"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addCustomBucket()
                  }
                }}
                aria-label="Eigene Idee"
              />
              <Button
                onClick={addCustomBucket}
                disabled={!customBucket.trim()}
                className="bg-rose-500 text-white hover:bg-rose-600"
              >
                +
              </Button>
            </div>
          </div>

          {/* Suggestions */}
          <div className="space-y-2">
            <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Vorschläge
            </h3>
            <ul className="space-y-2">
              {REVERSE_BUCKET_VORSCHLAEGE.map((suggestion) => {
                const text = localized(suggestion, locale)
                const added = bucketTexts.has(text)
                return (
                  <li key={text}>
                    <button
                      type="button"
                      onClick={() => addBucketFromSuggestion(text)}
                      disabled={added}
                      className={`flex w-full items-start gap-3 rounded-2xl px-4 py-3 text-left text-sm shadow-sm transition-colors ${
                        added
                          ? 'cursor-default bg-rose-50 text-rose-700'
                          : 'bg-white text-gray-800 hover:bg-rose-50'
                      }`}
                    >
                      <span
                        className={`mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          added
                            ? 'bg-rose-500 text-white'
                            : 'border border-rose-300 text-rose-500'
                        }`}
                        aria-hidden="true"
                      >
                        {added ? '✓' : '+'}
                      </span>
                      <span className="flex-1 leading-snug">{text}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      </TabsContent>
    </Tabs>
  )
}
