import { RegisterForm } from '@/components/auth/RegisterForm'
import { LocaleSelector } from '@/components/i18n/LocaleSelector'

export default function RegisterPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-rose-50 p-4">
      <div className="absolute right-4 top-4">
        <LocaleSelector variant="compact" />
      </div>
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-rose-500">🌸 MamaMap</h1>
          <p className="mt-1 text-sm text-gray-500">Deine Begleiterin durch die Schwangerschaft</p>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold text-gray-800">Account erstellen</h2>
          <p className="mb-6 text-sm text-gray-500">Kostenlos starten — in wenigen Sekunden</p>
          <RegisterForm />
        </div>
      </div>
    </main>
  )
}
