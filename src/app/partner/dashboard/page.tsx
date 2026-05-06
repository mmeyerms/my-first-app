import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { calculateSSW } from '@/lib/utils'
import { getPartnerTipForDay, PARTNER_TIP_LABELS } from '@/lib/partnerTips'
import { QUESTIONS } from '@/lib/questions'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function PartnerDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

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
    <main className="min-h-screen bg-blue-50">
      <div className="mx-auto max-w-sm px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-blue-600">💑 Partner-Bereich</h1>
          <p className="mt-1 text-sm text-gray-500">
            {profile.name} &amp; {profile.baby_name}
          </p>
        </div>

        {/* SSW */}
        <div className="mb-4 rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Aktuelle Schwangerschaftswoche</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-5xl font-bold text-blue-500">SSW {ssw}</span>
          </div>
          <p className="mt-1 text-sm text-gray-500">{profile.baby_name} ist auf dem Weg 💛</p>
        </div>

        {/* Daily partner tip */}
        <div className="mb-4 rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Dein Tipp für heute</p>
            <Badge variant="secondary">{PARTNER_TIP_LABELS[tip.type]}</Badge>
          </div>
          <p className="mb-2 text-3xl">{tip.emoji}</p>
          <p className="text-sm leading-relaxed text-gray-700">{tip.text}</p>
        </div>

        {/* Birth plan (read-only) */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="mb-4 text-sm font-semibold text-gray-700">📋 Geburtsplan</p>
          {answeredQuestions.length > 0 ? (
            <div className="space-y-3">
              {answeredQuestions.map((q) => (
                <div key={q.id} className="text-sm">
                  <p className="text-xs text-gray-400">{q.label}</p>
                  <p className="text-gray-800">
                    {Array.isArray(answers[q.id])
                      ? (answers[q.id] as string[]).join(', ')
                      : answers[q.id]}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">
              Der Geburtsplan wird hier angezeigt, sobald {profile.name} ihn ausfüllt.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
