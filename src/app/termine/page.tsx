import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { calculateSSW } from '@/lib/utils'
import { getServerLocale } from '@/lib/i18n/server'
import { getMessages } from '@/lib/i18n/messages'
import { getActivePregnancy } from '@/lib/pregnancy/server'
import { TermineView } from '@/components/termine/TermineView'

export default async function TerminePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('user_id', user.id)
    .single()
  if (!profile) redirect('/onboarding')

  // Use active pregnancy as source of truth (profile.due_date is legacy).
  const active = await getActivePregnancy(supabase, user.id)
  const dueDate = active?.due_date ?? null
  if (!dueDate) redirect('/profil')

  const ssw = calculateSSW(dueDate)
  const locale = await getServerLocale()
  const t = getMessages(locale)

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-sm px-4 py-8">
        <div className="mb-2 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="shrink-0 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            {t.common.backToDashboard}
          </Link>
        </div>
        <header className="mb-6">
          <h1 className="font-display text-2xl font-medium text-foreground">{t.termine.title}</h1>
          <p className="mt-2 font-display text-sm italic text-muted-foreground">
            {t.termine.intro}
          </p>
        </header>
        <TermineView ssw={ssw} />
      </div>
    </main>
  )
}
