import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getPreferences } from '@/lib/preferences/server'
import { getActivePregnancy } from '@/lib/pregnancy/server'
import { getServerLocale } from '@/lib/i18n/server'
import { getMessages } from '@/lib/i18n/messages'
import { EinstellungenTabs } from '@/components/einstellungen/EinstellungenTabs'

export default async function EinstellungenPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [prefs, active] = await Promise.all([
    getPreferences(supabase, user.id),
    getActivePregnancy(supabase, user.id),
  ])

  const locale = await getServerLocale()
  const t = getMessages(locale)
  const p = t.settings.page

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          <span>{p.back}</span>
        </Link>
        <header className="mb-6">
          <h1 className="font-display text-3xl font-medium text-foreground">
            {p.title}
          </h1>
          <p className="mt-2 font-display text-sm italic text-muted-foreground">
            {p.subtitle}
          </p>
        </header>
        <EinstellungenTabs initialPrefs={prefs} pregnancyMode={active?.status ?? null} />
      </div>
    </main>
  )
}
