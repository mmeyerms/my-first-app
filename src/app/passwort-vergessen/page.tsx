import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { Logo } from '@/components/brand/Logo'

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Logo size="lg" href="/" />
        </div>
        <div className="card-elevated rounded-2xl bg-card p-8">
          <h2 className="mb-6 font-display text-2xl font-medium text-foreground">
            Passwort vergessen
          </h2>
          <ForgotPasswordForm />
        </div>
      </div>
    </main>
  )
}
