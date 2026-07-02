import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { calculateSSW } from '@/lib/utils'
import { GeburtsplanView } from '@/components/geburtsplan/GeburtsplanView'
import { getServerLocale } from '@/lib/i18n/server'
import { getMessages } from '@/lib/i18n/messages'
import { getActivePregnancy } from '@/lib/pregnancy/server'
import { NeedsDueDateNotice } from '@/components/shared/NeedsDueDateNotice'

export default async function GeburtsplanPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const t = getMessages(await getServerLocale())

  const { data: profile } = (await supabase
    .from('profiles')
    .select('name, baby_name')
    .eq('user_id', user.id)
    .single()) as {
    data: { name: string; baby_name: string | null } | null
  }

  if (!profile) redirect('/onboarding')

  // Active pregnancy is source of truth (profile.due_date is legacy).
  const active = await getActivePregnancy(supabase, user.id)
  const dueDate = active?.due_date ?? null
  if (!dueDate) {
    return <NeedsDueDateNotice sectionKey="geburtsplan" status={active?.status ?? null} />
  }

  // Prefer pregnancy-scoped plan; fall back to legacy user-scoped row.
  let planQuery = supabase.from('birth_plans').select('answers').eq('user_id', user.id)
  if (active) planQuery = planQuery.eq('pregnancy_id', active.id)
  const { data: plan } = await planQuery.limit(1).single()

  const ssw = calculateSSW(dueDate)
  const babyName = active?.baby_name ?? profile.baby_name ?? t.partner.fallbackBabyName
  const subtitle = t.geburtsplan.subtitleFor
    .replace('{babyName}', babyName)
    .replace('{ssw}', String(ssw))

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-primary">
            {t.common.backToDashboard}
          </Link>
        </div>
        <div className="mb-8">
          <h1 className="font-display text-3xl font-medium text-foreground">{t.geburtsplan.title}</h1>
          <p className="mt-2 font-display text-sm italic text-muted-foreground">
            {subtitle}
          </p>
        </div>
        <GeburtsplanView
          initialAnswers={(plan?.answers as Record<string, unknown>) ?? {}}
          ssw={ssw}
          babyName={babyName}
          dueDate={dueDate}
        />
      </div>
    </main>
  )
}
