import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { calculateSSW } from '@/lib/utils'
import { getPartnerTipForDay } from '@/lib/partnerTips'
import { getServerLocale } from '@/lib/i18n/server'
import { getMessages } from '@/lib/i18n/messages'
import { getPreferences } from '@/lib/preferences/server'
import { getActivePregnancy } from '@/lib/pregnancy/server'
import { PartnerDashboardClient } from '@/components/partner/PartnerDashboardClient'
import type { PartnerTodoItem } from '@/components/partner/PartnerTodosBlock'

/**
 * Partner Dashboard — thin server shell.
 *
 * Fetches the initial snapshot (profile, active pregnancy, birth plan, partner
 * todos, visibility flags) and hands it off to `PartnerDashboardClient`, which
 * subscribes to Supabase Realtime (Feature 49) and re-renders as the mother
 * updates data in real time.
 */
export default async function PartnerDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const locale = await getServerLocale()
  const messages = getMessages(locale)

  const { data: link } = await supabase
    .from('partner_links')
    .select('mother_id, role, display_name')
    .eq('partner_user_id', user.id)
    .eq('active', true)
    .single()

  if (!link) redirect('/dashboard')

  const partnerRole = (link as { role: string | null }).role
  const partnerDisplayName = (link as { display_name: string | null }).display_name

  const { data: profile } = (await supabase
    .from('profiles')
    .select('name, baby_name')
    .eq('user_id', link.mother_id)
    .single()) as {
    data: { name: string; baby_name: string | null } | null
  }

  if (!profile) redirect('/dashboard')

  // Active pregnancy is source of truth (profile.due_date is legacy).
  // For the partner dashboard, fall back to a neutral SSW (20) when the mother
  // hasn't entered a due date yet. The view is informational and degrades
  // gracefully without exact SSW data.
  const motherActivePregnancy = await getActivePregnancy(supabase, link.mother_id)
  const dueDate = motherActivePregnancy?.due_date ?? null
  const ssw = dueDate ? calculateSSW(dueDate) : 20
  const babyName =
    motherActivePregnancy?.baby_name ?? profile.baby_name ?? messages.partner.fallbackBabyName
  const tip = getPartnerTipForDay(ssw)

  // Read mother's personalization to respect visibility settings.
  const motherPrefs = await getPreferences(supabase, link.mother_id)
  const visibility = motherPrefs.partnerVisibility

  // Prefer the display_name the partner chose during accept-flow.
  // Fall back to mother's global partnerLabel (legacy) or a neutral default.
  const ROLE_LABEL_DE: Record<string, string> = {
    papa: 'Papa', mama: 'Mama', oma: 'Oma', opa: 'Opa', bestie: 'Bestie', andere: 'Partner:in',
  }
  const roleLabel = partnerRole ? ROLE_LABEL_DE[partnerRole] ?? 'Partner:in' : (motherPrefs.partnerLabel || 'Partner:in')
  const partnerLabel = partnerDisplayName?.trim()
    ? `${roleLabel} ${partnerDisplayName.trim()}`
    : roleLabel

  const { data: birthPlan } = await supabase
    .from('birth_plans')
    .select('answers')
    .eq('user_id', link.mother_id)
    .single()

  const initialAnswers: Record<string, string | string[]> = birthPlan?.answers ?? {}

  // Partner-Todos — Aufgaben, die die Mutter der Partner:in zugewiesen hat.
  let initialTodos: PartnerTodoItem[] = []
  if (visibility.partnerTodos) {
    let todoQuery = supabase
      .from('partner_todos')
      .select('id, title, description, due_date, done')
      .eq('user_id', link.mother_id)
      .order('done', { ascending: true })
      .order('due_date', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(200)
    if (motherActivePregnancy) todoQuery = todoQuery.eq('pregnancy_id', motherActivePregnancy.id)
    const { data: todoRows } = await todoQuery
    initialTodos = ((todoRows ?? []) as Array<{
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
    <PartnerDashboardClient
      motherId={link.mother_id}
      pregnancyId={motherActivePregnancy?.id ?? null}
      motherName={profile.name}
      babyName={babyName}
      partnerLabel={partnerLabel}
      partnerRole={
        partnerRole === 'papa' || partnerRole === 'mama' || partnerRole === 'oma' ||
        partnerRole === 'opa' || partnerRole === 'bestie' || partnerRole === 'andere'
          ? partnerRole
          : null
      }
      ssw={ssw}
      tip={tip}
      locale={locale}
      messages={messages}
      visibility={visibility}
      initialAnswers={initialAnswers}
      initialTodos={initialTodos}
    />
  )
}
