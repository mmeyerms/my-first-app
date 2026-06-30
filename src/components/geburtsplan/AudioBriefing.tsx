'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Play, Square, Copy, Download, Volume2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { buildBriefingText, estimateDuration } from '@/lib/geburtsplan/briefing'
import type { Locale } from '@/lib/i18n/types'
import { useT } from '@/lib/i18n/client'

interface Props {
  answers: Record<string, string | string[]>
  locale: Locale
  babyName?: string | null
}

export function AudioBriefing({ answers, locale, babyName }: Props) {
  const t = useT()
  const text = useMemo(
    () => buildBriefingText(answers, locale, babyName),
    [answers, locale, babyName],
  )
  const duration = useMemo(() => estimateDuration(text), [text])

  const [isPlaying, setIsPlaying] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [copied, setCopied] = useState(false)
  const [supportsTts, setSupportsTts] = useState(true)

  // Load available voices (some browsers fire `voiceschanged` after init)
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSupportsTts(false)
      return
    }
    const load = () => setVoices(window.speechSynthesis.getVoices())
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', load)
    }
  }, [])

  // Stop playback on unmount or when text/locale changes
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const preferredVoice = useMemo<SpeechSynthesisVoice | undefined>(() => {
    if (voices.length === 0) return undefined
    const langPrefix = locale === 'de' ? 'de' : 'en'
    return (
      voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix)) ?? voices[0]
    )
  }, [voices, locale])

  const play = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    if (preferredVoice) utter.voice = preferredVoice
    utter.lang = locale === 'de' ? 'de-DE' : 'en-US'
    utter.rate = 0.95
    utter.pitch = 1.0
    utter.onend = () => setIsPlaying(false)
    utter.onerror = () => setIsPlaying(false)
    window.speechSynthesis.speak(utter)
    setIsPlaying(true)
  }, [text, preferredVoice, locale])

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    setIsPlaying(false)
  }, [])

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // graceful no-op if clipboard is blocked
    }
  }, [text])

  const download = useCallback(() => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mamamap-geburtsplan-briefing.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [text])

  // Don't render if too little content for a meaningful briefing
  if (text.split(/\s+/).filter(Boolean).length < 20) return null

  return (
    <section
      className="card-elevated rounded-2xl bg-card p-5 ring-1 ring-primary/15"
      aria-label={t.audioBriefing.title}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary"
        >
          <Volume2 className="h-6 w-6 text-primary" strokeWidth={1.5} />
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg font-medium text-foreground">
            {t.audioBriefing.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.audioBriefing.subtitle}
          </p>
          <p className="mt-2 text-xs italic text-muted-foreground">
            {t.audioBriefing.duration.replace('{seconds}', String(duration))}
          </p>

          {!supportsTts && (
            <p className="mt-2 text-xs text-muted-foreground">
              {t.audioBriefing.unsupported}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {supportsTts && (
              !isPlaying ? (
                <Button
                  onClick={play}
                  className="gap-2"
                  aria-label={t.audioBriefing.playAria}
                >
                  <Play className="h-4 w-4" strokeWidth={1.5} />
                  {t.audioBriefing.play}
                </Button>
              ) : (
                <Button
                  onClick={stop}
                  variant="destructive"
                  className="gap-2"
                  aria-label={t.audioBriefing.stopAria}
                >
                  <Square className="h-4 w-4" strokeWidth={1.5} />
                  {t.audioBriefing.stop}
                </Button>
              )
            )}
            <Button
              onClick={copy}
              variant="outline"
              className="gap-2"
              aria-label={t.audioBriefing.copyAria}
            >
              {copied ? (
                <Check className="h-4 w-4" strokeWidth={1.5} />
              ) : (
                <Copy className="h-4 w-4" strokeWidth={1.5} />
              )}
              {copied ? t.audioBriefing.copied : t.audioBriefing.copy}
            </Button>
            <Button
              onClick={download}
              variant="outline"
              className="gap-2"
              aria-label={t.audioBriefing.downloadAria}
            >
              <Download className="h-4 w-4" strokeWidth={1.5} />
              {t.audioBriefing.download}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
