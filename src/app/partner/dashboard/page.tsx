import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { calculateSSW } from '@/lib/utils'
import { getPartnerTipForDay, getPartnerTipText, getPartnerTipLabel } from '@/lib/partnerTips'
import { QUESTIONS, getQuestionLabel } from '@/lib/questions'
import { getServerLocale } from '@/lib/i18n/server'
import { getMessages } from '@/lib/i18n/messages'
import { getPreferences } from '@/lib/preferences/server'
import { getActivePregnancy } from '@/lib/pregnancy/server'
import { Badge } from '@/components/ui/badge'
import { PartnerTodosBlock, type PartnerTodoItem } from '@/components/partner/PartnerTodosBlock'

export default async function PartnerDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const locale = await getServerLocale()
  const t = getMessages(locale)

  const { data: link } = await supabase
    .from('partner_links')
    .select('mother_id')
    .eq('partner_user_id', user.id)
    .eq('active', true)
    .single()

  if (!link) redirect('/dashboard')

  const { data: profile } = (await supabase
    .from('profiles')
    .select('name, baby_name, due_date')
    .eq('user_id', link.mother_id)
    .single()) as {
    data: { name: string; baby_name: string | null; due_date: string | null } | null
  }

  if (!profile) redirect('/dashboard')

  // For the partner dashboard, fall back to a neutral SSW (20) when the mother
  // hasn't entered a due date yet. The view is informational and degrades
  // gracefully without exact SSW data.
  const ssw = profile.due_date ? calculateSSW(profile.due_date) : 20
  const babyName = profile.baby_name ?? t.partner.fallbackBabyName
  const tip = getPartnerTipForDay(ssw)

  // Read mother's personalization to respect visibility settings
  const motherPrefs = await getPreferences(supabase, link.mother_id)
  const partnerLabel = motherPrefs.partnerLabel || 'Partner:in'
  const visibility = motherPrefs.partnerVisibility

  const { data: birthPlan } = await supabase
    .from('birth_plans')
    .select('answers')
    .eq('user_id', link.mother_id)
    .single()

  const answers: Record<string, string | string[]> = birthPlan?.answers ?? {}
  const answeredQuestions = QUESTIONS.filter((q) => {
    const a = answers[q.id]
    return Array.isArray(a) ? a.length > 0 : typeof a === 'string' && a.trim().length > 0
  })

  // Partner-Todos — Aufgaben, die die Mutter der Partner:in zugewiesen hat.
  let partnerTodos: PartnerTodoItem[] = []
  if (visibility.partnerTodos) {
    const activePregnancy = await getActivePregnancy(supabase, link.mother_id)
    let todoQuery = supabase
      .from('partner_todos')
      .select('id, title, description, due_date, done')
      .eq('user_id', link.mother_id)
      .order('done', { ascending: true })
      .order('due_date', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(200)
    if (activePregnancy) todoQuery = todoQuery.eq('pregnancy_id', activePregnancy.id)
    const { data: todoRows } = await todoQuery
    partnerTodos = ((todoRows ?? []) as Array<{
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
    }))
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-sm px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-medium text-primary">{t.partner.dashboardTitle}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {profile.name} &amp; {babyName} · <span className="italic">{partnerLabel}</span>
          </p>
        </div>

        {/* SSW */}
        {visibility.woche && (
          <div className="mb-4 rounded-2xl bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">{t.partner.sswCaption}</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-5xl font-bold text-primary">{t.partner.sswCard.replace('{ssw}', String(ssw))}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{t.partner.babyOnWay.replace('{babyName}', babyName)}</p>
          </div>
        )}

        {/* Daily partner tip — always visible */}
        <div className="mb-4 rounded-2xl bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{t.partner.tipTodayLabel}</p>
            <Badge variant="secondary">{getPartnerTipLabel(tip.type, locale)}</Badge>
          </div>
          <p className="mb-2 text-3xl">{tip.emoji}</p>
          <p className="text-sm leading-relaxed text-foreground">{getPartnerTipText(tip, locale)}</p>
        </div>

        {/* Partner-Todos — konkrete Aufgaben von der Mutter */}
        {visibility.partnerTodos && (
          <PartnerTodosBlock
            initialTodos={partnerTodos}
            heading={`Aufgaben von ${profile.name}`}
            emptyText={`${profile.name} hat dir noch keine Aufgaben zugewiesen.`}
          />
        )}

        {/* Birth plan (read-only) — respect visibility */}
        {visibility.geburtsplan && (
          <div className="rounded-2xl bg-card p-5 shadow-sm">
            <p className="mb-4 text-sm font-semibold text-foreground">{t.partner.birthPlanHeading}</p>
            {answeredQuestions.length > 0 ? (
              <div className="space-y-3">
                {answeredQuestions.map((q) => (
                  <div key={q.id} className="text-sm">
                    <p className="text-xs text-muted-foreground">{getQuestionLabel(q, locale)}</p>
                    <p className="text-foreground">
                      {Array.isArray(answers[q.id])
                        ? (answers[q.id] as string[]).join(', ')
                        : answers[q.id]}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t.partner.birthPlanEmpty.replace('{name}', profile.name)}
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
