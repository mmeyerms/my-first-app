import Link from 'next/link'
import { HelferView } from '@/components/helfen/HelferView'
import { getServerLocale } from '@/lib/i18n/server'
import { getMessages } from '@/lib/i18n/messages'

export default async function HelfenPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const locale = await getServerLocale()
  const t = getMessages(locale)

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-md px-4 py-10">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-block font-display text-xl font-medium text-primary"
          >
            Mama<span className="text-accent">·</span>Map
          </Link>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {t.helfen.pageTitle}
          </p>
        </div>
        <HelferView token={token} />
      </div>
    </main>
  )
}
