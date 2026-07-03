import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getServerLocale } from '@/lib/i18n/server'
import { getMessages } from '@/lib/i18n/messages'
import { TrackerView } from '@/components/tracker/TrackerView'

/**
 * PROJ-15 — Kick-Counter + Symptom-/Gewichtstagebuch ("Mein Tag").
 */
export default async function TrackerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('user_id', user.id)
    .single()
  if (!profile) redirect('/onboarding')

  const locale = await getServerLocale()
  const t = getMessages(locale)

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-sm px-4 py-8">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          <span>{t.tracker.back}</span>
        </Link>
        <header className="mb-6">
          <h1 className="font-display text-3xl font-medium text-foreground">{t.tracker.title}</h1>
          <p className="mt-2 font-display text-sm italic text-muted-foreground">{t.tracker.intro}</p>
        </header>
        <TrackerView />
      </div>
    </main>
  )
}
