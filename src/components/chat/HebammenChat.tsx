'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { MessageCircle, Send, Sparkles, Stethoscope } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useLocale, useT } from '@/lib/i18n/client'
import { cn } from '@/lib/utils'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ApiResponse {
  role?: 'assistant'
  content?: string
  demoMode?: boolean
  error?: string
}

// Pages where the bubble must NOT appear (public / auth flows).
const HIDDEN_PATH_PREFIXES = [
  '/login',
  '/register',
  '/passwort-vergessen',
  '/onboarding',
  '/partner/invite', // public invite-accept page
] as const

function isHiddenPath(pathname: string | null): boolean {
  if (!pathname) return true
  if (pathname === '/') return true
  return HIDDEN_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

function storageKey(pregnancyId: string | null): string {
  return `mamamap-hebamme-chat-${pregnancyId ?? 'default'}`
}

function readStored(pregnancyId: string | null): ChatMessage[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(storageKey(pregnancyId))
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(
        (m): m is ChatMessage =>
          !!m &&
          typeof m === 'object' &&
          'role' in m &&
          'content' in m &&
          (m.role === 'user' || m.role === 'assistant') &&
          typeof m.content === 'string',
      )
      .slice(-40)
  } catch {
    return []
  }
}

function writeStored(pregnancyId: string | null, messages: ChatMessage[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(
      storageKey(pregnancyId),
      JSON.stringify(messages.slice(-40)),
    )
  } catch {
    // ignore quota / private mode errors
  }
}

function readActivePregnancyId(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem('mamamap-active-pregnancy-id')
  } catch {
    return null
  }
}

export function HebammenChat() {
  const pathname = usePathname()
  const t = useT()
  const { locale } = useLocale()
  const hidden = isHiddenPath(pathname)

  const [open, setOpen] = useState(false)
  const [pregnancyId, setPregnancyId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [demoMode, setDemoMode] = useState(false)

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  // Hydrate pregnancy id + persisted conversation on mount.
  useEffect(() => {
    const pid = readActivePregnancyId()
    setPregnancyId(pid)
    setMessages(readStored(pid))
  }, [])

  // Persist on every change.
  useEffect(() => {
    writeStored(pregnancyId, messages)
  }, [pregnancyId, messages])

  // Auto-scroll to latest message whenever messages or loading changes.
  useEffect(() => {
    if (!open) return
    const el = scrollRef.current
    if (!el) return
    // Defer to next frame so newly-added node is laid out.
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight
    })
  }, [messages, loading, open])

  // Focus the textarea when the sheet opens.
  useEffect(() => {
    if (!open) return
    const handle = window.setTimeout(() => {
      textareaRef.current?.focus()
    }, 200)
    return () => window.clearTimeout(handle)
  }, [open])

  const suggestions = useMemo(
    () => [...(t.hebamme.suggestions ?? [])],
    [t.hebamme.suggestions],
  )

  const handleSend = useCallback(
    async (textOverride?: string) => {
      const raw = (textOverride ?? input).trim()
      if (!raw || loading) return

      const userMsg: ChatMessage = { role: 'user', content: raw }
      const next = [...messages, userMsg]
      setMessages(next)
      setInput('')
      setLoading(true)
      setError(null)

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ messages: next, locale }),
        })

        const data = (await res.json().catch(() => ({}))) as ApiResponse

        if (!res.ok || !data.content) {
          throw new Error(data.error ?? 'request_failed')
        }

        setDemoMode(Boolean(data.demoMode))
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.content as string },
        ])
      } catch {
        setError(t.hebamme.error)
      } finally {
        setLoading(false)
      }
    },
    [input, loading, messages, locale, t.hebamme.error],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        void handleSend()
      }
    },
    [handleSend],
  )

  const handleNewChat = useCallback(() => {
    setMessages([])
    setError(null)
    setInput('')
    setDemoMode(false)
    writeStored(pregnancyId, [])
  }, [pregnancyId])

  if (hidden) return null

  const hasMessages = messages.length > 0

  return (
    <>
      {/* Floating bubble */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t.hebamme.bubbleAria}
        className={cn(
          // Mobile: sit above the bottom nav (~64px). Desktop: 24px from bottom.
          'fixed right-4 z-40 flex h-14 w-14 items-center justify-center md:right-6',
          'bottom-[calc(env(safe-area-inset-bottom)+72px)] md:bottom-6',
          'rounded-full bg-primary text-primary-foreground shadow-lg',
          'transition-transform duration-200 ease-out',
          'hover:scale-105 focus-visible:scale-105',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          open && 'pointer-events-none opacity-0',
        )}
      >
        <Stethoscope className="h-6 w-6" aria-hidden="true" />
        <span className="sr-only">{t.hebamme.bubbleAria}</span>
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="flex h-full w-full flex-col gap-0 p-0 sm:max-w-md"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <header className="flex items-start justify-between gap-3 border-b border-border px-5 pb-4 pt-5">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Stethoscope className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="space-y-0.5">
                  <SheetTitle className="text-base font-semibold leading-tight">
                    {t.hebamme.title}
                  </SheetTitle>
                  <SheetDescription className="text-xs">
                    {t.hebamme.subtitle}
                  </SheetDescription>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {hasMessages && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={handleNewChat}
                    aria-label={t.hebamme.newChatAria}
                    className="h-8 px-2 text-xs"
                  >
                    {t.hebamme.newChat}
                  </Button>
                )}
                <SheetClose asChild>
                  <span className="sr-only">{t.hebamme.closeAria}</span>
                </SheetClose>
              </div>
            </header>

            {/* Disclaimer + demo-mode banner */}
            <div className="space-y-2 border-b border-border bg-amber-50 px-5 py-3 text-xs leading-relaxed text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
              <p>{t.hebamme.disclaimer}</p>
              {demoMode && (
                <p className="flex items-center gap-1.5 text-[11px] font-medium text-amber-800 dark:text-amber-200">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  {t.hebamme.demoMode}
                </p>
              )}
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 min-h-0">
              <div
                ref={scrollRef}
                className="h-full overflow-y-auto px-5 py-5"
                aria-live="polite"
                aria-label={t.hebamme.title}
              >
                {/* Greeting + suggestions when conversation is empty */}
                {!hasMessages && (
                  <div className="space-y-5">
                    <div className="flex items-start gap-3">
                      <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                        <Stethoscope className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div className="rounded-2xl rounded-tl-sm bg-secondary px-4 py-3 text-sm leading-relaxed text-foreground">
                        {t.hebamme.emptyGreeting}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {t.hebamme.suggestionsHeading}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => void handleSend(s)}
                            className={cn(
                              'rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground',
                              'transition-colors hover:bg-secondary hover:text-secondary-foreground',
                              'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
                            )}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Conversation */}
                {hasMessages && (
                  <ul className="flex flex-col gap-4">
                    {messages.map((m, i) => (
                      <li
                        key={`${i}-${m.role}`}
                        className={cn(
                          'flex gap-2.5',
                          m.role === 'user' ? 'justify-end' : 'justify-start',
                        )}
                      >
                        {m.role === 'assistant' && (
                          <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                            <Stethoscope className="h-4 w-4" aria-hidden="true" />
                          </span>
                        )}
                        <div
                          className={cn(
                            'max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                            m.role === 'user'
                              ? 'rounded-tr-sm bg-primary text-primary-foreground'
                              : 'rounded-tl-sm bg-secondary text-foreground',
                          )}
                        >
                          <span className="sr-only">
                            {m.role === 'user'
                              ? `${t.hebamme.userLabel}: `
                              : `${t.hebamme.assistantLabel}: `}
                          </span>
                          {m.content}
                        </div>
                      </li>
                    ))}

                    {loading && (
                      <li className="flex justify-start gap-2.5" aria-live="polite">
                        <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                          <Stethoscope className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="rounded-2xl rounded-tl-sm bg-secondary px-4 py-3 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <span className="sr-only">{t.hebamme.loading}</span>
                            <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
                            <span
                              className="h-2 w-2 animate-pulse rounded-full bg-current"
                              style={{ animationDelay: '150ms' }}
                            />
                            <span
                              className="h-2 w-2 animate-pulse rounded-full bg-current"
                              style={{ animationDelay: '300ms' }}
                            />
                          </span>
                        </div>
                      </li>
                    )}

                    {error && (
                      <li className="flex justify-start" role="alert">
                        <div className="max-w-[80%] rounded-2xl bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
                          {error}
                        </div>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="border-t border-border bg-background px-4 pb-5 pt-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  void handleSend()
                }}
                className="flex items-end gap-2"
              >
                <label htmlFor="hebamme-input" className="sr-only">
                  {t.hebamme.inputPlaceholder}
                </label>
                <Textarea
                  id="hebamme-input"
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t.hebamme.inputPlaceholder}
                  rows={1}
                  className="min-h-[44px] max-h-32 resize-none text-sm"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={loading || input.trim().length === 0}
                  aria-label={t.hebamme.sendAria}
                  className="h-11 w-11 shrink-0"
                >
                  {loading ? (
                    <MessageCircle className="h-4 w-4 animate-pulse" aria-hidden="true" />
                  ) : (
                    <Send className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
              </form>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
