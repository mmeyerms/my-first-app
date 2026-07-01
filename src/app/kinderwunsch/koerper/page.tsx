import Link from 'next/link'
import { redirect } from 'next/navigation'
import { KoerperChecklist } from '@/components/kinderwunsch/KoerperChecklist'
import { createClient } from '@/lib/supabase/server'
import { getServerLocale } from '@/lib/i18n/server'
import { getMessages } from '@/lib/i18n/messages'
import { getServerTheme } from '@/lib/theme/server'

export default async function KinderwunschKoerperPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
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
            {isClassic ? '🌱 ' : ''}{t.kinderwunsch.islands.koerper.title}
          </h1>
          <Link href="/kinderwunsch" className="text-sm text-primary hover:underline shrink-0">
            {t.kinderwunsch.hub.backToGarden}
          </Link>
        </div>
        <KoerperChecklist />
      </div>
    </main>
  )
}
