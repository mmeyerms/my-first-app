import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getServerLocale } from '@/lib/i18n/server'
import { getMessages } from '@/lib/i18n/messages'
import { WochenbettTabs } from '@/components/wochenbett/WochenbettTabs'
import { SituationNotes } from '@/components/situation/SituationNotes'

interface PageProps {
  searchParams: Promise<{ tab?: string }>
}

export default async function WochenbettPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const locale = await getServerLocale()
  const t = getMessages(locale)
  const params = await searchParams
  const initialTab = params?.tab === 'chef' ? 'chef' : 'liste'

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-sm px-4 py-8">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="font-display text-2xl font-medium text-foreground">
            {t.wochenbett.title}
          </h1>
          <Link
            href="/dashboard"
            className="shrink-0 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            ← {t.nav.dashboard}
          </Link>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">{t.wochenbett.intro}</p>
        <SituationNotes context="wochenbett" />
        <WochenbettTabs initialTab={initialTab} />
      </div>
    </main>
  )
}
