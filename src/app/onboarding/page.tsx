import { redirect } from 'next/navigation'
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard'
import { LocaleSelector } from '@/components/i18n/LocaleSelector'
import { Logo } from '@/components/brand/Logo'
import { createClient } from '@/lib/supabase/server'

export default async function OnboardingPage() {
  // If the caller is already linked as a partner (signed up via
  // /partner/accept/[token]), skip Mama-onboarding entirely and send them
  // to their partner dashboard. Prevents creating a stray profiles-row
  // for someone who is not the mother.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: link } = await supabase
      .from('partner_links')
      .select('id')
      .eq('partner_user_id', user.id)
      .eq('active', true)
      .limit(1)
      .single()
    if (link) redirect('/partner/dashboard')
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
