'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Loader2, Mic } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Minimal inline types for the Web Speech API so no separate .d.ts file is needed.
// Reference: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionResult {
  isFinal: boolean
  length: number
  0: SpeechRecognitionAlternative
  item(index: number): SpeechRecognitionAlternative
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message?: string
}

interface SpeechRecognitionLike extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike

function getSpeechRecognitionCtor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null) as
    | SpeechRecognitionConstructor
    | null
}

export interface VoiceInputButtonProps {
  /** Called when the user stops recording and a final transcript is available. */
  onTranscript: (text: string) => void
  /** Called when interim results stream in — useful for live-preview UIs. */
  onInterim?: (text: string) => void
  /** Locale hint: 'en' → en-US, everything else → de-DE. */
  locale?: string
  /** shadcn button size. */
  size?: 'default' | 'sm' | 'icon'
  /** shadcn button variant. */
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  /** Extra class name for the button. */
  className?: string
  /** Accessible label; defaults to a German diary-appropriate one. */
  ariaLabel?: string
  /** Disable the button (e.g. when saving). */
  disabled?: boolean
}

type VoiceState = 'idle' | 'recording' | 'processing'

export function VoiceInputButton({
  onTranscript,
  onInterim,
  locale,
  size = 'icon',
  variant = 'outline',
  className,
  ariaLabel,
  disabled,
}: VoiceInputButtonProps) {
  const [supported, setSupported] = useState(false)
  const [state, setState] = useState<VoiceState>('idle')
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const finalTextRef = useRef<string>('')

  // Detect support on the client only — avoids SSR mismatch.
  useEffect(() => {
    setSupported(getSpeechRecognitionCtor() !== null)
  }, [])

  // Ensure we tear down the recogniser on unmount to release the mic.
  useEffect(() => {
    return () => {
      const rec = recognitionRef.current
      if (rec) {
        try {
          rec.onresult = null
          rec.onerror = null
          rec.onend = null
          rec.onstart = null
          rec.abort()
        } catch {
          // Ignore — recogniser may already be stopped.
        }
        recognitionRef.current = null
      }
    }
  }, [])

  const start = useCallback(() => {
    if (state !== 'idle') return
    const Ctor = getSpeechRecognitionCtor()
    if (!Ctor) return

    const rec: SpeechRecognitionLike = new Ctor()
    rec.lang = locale === 'en' ? 'en-US' : 'de-DE'
    rec.continuous = true
    rec.interimResults = true
    rec.maxAlternatives = 1

    finalTextRef.current = ''

    rec.onstart = () => setState('recording')

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const transcript = result[0]?.transcript ?? ''
        if (result.isFinal) {
          finalTextRef.current += (finalTextRef.current ? ' ' : '') + transcript.trim()
        } else {
          interim += transcript
        }
      }
      if (interim && onInterim) onInterim(interim)
    }

    rec.onerror = () => {
      setState('idle')
    }

    rec.onend = () => {
      setState('processing')
      const finalText = finalTextRef.current.trim()
      if (finalText) onTranscript(finalText)
      // Brief tick so the loader is visible for at least a frame.
      setTimeout(() => setState('idle'), 150)
      recognitionRef.current = null
    }

    recognitionRef.current = rec
    try {
      rec.start()
    } catch {
      setState('idle')
      recognitionRef.current = null
    }
  }, [locale, onInterim, onTranscript, state])

  const stop = useCallback(() => {
    const rec = recognitionRef.current
    if (!rec) return
    try {
      rec.stop()
    } catch {
      // Ignore.
    }
  }, [])

  if (!supported) return null

  const isRecording = state === 'recording'
  const isProcessing = state === 'processing'

  const label =
    ariaLabel ??
    (isRecording
      ? locale === 'en'
        ? 'Stop recording'
        : 'Aufnahme stoppen'
      : locale === 'en'
      ? 'Start voice input'
      : 'Spracheingabe starten')

  return (
    <Button
      type="button"
      size={size}
      variant={isRecording ? 'destructive' : variant}
      disabled={disabled || isProcessing}
      onClick={isRecording ? stop : start}
      aria-label={label}
      aria-pressed={isRecording}
      title={label}
      className={cn(
        'relative shrink-0',
        isRecording && 'animate-pulse',
        className,
      )}
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <>
          <Mic className="h-4 w-4" aria-hidden="true" />
          {isRecording && (
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background"
            />
          )}
        </>
      )}
    </Button>
  )
}

export default VoiceInputButton
