import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard'
import { LocaleSelector } from '@/components/i18n/LocaleSelector'

export default function OnboardingPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-rose-50 p-4">
      <div className="absolute right-4 top-4">
        <LocaleSelector variant="compact" />
      </div>
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-rose-500">🌸 MamaMap</h1>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <OnboardingWizard />
        </div>
      </div>
    </main>
  )
}
