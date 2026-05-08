import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { calculateSSW } from '@/lib/utils'
import { GeburtsplanView } from '@/components/geburtsplan/GeburtsplanView'
import { getServerLocale } from '@/lib/i18n/server'
import { getMessages } from '@/lib/i18n/messages'

export default async function GeburtsplanPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const t = getMessages(await getServerLocale())

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, baby_name, due_date')
    .eq('user_id', user.id)
    .single()

  if (!profile) redirect('/onboarding')

  const { data: plan } = await supabase
    .from('birth_plans')
    .select('answers')
    .eq('user_id', user.id)
    .single()

  const ssw = calculateSSW(profile.due_date)
  const subtitle = t.geburtsplan.subtitleFor
    .replace('{babyName}', profile.baby_name)
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
          babyName={profile.baby_name}
          dueDate={profile.due_date}
        />
      </div>
    </main>
  )
}
