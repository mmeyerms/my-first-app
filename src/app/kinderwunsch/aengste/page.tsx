import { AengsteView } from '@/components/kinderwunsch/AengsteView'
import Link from 'next/link'
import { getServerLocale } from '@/lib/i18n/server'
import { getMessages } from '@/lib/i18n/messages'
import { getServerTheme } from '@/lib/theme/server'

export default async function AengstePage() {
  const t = getMessages(await getServerLocale())
  const theme = await getServerTheme()
  const isClassic = theme === 'classic'
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-sm px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1
            className={
              isClassic
                ? 'text-xl font-bold text-foreground'
                : 'font-display text-2xl font-medium text-foreground'
            }
          >
            {isClassic ? '🤔 ' : ''}{t.kinderwunsch.islands.aengste.title}
          </h1>
          <Link href="/kinderwunsch" className="text-sm text-primary hover:underline">{t.kinderwunsch.hub.backToGarden}</Link>
        </div>
        <AengsteView />
      </div>
    </main>
  )
}
