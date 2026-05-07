import { RegisterForm } from '@/components/auth/RegisterForm'
import { LocaleSelector } from '@/components/i18n/LocaleSelector'
import { Logo } from '@/components/brand/Logo'

export default function RegisterPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute right-4 top-4">
        <LocaleSelector variant="compact" />
      </div>
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Logo size="lg" href="/" />
          <p className="mt-2 font-display text-sm italic text-muted-foreground">
            Deine Begleiterin durch die Schwangerschaft
          </p>
        </div>
        <div className="card-elevated rounded-2xl bg-card p-8">
          <h2 className="mb-2 font-display text-2xl font-medium text-foreground">
            Account erstellen
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Kostenlos starten — in wenigen Sekunden
          </p>
          <RegisterForm />
        </div>
      </div>
    </main>
  )
}
