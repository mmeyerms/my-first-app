import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { calculateSSW } from '@/lib/utils'
import { TagebuchView } from '@/components/tagebuch/TagebuchView'
import Link from 'next/link'
import { getServerLocale } from '@/lib/i18n/server'
import { getMessages } from '@/lib/i18n/messages'

export default async function TagebuchPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const t = getMessages(await getServerLocale())

  const { data: profile } = await supabase
    .from('profiles')
    .select('baby_name, due_date')
    .eq('user_id', user.id)
    .single() as { data: { baby_name: string | null; due_date: string | null } | null }

  if (!profile) redirect('/onboarding')
  // Tagebuch is week-by-week, so due_date is required.
  if (!profile.due_date) redirect('/profil')

  const ssw = calculateSSW(profile.due_date)
  const babyName = profile.baby_name ?? t.partner.fallbackBabyName

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-sm px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-2xl font-medium text-foreground">{t.tagebuch.title}</h1>
          <Link href="/dashboard" className="shrink-0 text-sm text-muted-foreground transition-colors hover:text-primary">{t.common.backToDashboard}</Link>
        </div>
        <TagebuchView ssw={ssw} babyName={babyName} />
      </div>
    </main>
  )
}
