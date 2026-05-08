import Link from 'next/link'
import { TeamFragen } from '@/components/kinderwunsch/TeamFragen'
import { getServerLocale } from '@/lib/i18n/server'
import { getMessages } from '@/lib/i18n/messages'
import { getServerTheme } from '@/lib/theme/server'

export default async function KinderwunschTeamPage() {
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
            {isClassic ? '💛 ' : ''}{t.kinderwunsch.islands.team.title}
          </h1>
          <Link href="/kinderwunsch" className="text-sm text-primary hover:underline shrink-0">
            {t.kinderwunsch.hub.backToGarden}
          </Link>
        </div>
        <TeamFragen />
      </div>
    </main>
  )
}
