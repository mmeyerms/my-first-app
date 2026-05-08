import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ProfilForm } from '@/components/profil/ProfilForm'
import { LocaleSection } from '@/components/profil/LocaleSection'
import { ThemeSection } from '@/components/profil/ThemeSection'
import { getServerLocale } from '@/lib/i18n/server'
import { getMessages } from '@/lib/i18n/messages'

export default async function ProfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const t = getMessages(await getServerLocale())

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, baby_name, positive_test_date, due_date')
    .eq('user_id', user.id)
    .single()

  if (!profile) redirect('/onboarding')

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-sm px-4 py-8">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            {t.nav.dashboard}
          </Link>
        </div>
        <h1 className="mb-2 font-display text-3xl font-medium text-foreground">
          {t.profile.title}
        </h1>
        <p className="mb-8 font-display text-sm italic text-muted-foreground">
          {t.profile.subtitle}
        </p>
        <div className="space-y-6">
          <div className="card-elevated rounded-2xl bg-card p-6">
            <ProfilForm profile={profile} />
          </div>
          <div className="card-elevated rounded-2xl bg-card p-6">
            <LocaleSection />
          </div>
          <div className="card-elevated rounded-2xl bg-card p-6">
            <ThemeSection />
          </div>
        </div>
      </div>
    </main>
  )
}
