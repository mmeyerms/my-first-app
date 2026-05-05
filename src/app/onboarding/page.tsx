import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard'

export default function OnboardingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-rose-50 p-4">
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
