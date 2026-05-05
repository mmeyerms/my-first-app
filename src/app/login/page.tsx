import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-rose-50 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-rose-500">🌸 MamaMap</h1>
          <p className="mt-1 text-sm text-gray-500">Deine Begleiterin durch die Schwangerschaft</p>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-gray-800">Willkommen zurück</h2>
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
