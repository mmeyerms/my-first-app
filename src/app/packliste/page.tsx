import Link from 'next/link'
import { getServerLocale } from '@/lib/i18n/server'
import { getMessages } from '@/lib/i18n/messages'
import { PacklisteView } from '@/components/packliste/PacklisteView'

export default async function PacklistePage() {
  const locale = await getServerLocale()
  const t = getMessages(locale)

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-sm px-4 py-8">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="font-display text-2xl font-medium text-foreground">
            {t.packliste.title}
          </h1>
          <Link
            href="/dashboard"
            className="shrink-0 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            ← {t.nav.dashboard}
          </Link>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">{t.packliste.intro}</p>
        <PacklisteView />
      </div>
    </main>
  )
}
