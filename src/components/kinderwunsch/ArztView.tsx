'use client'

import { useEffect, useMemo, useState } from 'react'
import { Share2, X } from 'lucide-react'

import {
  ARZT_FRAGEN,
  ARZT_KATEGORIE_LABELS,
  type ArztFrage,
} from '@/lib/kinderwunsch/arztFragen'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useLocale } from '@/lib/i18n/client'
import { localized, type LocalizedString } from '@/lib/i18n/localized'
import { useTheme } from '@/lib/theme/client'

function stripLeadingEmoji(text: string): string {
  return text.replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}]\s*/u, '').trim()
}

const STORAGE_KEY = 'mamamap-kw-arzt'

type CustomFrage = {
  id: string
  text: LocalizedString
  kategorie: ArztFrage['kategorie']
}

type ArztState = {
  asked: string[]
  custom: CustomFrage[]
}

const DEFAULT_STATE: ArztState = {
  asked: [],
  custom: [],
}

const KATEGORIE_KEYS = Object.keys(ARZT_KATEGORIE_LABELS) as Array<
  ArztFrage['kategorie']
>

function makeId(): string {
  return `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function ArztView() {
  const { locale } = useLocale()
  const { theme } = useTheme()
  const isClassic = theme === 'classic'
  const [hydrated, setHydrated] = useState(false)

  function categoryLabel(kat: ArztFrage['kategorie']): string {
    const raw = localized(ARZT_KATEGORIE_LABELS[kat], locale)
    return isClassic ? raw : stripLeadingEmoji(raw)
  }

  const [state, setState] = useState<ArztState>(DEFAULT_STATE)
  const [customText, setCustomText] = useState('')
  const [customKategorie, setCustomKategorie] =
    useState<ArztFrage['kategorie']>('fruchtbarkeit')
  const [shareCopied, setShareCopied] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as {
          asked?: unknown
          custom?: unknown
        }
        if (parsed && typeof parsed === 'object') {
          const asked = Array.isArray(parsed.asked)
            ? (parsed.asked.filter((x) => typeof x === 'string') as string[])
            : []
          const customRaw = Array.isArray(parsed.custom) ? parsed.custom : []
          const custom: CustomFrage[] = customRaw
            .map((c) => {
              if (!c || typeof c !== 'object') return null
              const obj = c as {
                id?: unknown
                text?: unknown
                kategorie?: unknown
              }
              if (typeof obj.id !== 'string') return null
              if (typeof obj.kategorie !== 'string') return null
              let text: LocalizedString
              if (typeof obj.text === 'string') {
                // Legacy shape — store as both languages
                text = { de: obj.text, en: obj.text }
              } else if (
                obj.text &&
                typeof obj.text === 'object' &&
                typeof (obj.text as LocalizedString).de === 'string' &&
                typeof (obj.text as LocalizedString).en === 'string'
              ) {
                text = obj.text as LocalizedString
              } else {
                return null
              }
              return {
                id: obj.id,
                text,
                kategorie: obj.kategorie as ArztFrage['kategorie'],
              }
            })
            .filter((x): x is CustomFrage => x !== null)
          setState({ asked, custom })
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

  const askedSet = useMemo(() => new Set(state.asked), [state.asked])

  const allFragen: ArztFrage[] = useMemo(() => {
    const customAsArzt: ArztFrage[] = state.custom.map((c) => ({
      id: c.id,
      emoji: '✏️',
      text: c.text,
      kategorie: c.kategorie,
    }))
    return [...ARZT_FRAGEN, ...customAsArzt]
  }, [state.custom])

  const fragenByKategorie = useMemo(() => {
    const map: Record<ArztFrage['kategorie'], ArztFrage[]> = {
      fruchtbarkeit: [],
      gesundheit: [],
      medikamente: [],
      genetik: [],
      lifestyle: [],
    }
    for (const f of allFragen) {
      map[f.kategorie].push(f)
    }
    return map
  }, [allFragen])

  const totalCount = allFragen.length
  const askedCount = allFragen.filter((f) => askedSet.has(f.id)).length

  function toggleAsked(id: string) {
    setState((prev) => {
      const isAsked = prev.asked.includes(id)
      return {
        ...prev,
        asked: isAsked ? prev.asked.filter((x) => x !== id) : [...prev.asked, id],
      }
    })
  }

  function addCustom() {
    const text = customText.trim()
    if (!text) return
    setState((prev) => ({
      ...prev,
      custom: [
        ...prev.custom,
        {
          id: makeId(),
          text: { de: text, en: text },
          kategorie: customKategorie,
        },
      ],
    }))
    setCustomText('')
  }

  function removeCustom(id: string) {
    setState((prev) => ({
      ...prev,
      custom: prev.custom.filter((c) => c.id !== id),
      asked: prev.asked.filter((x) => x !== id),
    }))
  }

  async function handleShare() {
    const heading = isClassic
      ? '💛 Meine Fragen für die Kinderwunschsprechstunde'
      : 'Meine Fragen für die Kinderwunschsprechstunde'
    const lines: string[] = [heading, '']
    for (const kat of KATEGORIE_KEYS) {
      const items = fragenByKategorie[kat].filter((f) => !askedSet.has(f.id))
      if (items.length === 0) continue
      lines.push(categoryLabel(kat))
      for (const f of items) {
        lines.push(`- ${localized(f.text, locale)}`)
      }
      lines.push('')
    }
    lines.push('(Notiere deine Antworten direkt nach dem Termin.)')
    const text = lines.join('\n')

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ text })
      } else {
        await navigator.clipboard.writeText(text)
        setShareCopied(true)
        setTimeout(() => setShareCopied(false), 2000)
      }
    } catch {
      // user cancelled or copy failed silently
    }
  }

  return (
    <div className="space-y-5">
      {/* Intro */}
      <section className="rounded-2xl bg-card p-5 shadow-sm">
        <p className="text-sm leading-relaxed text-foreground/80">
          Druck dir diese Liste aus oder schick sie dir aufs Handy — bevor du
          zum Frauenarzt gehst.
        </p>
      </section>

      {/* Share */}
      <Button
        onClick={handleShare}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        aria-label="Liste teilen oder kopieren"
      >
        {shareCopied ? (
          '✓ Kopiert!'
        ) : isClassic ? (
          '📤 Liste teilen'
        ) : (
          <>
            <Share2 className="mr-2 h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            Liste teilen
          </>
        )}
      </Button>

      {/* Counter */}
      <p
        className="text-center text-xs text-muted-foreground"
        aria-live="polite"
      >
        {hydrated ? `${askedCount} / ${totalCount} gestellt` : '—'}
      </p>

      {/* Categories */}
      {KATEGORIE_KEYS.map((kat) => {
        const items = fragenByKategorie[kat]
        if (items.length === 0) return null
        return (
          <section
            key={kat}
            aria-label={categoryLabel(kat)}
            className="overflow-hidden rounded-2xl bg-card shadow-sm"
          >
            <div className="border-b border-border px-5 py-3">
              <h2
                className={
                  isClassic
                    ? 'text-sm font-semibold text-foreground'
                    : 'font-display text-base font-medium text-foreground'
                }
              >
                {categoryLabel(kat)}
              </h2>
            </div>
            <ul className="space-y-3 px-5 py-4">
              {items.map((frage) => {
                const isAsked = askedSet.has(frage.id)
                const isCustom = state.custom.some((c) => c.id === frage.id)
                return (
                  <li key={frage.id} className="flex items-start gap-3">
                    <Checkbox
                      id={frage.id}
                      checked={isAsked}
                      onCheckedChange={() => toggleAsked(frage.id)}
                      className="mt-1 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                      aria-label={
                        isAsked
                          ? 'Als nicht gestellt markieren'
                          : 'Als gestellt markieren'
                      }
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={frage.id}
                        className={`flex cursor-pointer items-start gap-2 text-sm leading-snug ${
                          isAsked
                            ? 'text-muted-foreground/70 line-through opacity-60'
                            : 'text-foreground'
                        }`}
                      >
                        {isClassic && <span aria-hidden="true">{frage.emoji}</span>}
                        <span className="flex-1">{localized(frage.text, locale)}</span>
                      </Label>
                      {isCustom && (
                        <Badge
                          variant="secondary"
                          className="mt-1 bg-amber-100 text-xs text-amber-800 hover:bg-amber-100"
                        >
                          eigene Frage
                        </Badge>
                      )}
                    </div>
                    {isCustom && (
                      <button
                        type="button"
                        onClick={() => removeCustom(frage.id)}
                        aria-label="Eigene Frage entfernen"
                        className="text-muted-foreground/70 hover:text-primary"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}

      {/* Add custom */}
      <section
        aria-label="Eigene Frage hinzufügen"
        className="rounded-2xl bg-card p-5 shadow-sm"
      >
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          + Eigene Frage hinzufügen
        </h2>
        <div className="space-y-3">
          <Input
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="z.B. Wie lange darf ich noch Sport machen?"
            aria-label="Frage-Text"
          />
          <Select
            value={customKategorie}
            onValueChange={(v) =>
              setCustomKategorie(v as ArztFrage['kategorie'])
            }
          >
            <SelectTrigger aria-label="Kategorie">
              <SelectValue placeholder="Kategorie wählen" />
            </SelectTrigger>
            <SelectContent>
              {KATEGORIE_KEYS.map((kat) => (
                <SelectItem key={kat} value={kat}>
                  {categoryLabel(kat)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={addCustom}
            disabled={!customText.trim()}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Hinzufügen
          </Button>
        </div>
      </section>
    </div>
  )
}
