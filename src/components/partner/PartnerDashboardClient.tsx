'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { PartnerTodosBlock, type PartnerTodoItem } from '@/components/partner/PartnerTodosBlock'
import { PartnerPreparationBlock } from '@/components/partner/PartnerPreparationBlock'
import { RealtimeIndicator, type RealtimeStatus } from '@/components/partner/RealtimeIndicator'
import { QUESTIONS, getQuestionLabel, type Question } from '@/lib/questions'
import { getPartnerTipText, getPartnerTipLabel, type PartnerTip } from '@/lib/partnerTips'
import type { PreparationTask } from '@/lib/partnerPreparation'
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

    // Watch for partner_link deactivation — if the mother unlinks us, redirect
    // to the caller's own dashboard instead of leaving a stale open channel.
    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'partner_links',
        filter: `mother_id=eq.${motherId}`,
      },
      (payload: { new?: { active?: boolean } }) => {
        if (payload?.new?.active === false && typeof window !== 'undefined') {
          window.location.href = '/dashboard'
        }
      },
    )

    // Watch for visibility-flag changes by the mother. When she toggles
    // partnerVisibility.termine/tagebuch/etc., we tear down the channel and
    // let the useEffect re-run with the new visibility (RLS would then
    // reject any lingering subscriptions anyway).
    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'user_preferences',
        filter: `user_id=eq.${motherId}`,
      },
      () => {
        if (typeof window !== 'undefined') {
          window.location.reload()
        }
      },
    )

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

  // Adopt a preparation task — POST it as a new partner_todo. The mother
  // then sees it in her Einstellungen → Partner-Todos panel too.
  const adoptPreparation = useCallback(async (task: PreparationTask) => {
    const res = await fetch('/api/partner-todos', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: task.title,
        description: task.description,
      }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(typeof err.error === 'string' ? err.error : 'Konnte nicht angelegt werden')
    }
    const created = await res.json()
    setTodos((prev) => [
      {
        id: created.id,
        title: created.title,
        description: created.description,
        dueDate: created.dueDate ?? null,
        done: false,
      },
      ...prev,
    ])
  }, [])

  const existingTodoTitles = useMemo(
    () => new Set(todos.map((t) => t.title)),
    [todos],
  )

  const answeredQuestions: Question[] = QUESTIONS.filter((q) => {
    const a = answers[q.id]
    return Array.isArray(a) ? a.length > 0 : typeof a === 'string' && a.trim().length > 0
  })

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-sm space-y-6 px-4 py-8">
        {/* ─────────────  HEADER  ───────────── */}
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {t.partner.dashboardTitle}
            </p>
            <h1 className="mt-1 font-display text-2xl font-medium leading-tight text-foreground">
              {partnerLabel} von {babyName}
            </h1>
            <p className="mt-0.5 font-display text-sm italic text-muted-foreground">
              An der Seite von {motherName}
            </p>
          </div>
          <RealtimeIndicator status={status} className="mt-1 shrink-0" />
        </header>

        {/* ─────────────  1. HEUTE  ─────────────
            Hero-Impuls: prominent, groß, mit klarer CTA-Logik. */}
        <section
          aria-label="Impuls für heute"
          className="card-elevated rounded-2xl bg-card p-6"
          style={{ backgroundImage: 'linear-gradient(180deg, hsl(var(--secondary)/0.55) 0%, hsl(var(--card)) 100%)' }}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              Heute
            </span>
            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
              {getPartnerTipLabel(tip.type, locale)}
            </Badge>
          </div>
          <p aria-hidden="true" className="mb-3 text-5xl leading-none">{tip.emoji}</p>
          <p className="font-display text-lg leading-snug text-foreground">
            {getPartnerTipText(tip, locale)}
          </p>
          <p className="mt-4 text-[10px] italic text-muted-foreground">
            Ein Impuls pro Tag. Kein Muss — nur ein Anstupser.
          </p>
        </section>

        {/* ─────────────  2. DEINE MAMA DIESE WOCHE  ─────────────
            SSW-Kontext + Baby-Update, gated by visibility.woche. */}
        {visibility.woche && (
          <section aria-label={motherName + ' diese Woche'}>
            <h2 className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {motherName} diese Woche
            </h2>
            <div className="card-elevated rounded-2xl bg-card p-5">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-4xl font-medium text-primary">
                  SSW {ssw}
                </span>
                <span className="font-display text-sm italic text-muted-foreground">
                  · noch {Math.max(0, 40 - ssw)} Wochen
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                {t.partner.babyOnWay.replace('{babyName}', babyName)}
              </p>
            </div>
          </section>
        )}

        {/* ─────────────  3. DEINE AUFGABEN  ─────────────
            Konkrete Aufgaben von {motherName} (live-synced) + Kurator-Bibliothek
            zum Selbstübernehmen, sortiert nach Fälligkeit. */}
        <section aria-label="Deine Aufgaben" className="space-y-4">
          <h2 className="px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Deine Aufgaben
          </h2>

          {visibility.partnerTodos && (
            <PartnerTodosBlock
              initialTodos={initialTodos}
              externalTodos={todos}
              onLocalToggle={handleLocalToggle}
              heading={`Von ${motherName} für dich`}
              emptyText={`${motherName} hat dir noch keine Aufgaben zugewiesen. Übernimm gerne selbst welche aus der Vorbereitungs-Liste unten.`}
            />
          )}

          <PartnerPreparationBlock
            ssw={ssw}
            existingTodoTitles={existingTodoTitles}
            onAdopt={adoptPreparation}
          />
        </section>

        {/* ─────────────  4. GEBURTSPLAN  ─────────────
            Nur wenn die Mutter das teilt — sonst nicht anzeigen. */}
        {visibility.geburtsplan && (
          <section aria-label={t.partner.birthPlanHeading}>
            <h2 className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {t.partner.birthPlanHeading}
            </h2>
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
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
          </section>
        )}
      </div>
    </main>
  )
}
