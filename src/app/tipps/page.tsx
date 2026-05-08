import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { calculateSSW } from '@/lib/utils'
import { getTipForDay, getTipText, getTipDetail, getCategoryLabel } from '@/lib/tips'
import { getServerLocale } from '@/lib/i18n/server'
import { getMessages } from '@/lib/i18n/messages'
import { Badge } from '@/components/ui/badge'

export default async function TippsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const locale = await getServerLocale()
  const t = getMessages(locale)

  const { data: profile } = await supabase
    .from('profiles')
    .select('due_date')
    .eq('user_id', user.id)
    .single()

  if (!profile) redirect('/onboarding')

  const ssw = calculateSSW(profile.due_date)
  const tip = getTipForDay(ssw)
  const categoryLabel = getCategoryLabel(tip.category, locale)
  const dateLocale = locale === 'de' ? 'de-DE' : 'en-GB'

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-sm px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-primary">
            {t.common.backToDashboard}
          </Link>
        </div>
        <h1 className="mb-8 font-display text-3xl font-medium text-foreground">{t.tipps.todayTitle}</h1>

        <div className="card-elevated overflow-hidden rounded-2xl">
          <div className="bg-primary px-6 py-5 text-primary-foreground">
            <p className="mb-1 font-display text-[10px] uppercase tracking-[0.2em] text-primary-foreground/75">
              {t.tipps.dailyPopup.ssw.replace('{ssw}', String(ssw))} · {new Date().toLocaleDateString(dateLocale, { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <p className="font-display text-2xl font-medium">{tip.emoji} {categoryLabel}</p>
          </div>
          <div className="bg-card px-6 py-5">
            <p className="text-sm leading-relaxed text-foreground">{getTipText(tip, locale)}</p>
            {tip.detail && (
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{getTipDetail(tip, locale)}</p>
            )}
            <div className="mt-4">
              <Badge variant="secondary" className="text-xs">{categoryLabel}</Badge>
            </div>
          </div>
        </div>

        <div className="card-elevated mt-6 rounded-xl bg-card p-4">
          <p className="text-center font-display text-xs italic text-muted-foreground">
            {t.tipps.footnote}
          </p>
        </div>
      </div>
    </main>
  )
}
