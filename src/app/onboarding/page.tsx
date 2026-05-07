import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard'
import { LocaleSelector } from '@/components/i18n/LocaleSelector'
import { Logo } from '@/components/brand/Logo'

export default function OnboardingPage() {
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
