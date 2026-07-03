import { redirect } from 'next/navigation'
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard'
import { LocaleSelector } from '@/components/i18n/LocaleSelector'
import { Logo } from '@/components/brand/Logo'
import { createClient } from '@/lib/supabase/server'

export default async function OnboardingPage() {
  // If the caller ALREADY has a profile-row (i.e. she is a mother mid-onboarding
  // or already onboarded), let her continue Mama-onboarding — even if she is
  // ALSO a partner elsewhere. Only redirect to /partner/dashboard when this
  // user has NO profile of her own but IS an active partner (i.e. someone who
  // signed up via /partner/accept/[token] and never was a mother).
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  // Ohne Konto kein Onboarding: der Wizard wuerde erst beim Speichern (401)
  // scheitern — schlechte UX nach 3 ausgefuellten Schritten. Registrierung
  // zuerst, danach landet sie automatisch wieder hier.
  if (!user && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    redirect('/register?next=/onboarding')
  }
  if (user) {
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('user_id', user.id)
      .limit(1)
      .single()
    if (!existingProfile) {
      const { data: link } = await supabase
        .from('partner_links')
        .select('id')
        .eq('partner_user_id', user.id)
        .eq('active', true)
        .limit(1)
        .single()
      if (link) redirect('/partner/dashboard')
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute right-4 top-4">
        <LocaleSelector variant="compact" />
      </div>
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <Logo size="md" href="/" />
        </div>
        <div className="card-elevated rounded-2xl bg-card p-8">
          <OnboardingWizard />
        </div>
      </div>
    </main>
  )
}
