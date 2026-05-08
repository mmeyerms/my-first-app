'use client'

import { useEffect, useMemo, useState } from 'react'
import { Gift, Lock, Mail, Sparkle, X } from 'lucide-react'

import {
  ERSTE_30_MIN_VORSCHLAEGE,
  REVERSE_BUCKET_VORSCHLAEGE,
} from '@/lib/kinderwunsch/vorfreude'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useLocale, useT } from '@/lib/i18n/client'
import { localized } from '@/lib/i18n/localized'
import { useTheme } from '@/lib/theme/client'

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
  const t = useT()
  const { theme } = useTheme()
  const isClassic = theme === 'classic'
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
      <TabsList className="grid w-full grid-cols-3 bg-secondary">
        <TabsTrigger
          value="letter"
          className="data-[state=active]:bg-card data-[state=active]:text-primary"
        >
          Brief
        </TabsTrigger>
        <TabsTrigger
          value="first30"
          className="data-[state=active]:bg-card data-[state=active]:text-primary"
        >
          30 Minuten
        </TabsTrigger>
        <TabsTrigger
          value="bucket"
          className="data-[state=active]:bg-card data-[state=active]:text-primary"
        >
          Bucket List
        </TabsTrigger>
      </TabsList>

      {/* Tab 1 — Brief */}
      <TabsContent value="letter" className="mt-4">
        <section aria-label={t.kinderwunsch.vorfreude.letterSectionAria} className="space-y-4">
          {!hydrated ? (
            <div className="rounded-2xl bg-card p-5 text-sm text-muted-foreground shadow-sm">
              {t.kinderwunsch.vorfreude.letterLoading}
            </div>
          ) : sealed && state.letter ? (
            <div className="space-y-4 rounded-2xl bg-gradient-to-br from-secondary/70 to-secondary p-6 shadow-sm ring-1 ring-primary/20">
              <div className="flex flex-col items-center text-center">
                {isClassic ? (
                  <span className="mb-3 text-5xl" aria-hidden="true">
                    🔒
                  </span>
                ) : (
                  <span
                    aria-hidden="true"
                    className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-secondary"
                  >
                    <Lock className="h-6 w-6 text-primary" strokeWidth={1.5} />
                  </span>
                )}
                <p className="text-sm text-foreground/80">
                  {t.kinderwunsch.vorfreude.letterSealedAtPrefix}{' '}
                  <span className="font-medium">
                    {formatDate(state.letter.writtenAt)}
                  </span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t.kinderwunsch.vorfreude.letterSealedHint}
                </p>
              </div>

              {letterRevealed ? (
                <pre className="whitespace-pre-wrap rounded-xl bg-card/80 p-4 text-sm leading-relaxed text-foreground">
                  {state.letter.content}
                </pre>
              ) : (
                <Button
                  onClick={() => setLetterRevealed(true)}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {t.kinderwunsch.vorfreude.openLetter}
                </Button>
              )}

              <Button
                variant="outline"
                onClick={unsealLetter}
                className="w-full border-primary/20 text-primary hover:bg-secondary"
              >
                {t.kinderwunsch.vorfreude.letterUnseal}
              </Button>
            </div>
          ) : (
            <div className="space-y-3 rounded-2xl bg-card p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">
                {t.kinderwunsch.vorfreude.letterDescription}
              </p>
              <Textarea
                value={letterDraft}
                onChange={(e) => setLetterDraft(e.target.value)}
                placeholder={t.kinderwunsch.vorfreude.letterPlaceholderLong}
                className="min-h-[200px] resize-y"
                aria-label={t.kinderwunsch.vorfreude.letterAriaContent}
              />
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="outline"
                  onClick={saveLetter}
                  disabled={!letterDraft.trim()}
                  className="flex-1 border-primary/20 text-primary hover:bg-secondary"
                >
                  Speichern
                </Button>
                <Button
                  onClick={sealLetter}
                  disabled={!letterDraft.trim()}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isClassic ? (
                    <>✉️ Versiegeln</>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                      Versiegeln
                    </>
                  )}
                </Button>
              </div>
              {state.letter && !state.letter.sealed && (
                <p className="text-xs text-muted-foreground">
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
          <div className="rounded-2xl bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">
              Was wollt ihr in der ersten halben Stunde nach dem positiven
              Test tun? Wählt aus oder fügt eigenes hinzu.
            </p>
          </div>

          {/* Eure Box */}
          <div className="rounded-2xl bg-gradient-to-br from-secondary to-secondary/70 p-5 shadow-sm ring-1 ring-primary/20">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-primary">
                {isClassic ? (
                  <span aria-hidden="true">💝</span>
                ) : (
                  <Gift className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                )}
                Eure Box
              </h3>
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary hover:bg-primary/10"
              >
                {hydrated ? state.first30.length : 0} Sachen
              </Badge>
            </div>
            {hydrated && state.first30.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Noch leer — wählt unten Vorschläge oder fügt eigene hinzu.
              </p>
            ) : (
              <ul className="space-y-2">
                {state.first30.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-2 rounded-xl bg-card px-3 py-2"
                  >
                    <span className="flex-1 text-sm text-foreground">
                      {item.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFirst30(item.id)}
                      aria-label="Entfernen"
                      className="text-muted-foreground/70 hover:text-primary"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Custom add */}
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <p className="mb-2 text-xs font-medium text-foreground/80">
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
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                +
              </Button>
            </div>
          </div>

          {/* Suggestions */}
          <div className="space-y-2">
            <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
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
                          ? 'cursor-default bg-secondary text-primary'
                          : 'bg-card text-foreground hover:bg-secondary/50'
                      }`}
                    >
                      <span
                        className={`mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          added
                            ? 'bg-primary text-primary-foreground'
                            : 'border border-primary/40 text-primary'
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
          <div className="rounded-2xl bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">
              Was wollt ihr noch erleben — bevor das Baby kommt?
            </p>
          </div>

          {/* Counter / Eure Liste */}
          <div className="rounded-2xl bg-gradient-to-br from-secondary to-secondary/70 p-5 shadow-sm ring-1 ring-primary/20">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-primary">
                {isClassic ? (
                  <span aria-hidden="true">🌟</span>
                ) : (
                  <Sparkle className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                )}
                Eure Liste
              </h3>
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary hover:bg-primary/10"
              >
                {hydrated ? bucketDoneCount : 0} von{' '}
                {hydrated ? state.bucket.length : 0} erlebt
              </Badge>
            </div>
            {hydrated && state.bucket.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Noch leer — wählt unten Vorschläge oder fügt eigene hinzu.
              </p>
            ) : (
              <ul className="space-y-2">
                {state.bucket.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-2 rounded-xl bg-card px-3 py-2"
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
                          : 'border border-border text-muted-foreground/70 hover:border-green-400'
                      }`}
                    >
                      {item.done ? '✓' : ''}
                    </button>
                    <span
                      className={`flex-1 text-sm ${
                        item.done
                          ? 'text-muted-foreground/70 line-through'
                          : 'text-foreground'
                      }`}
                    >
                      {item.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeBucket(item.id)}
                      aria-label="Entfernen"
                      className="text-muted-foreground/70 hover:text-primary"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Custom add */}
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <p className="mb-2 text-xs font-medium text-foreground/80">
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
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                +
              </Button>
            </div>
          </div>

          {/* Suggestions */}
          <div className="space-y-2">
            <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
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
                          ? 'cursor-default bg-secondary text-primary'
                          : 'bg-card text-foreground hover:bg-secondary/50'
                      }`}
                    >
                      <span
                        className={`mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          added
                            ? 'bg-primary text-primary-foreground'
                            : 'border border-primary/40 text-primary'
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
