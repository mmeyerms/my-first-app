import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { calculateSSW } from '@/lib/utils'
import { getPartnerTipForDay, getPartnerTipText, getPartnerTipLabel } from '@/lib/partnerTips'
import { QUESTIONS, getQuestionLabel } from '@/lib/questions'
import { getServerLocale } from '@/lib/i18n/server'
import { getMessages } from '@/lib/i18n/messages'
import { Badge } from '@/components/ui/badge'

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

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, baby_name, due_date')
    .eq('user_id', link.mother_id)
    .single()

  if (!profile) redirect('/dashboard')

  const ssw = calculateSSW(profile.due_date)
  const tip = getPartnerTipForDay(ssw)

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

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-sm px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-medium text-primary">{t.partner.dashboardTitle}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {profile.name} &amp; {profile.baby_name}
          </p>
        </div>

        {/* SSW */}
        <div className="mb-4 rounded-2xl bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">{t.partner.sswCaption}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-5xl font-bold text-primary">{t.partner.sswCard.replace('{ssw}', String(ssw))}</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{t.partner.babyOnWay.replace('{babyName}', profile.baby_name)}</p>
        </div>

        {/* Daily partner tip */}
        <div className="mb-4 rounded-2xl bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{t.partner.tipTodayLabel}</p>
            <Badge variant="secondary">{getPartnerTipLabel(tip.type, locale)}</Badge>
          </div>
          <p className="mb-2 text-3xl">{tip.emoji}</p>
          <p className="text-sm leading-relaxed text-foreground">{getPartnerTipText(tip, locale)}</p>
        </div>

        {/* Birth plan (read-only) */}
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
      </div>
    </main>
  )
}
