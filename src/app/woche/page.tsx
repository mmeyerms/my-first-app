import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { calculateSSW } from '@/lib/utils'
import { getServerLocale } from '@/lib/i18n/server'
import { getMessages } from '@/lib/i18n/messages'
import { getServerTheme } from '@/lib/theme/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  getSswInfo,
  formatSize,
  formatWeight,
  type SswComparisonCategory,
} from '@/lib/sswEntwicklung'
import { localized } from '@/lib/i18n/localized'

interface Profile {
  name: string
  baby_name: string
  due_date: string
}

const CATEGORY_BG: Record<SswComparisonCategory, string> = {
  frucht: 'bg-secondary/60',
  suessigkeit: 'bg-secondary/60',
  spielzeug: 'bg-secondary/60',
  tier: 'bg-secondary/60',
  alltag: 'bg-secondary/60',
}

export default async function WochePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = (await supabase
    .from('profiles')
    .select('name, baby_name, due_date')
    .eq('user_id', user.id)
    .single()) as { data: Profile | null }

  if (!profile) redirect('/onboarding')

  const ssw = calculateSSW(profile.due_date)
  const info = getSswInfo(ssw)

  const locale = await getServerLocale()
  const t = getMessages(locale)
  const theme = await getServerTheme()
  const isClassic = theme === 'classic'

  const nextSsw = ssw < 42 ? ssw + 1 : null
  const nextInfo = nextSsw ? getSswInfo(nextSsw) : null

  const categoryLabels = t.woche.categoryLabels as Record<
    SswComparisonCategory,
    string
  >

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-sm px-4 py-8">
        {/* Back link */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            <span>{t.common.backToDashboard.replace(/^←\s*/, '')}</span>
          </Link>
        </div>

        {/* Hero */}
        <header className="card-elevated mb-8 rounded-2xl bg-card p-7">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {t.woche.sswOf.replace('{ssw}', String(ssw))}
          </p>
          <h1 className="mt-2 font-display text-5xl font-medium leading-none text-primary">
            {ssw}
          </h1>
          <div
            aria-hidden="true"
            className="my-5 h-px w-12"
            style={{ backgroundColor: 'hsl(var(--accent))' }}
          />
          <p className="font-display text-base italic text-muted-foreground">
            {t.woche.forBaby.replace('{babyName}', profile.baby_name)}
          </p>
        </header>

        {/* Development */}
        {info && (
          <section className="card-elevated mb-6 rounded-2xl bg-card p-6">
            <h2
              className={
                isClassic
                  ? 'mb-3 text-base font-semibold text-foreground'
                  : 'mb-3 font-display text-lg font-semibold text-foreground'
              }
            >
              {t.woche.development}
            </h2>
            <p className="text-sm leading-relaxed text-foreground">
              {localized(info.development, locale)}
            </p>
          </section>
        )}

        {/* Size & weight */}
        {info && (
          <section className="card-elevated mb-6 rounded-2xl bg-card p-6">
            <h2
              className={
                isClassic
                  ? 'mb-4 text-base font-semibold text-foreground'
                  : 'mb-4 font-display text-lg font-semibold text-foreground'
              }
            >
              {t.woche.sizeAndWeight}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-secondary/40 px-4 py-3">
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {t.woche.size}
                </p>
                <p className="mt-1 font-display text-2xl font-medium text-foreground">
                  {formatSize(info.sizeMm, locale)}
                </p>
              </div>
              <div className="rounded-xl bg-secondary/40 px-4 py-3">
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {t.woche.weight}
                </p>
                {info.weightG ? (
                  <p className="mt-1 font-display text-2xl font-medium text-foreground">
                    {formatWeight(info.weightG, locale)}
                  </p>
                ) : (
                  <p className="mt-1 font-display text-sm italic text-muted-foreground">
                    {t.woche.weightNotYet}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Funny comparisons */}
        {info && info.comparisons.length > 0 && (
          <section className="card-elevated mb-6 rounded-2xl bg-card p-6">
            <h2
              className={
                isClassic
                  ? 'mb-4 text-base font-semibold text-foreground'
                  : 'mb-4 font-display text-lg font-semibold text-foreground'
              }
            >
              {t.woche.funnyComparisons}
            </h2>
            <ul className="space-y-3" aria-label={t.woche.funnyComparisons}>
              {info.comparisons.map((c, i) => (
                <li key={`${c.category}-${i}`}>
                  <Card
                    className={`border-border/60 ${CATEGORY_BG[c.category]}`}
                  >
                    <CardContent className="flex items-center gap-3 p-4">
                      <span
                        aria-hidden="true"
                        className={
                          isClassic
                            ? 'text-3xl leading-none'
                            : 'text-2xl leading-none'
                        }
                      >
                        {c.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p
                          className={
                            isClassic
                              ? 'text-sm font-medium leading-snug text-foreground'
                              : 'font-display text-sm italic leading-snug text-foreground'
                          }
                        >
                          {localized(c.label, locale)}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="shrink-0 text-[10px] uppercase tracking-wider"
                      >
                        {categoryLabels[c.category]}
                      </Badge>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Next week */}
        {nextInfo && (
          <section className="card-elevated rounded-2xl bg-card p-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {t.woche.nextWeekTitle}
            </p>
            <p className="mt-2 flex items-baseline gap-3">
              <span className="font-display text-3xl font-medium text-primary">
                {nextInfo.ssw}
              </span>
              <span className="font-display text-sm italic text-muted-foreground">
                {localized(nextInfo.comparisons[0]?.label ?? nextInfo.development, locale)}
              </span>
            </p>
            <div className="mt-4 flex items-center justify-end gap-1 text-xs font-medium text-primary">
              <span>{t.woche.nextWeekCta.replace('{ssw}', String(nextInfo.ssw))}</span>
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
