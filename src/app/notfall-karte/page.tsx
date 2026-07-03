import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { calculateSSW } from '@/lib/utils'
import { getServerLocale } from '@/lib/i18n/server'
import { getMessages } from '@/lib/i18n/messages'
import { getActivePregnancy } from '@/lib/pregnancy/server'
import { NotfallKarteView } from '@/components/notfall/NotfallKarteView'

/**
 * PROJ-13 Notfall-Karte — lock-screen image + wallet PDF with all
 * emergency-relevant data. Works without a due date too (fields render
 * with a dash); pregnancy data enriches the card when present.
 */
export default async function NotfallKartePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = (await supabase
    .from('profiles')
    .select('name')
    .eq('user_id', user.id)
    .single()) as { data: { name: string } | null }
  if (!profile) redirect('/onboarding')

  const active = await getActivePregnancy(supabase, user.id)
  const dueDate = active?.due_date ?? null
  const ssw = dueDate ? calculateSSW(dueDate) : null

  const locale = await getServerLocale()
  const t = getMessages(locale)

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-8">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary print:hidden"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          <span>{t.notfallKarte.back}</span>
        </Link>
        <header className="mb-6 print:hidden">
          <h1 className="font-display text-3xl font-medium text-foreground">
            {t.notfallKarte.title}
          </h1>
          <p className="mt-2 font-display text-sm italic text-muted-foreground">
            {t.notfallKarte.intro}
          </p>
        </header>
        <NotfallKarteView motherName={profile.name} dueDate={dueDate} ssw={ssw} />
      </div>
    </main>
  )
}
