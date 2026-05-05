import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-rose-50 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-rose-500">🌸 MamaMap</h1>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-gray-800">Passwort vergessen</h2>
          <ForgotPasswordForm />
        </div>
      </div>
    </main>
  )
}
