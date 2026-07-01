'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { PartnerTodosBlock, type PartnerTodoItem } from '@/components/partner/PartnerTodosBlock'
import { RealtimeIndicator, type RealtimeStatus } from '@/components/partner/RealtimeIndicator'
import { QUESTIONS, getQuestionLabel, type Question } from '@/lib/questions'
import { getPartnerTipText, getPartnerTipLabel, type PartnerTip } from '@/lib/partnerTips'
import type { Locale } from '@/lib/i18n/types'
import type { Messages } from '@/lib/i18n/messages'

/** Snapshot of the mother's partner-visibility flags, as fetched on the server. */
interface Visibility {
  partnerTodos: boolean
  termine: boolean
  tagebuch: boolean
  geburtsplan: boolean
  woche: boolean
  wochenbett: boolean
}

interface PartnerDashboardClientProps {
  /** IDs used for realtime channel scoping. */
  motherId: string
  pregnancyId: string | null

  /** Static server-fetched data. */
  motherName: string
  babyName: string
  partnerLabel: string
  ssw: number
  tip: PartnerTip
  locale: Locale
  messages: Messages
  visibility: Visibility

  /** Initial hydrated data — mutated by realtime events. */
  initialAnswers: Record<string, string | string[]>
  initialTodos: PartnerTodoItem[]
}

/**
 * PartnerDashboardClient (Feature 49 — Live-Sync Partner)
 *
 * Server component fetches the initial snapshot; this client subscribes to
 * Supabase Realtime and applies deltas as they land (~1s latency). The channel
 * is scoped per mother: `partner-live-{motherId}`.
 *
 * Tables watched (all gated by RLS on the mother's `partnerVisibility` flags):
 *   - partner_todos      INSERT | UPDATE | DELETE
 *   - birth_plans        UPDATE
 *   - termine            INSERT | UPDATE | DELETE   (visibility.termine)
 *   - diary_entries      INSERT | UPDATE | DELETE   (visibility.tagebuch)
 *
 * A small pulsing indicator in the header shows the connection state.
 */
export function PartnerDashboardClient({
  motherId,
  pregnancyId,
  motherName,
  babyName,
  partnerLabel,
  ssw,
  tip,
  locale,
  messages: t,
  visibility,
  initialAnswers,
  initialTodos,
}: PartnerDashboardClientProps) {
  const supabase = useMemo(() => createClient(), [])
  const [status, setStatus] = useState<RealtimeStatus>('connecting')
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(initialAnswers)
  const [todos, setTodos] = useState<PartnerTodoItem[]>(initialTodos)
  const channelRef = useRef<RealtimeChannel | null>(null)

  /** Sort todos identically to the server (done last, due_date asc, newest first). */
  const sortTodos = useCallback((list: PartnerTodoItem[]): PartnerTodoItem[] => {
    return [...list].sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1
      if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate)
      if (a.dueDate) return -1
      if (b.dueDate) return 1
      return b.id.localeCompare(a.id) // rough proxy for created_at
    })
  }, [])

  // Refetch todos when a change lands — simpler and safer than merging deltas
  // by hand (RLS filters rows the partner shouldn't see, so we always land in
  // a consistent state after a refetch).
  const refetchTodos = useCallback(async () => {
    if (!visibility.partnerTodos) return
    // Types for the browser Supabase client are `never` in mock mode.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q: any = (supabase as any)
      .from('partner_todos')
      .select('id, title, description, due_date, done, pregnancy_id')
      .eq('user_id', motherId)
      .order('done', { ascending: true })
      .order('due_date', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(200)
    if (pregnancyId) q = q.eq('pregnancy_id', pregnancyId)
    const { data, error } = await q
    if (error || !data) return
    setTodos(
      sortTodos(
        (data as Array<{
          id: string
          title: string
          description: string | null
          due_date: string | null
          done: boolean
        }>).map((r) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          dueDate: r.due_date,
          done: r.done,
        })),
      ),
    )
  }, [supabase, motherId, pregnancyId, visibility.partnerTodos, sortTodos])

  const refetchBirthPlan = useCallback(async () => {
    if (!visibility.geburtsplan) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from('birth_plans')
      .select('answers')
      .eq('user_id', motherId)
      .single()
    if (data?.answers) {
      setAnswers(data.answers as Record<string, string | string[]>)
    }
  }, [supabase, motherId, visibility.geburtsplan])

  // Subscribe to postgres_changes once per (motherId, pregnancyId).
  useEffect(() => {
    // Mock-mode client has no channel method — bail silently.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof (supabase as any).channel !== 'function') {
      setStatus('offline')
      return
    }

    setStatus('connecting')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const channel: RealtimeChannel = (supabase as any).channel(`partner-live-${motherId}`)

    if (visibility.partnerTodos) {
      channel.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'partner_todos',
          filter: `user_id=eq.${motherId}`,
        },
        () => {
          void refetchTodos()
        },
      )
    }

    if (visibility.geburtsplan) {
      channel.on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'birth_plans',
          filter: `user_id=eq.${motherId}`,
        },
        () => {
          void refetchBirthPlan()
        },
      )
    }

    if (visibility.termine) {
      channel.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'termine',
          filter: `user_id=eq.${motherId}`,
        },
        () => {
          // Termine are not yet rendered here (server component doesn't hydrate
          // them), but the subscription is wired for future termine section.
          // A dispatch hook could be added later; for now we still receive so
          // the connection stays live and the indicator remains accurate.
        },
      )
    }

    if (visibility.tagebuch) {
      channel.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'diary_entries',
          filter: `user_id=eq.${motherId}`,
        },
        () => {
          // Diary is not shown on the partner dashboard yet — subscription
          // reserved for the future tagebuch block.
        },
      )
    }

    channel.subscribe((state) => {
      if (state === 'SUBSCRIBED') setStatus('live')
      else if (state === 'CHANNEL_ERROR' || state === 'TIMED_OUT') setStatus('offline')
      else if (state === 'CLOSED') setStatus('offline')
      else setStatus('connecting')
    })

    channelRef.current = channel

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      void (supabase as any).removeChannel(channel)
      channelRef.current = null
    }
  }, [
    supabase,
    motherId,
    visibility.partnerTodos,
    visibility.geburtsplan,
    visibility.termine,
    visibility.tagebuch,
    refetchTodos,
    refetchBirthPlan,
  ])

  // Handle local optimistic toggles from PartnerTodosBlock so the state stays
  // in sync when a realtime UPDATE echoes back moments later.
  const handleLocalToggle = useCallback((id: string, done: boolean) => {
    setTodos((prev) => prev.map((td) => (td.id === id ? { ...td, done } : td)))
  }, [])

  const answeredQuestions: Question[] = QUESTIONS.filter((q) => {
    const a = answers[q.id]
    return Array.isArray(a) ? a.length > 0 : typeof a === 'string' && a.trim().length > 0
  })

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-sm px-4 py-8">
        {/* Header with live indicator */}
        <div className="mb-8 flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-medium text-primary">
              {t.partner.dashboardTitle}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {motherName} &amp; {babyName} · <span className="italic">{partnerLabel}</span>
            </p>
          </div>
          <RealtimeIndicator status={status} className="mt-1 shrink-0" />
        </div>

        {/* SSW */}
        {visibility.woche && (
          <div className="mb-4 rounded-2xl bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">{t.partner.sswCaption}</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-5xl font-bold text-primary">
                {t.partner.sswCard.replace('{ssw}', String(ssw))}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.partner.babyOnWay.replace('{babyName}', babyName)}
            </p>
          </div>
        )}

        {/* Daily partner tip — always visible */}
        <div className="mb-4 rounded-2xl bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{t.partner.tipTodayLabel}</p>
            <Badge variant="secondary">{getPartnerTipLabel(tip.type, locale)}</Badge>
          </div>
          <p className="mb-2 text-3xl">{tip.emoji}</p>
          <p className="text-sm leading-relaxed text-foreground">
            {getPartnerTipText(tip, locale)}
          </p>
        </div>

        {/* Partner-Todos — live-synced from mother's changes */}
        {visibility.partnerTodos && (
          <PartnerTodosBlock
            initialTodos={initialTodos}
            externalTodos={todos}
            onLocalToggle={handleLocalToggle}
            heading={`Aufgaben von ${motherName}`}
            emptyText={`${motherName} hat dir noch keine Aufgaben zugewiesen.`}
          />
        )}

        {/* Birth plan (read-only) — respect visibility */}
        {visibility.geburtsplan && (
          <div className="rounded-2xl bg-card p-5 shadow-sm">
            <p className="mb-4 text-sm font-semibold text-foreground">
              {t.partner.birthPlanHeading}
            </p>
            {answeredQuestions.length > 0 ? (
              <div className="space-y-3">
                {answeredQuestions.map((q) => (
                  <div key={q.id} className="text-sm">
                    <p className="text-xs text-muted-foreground">
                      {getQuestionLabel(q, locale)}
                    </p>
                    <p className="text-foreground">
                      {Array.isArray(answers[q.id])
                        ? (answers[q.id] as string[]).join(', ')
                        : (answers[q.id] as string)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t.partner.birthPlanEmpty.replace('{name}', motherName)}
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
