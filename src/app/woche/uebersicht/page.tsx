import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getServerLocale } from '@/lib/i18n/server'
import { getMessages } from '@/lib/i18n/messages'
import { SswOverview } from '@/components/ssw/SswOverview'

export default async function SswUebersichtPage() {
  const locale = await getServerLocale()
  const t = getMessages(locale)

  return (
    <main className="min-h-screen bg-background print:bg-white">
      <div className="mx-auto max-w-4xl px-4 py-8 print:max-w-none print:p-0">
        <div className="mb-6 flex items-center justify-between print:hidden">
          <h1 className="font-display text-2xl font-medium text-foreground">
            {t.woche.overviewTitle}
          </h1>
          <Link
            href="/woche"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            <span>{t.common.back}</span>
          </Link>
        </div>
        <SswOverview locale={locale} />
      </div>
    </main>
  )
}
