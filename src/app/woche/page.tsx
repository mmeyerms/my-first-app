import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, HeartHandshake, Sparkles, Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { calculateSSW } from '@/lib/utils'
import { getServerLocale } from '@/lib/i18n/server'
import { getMessages } from '@/lib/i18n/messages'
import { getServerTheme } from '@/lib/theme/server'
import { getActivePregnancy } from '@/lib/pregnancy/server'
import { getPreferences } from '@/lib/preferences/server'
import { getZodiacForDate } from '@/lib/sternzeichen'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  getSswInfo,
  formatSize,
  formatWeight,
  type SswComparisonCategory,
} from '@/lib/sswEntwicklung'
import { localized } from '@/lib/i18n/localized'
import { BabyIllustration } from '@/components/ssw/BabyIllustration'
import { NeedsDueDateNotice } from '@/components/shared/NeedsDueDateNotice'
import { SituationNotes } from '@/components/situation/SituationNotes'

interface Profile {
  name: string
  baby_name: string | null
}

const CATEGORY_BG: Record<SswComparisonCategory, string> = {
  frucht: 'bg-secondary/60',
  suessigkeit: 'bg-secondary/60',
  spielzeug: 'bg-secondary/60',
  tier: 'bg-secondary/60',
  alltag: 'bg-secondary/60',
  sport: 'bg-secondary/60',
  beauty: 'bg-secondary/60',
}

export default async function WochePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = (await supabase
    .from('profiles')
    .select('name, baby_name')
    .eq('user_id', user.id)
    .single()) as { data: Profile | null }

  if (!profile) redirect('/onboarding')

  // Active pregnancy is source of truth (profile.due_date is legacy).
  const active = await getActivePregnancy(supabase, user.id)
  const dueDate = active?.due_date ?? null
  if (!dueDate) {
    return <NeedsDueDateNotice sectionKey="woche" status={active?.status ?? null} />
  }

  const ssw = calculateSSW(dueDate)
  const info = getSswInfo(ssw)
  const babyName = active?.baby_name ?? profile.baby_name

  // Mehrlinge: alle Namen mit "&" verbinden ("Emma & Mia"), Hinweis-Flag.
  const isMultiple = active?.is_multiple ?? false
  const joinedNames = isMultiple && Array.isArray(active?.baby_names)
    ? active.baby_names.filter((n) => n && n.trim()).join(' & ')
    : ''
  const displayBabyName = joinedNames || babyName

  const locale = await getServerLocale()
  const t = getMessages(locale)
  const theme = await getServerTheme()
  const isClassic = theme === 'classic'
  const prefs = await getPreferences(supabase, user.id)
  const showBlock = (k: 'development' | 'comparisons' | 'momBody' | 'funFact' | 'partnerTip' | 'nextWeek') =>
    prefs.wocheBlocks.includes(k)
  const allowedCategories = new Set(prefs.wocheComparisonCategories)

  const nextSsw = ssw < 42 ? ssw + 1 : null
  const nextInfo = nextSsw ? getSswInfo(nextSsw) : null

  // Progress calculation for chosen style
  const totalWeeks = 40
  const progressPct = Math.min(100, Math.max(0, Math.round((ssw / totalWeeks) * 100)))
  const weeksLeft = Math.max(0, totalWeeks - ssw)
  const zodiac = getZodiacForDate(dueDate)

  const categoryLabels = t.woche.categoryLabels as Record<
    SswComparisonCategory,
    string
  >

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-sm px-4 py-8">
        {/* Back link + overview link */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            <span>{t.common.backToDashboard.replace(/^←\s*/, '')}</span>
          </Link>
          <Link
            href="/woche/uebersicht"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <span>{t.woche.overviewLink}</span>
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
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

          {info && (
            <div className="flex items-center gap-5">
              <BabyIllustration ssw={ssw} size={140} className="shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {t.woche.sizeAndWeight}
                </p>
                <p className="mt-1 font-display text-2xl font-medium leading-tight text-foreground">
                  {formatSize(info.sizeMm, locale)}
                  {info.weightG && (
                    <>
                      <span
                        aria-hidden="true"
                        className="mx-2 text-muted-foreground"
                      >
                        ·
                      </span>
                      {formatWeight(info.weightG, locale)}
                    </>
                  )}
                </p>
                {!info.weightG && (
                  <p className="mt-1 font-display text-xs italic text-muted-foreground">
                    {t.woche.weightNotYet}
                  </p>
                )}
              </div>
            </div>
          )}

          <p className="mt-6 font-display text-base italic text-muted-foreground">
            {t.woche.forBaby.replace('{babyName}', displayBabyName ?? t.partner.fallbackBabyName)}
          </p>

          {/* Mehrlings-Hinweis: Größen/Gewichte gelten für Einlinge */}
          {isMultiple && (
            <p className="mt-3 rounded-lg border border-dashed border-accent/60 bg-secondary/30 p-3 font-display text-xs italic leading-relaxed text-muted-foreground">
              {t.woche.multiplesNote}
            </p>
          )}

          {/* Progress style */}
          {prefs.wocheProgressStyle !== 'none' && (
            <div className="mt-6">
              {prefs.wocheProgressStyle === 'bar' && (
                <>
                  <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    <span>Fortschritt</span>
                    <span>{progressPct}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progressPct}%` }} />
                  </div>
                </>
              )}
              {prefs.wocheProgressStyle === 'percent' && (
                <div className="font-display text-2xl font-medium text-primary">
                  {progressPct}%
                  <span className="ml-2 text-xs italic text-muted-foreground">der 40 Wochen</span>
                </div>
              )}
              {prefs.wocheProgressStyle === 'weeksLeft' && (
                <div className="font-display text-lg italic text-muted-foreground">
                  noch <span className="font-medium text-primary">{weeksLeft}</span> Wochen bis zum ET
                </div>
              )}
            </div>
          )}
        </header>

        {/* Lebensumstands-Hinweise: nach Verlust / Befund / Risiko */}
        <SituationNotes context="woche" ssw={ssw} />

        {/* Development */}
        {info && showBlock('development') && (
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

        {/* Funny comparisons */}
        {info && info.comparisons.length > 0 && showBlock('comparisons') && (
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
              {info.comparisons.filter((c) => allowedCategories.has(c.category)).map((c, i) => (
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

        {/* Mom body — "Was passiert in dir?" */}
        {info?.momBody && showBlock('momBody') && (
          <section
            className="card-elevated mb-6 rounded-2xl p-6"
            style={{ backgroundColor: 'hsl(var(--secondary) / 0.45)' }}
          >
            <div className="mb-3 flex items-center gap-2">
              <Heart
                className="h-4 w-4 text-primary"
                strokeWidth={2}
                aria-hidden="true"
              />
              <h2
                className={
                  isClassic
                    ? 'text-base font-semibold text-foreground'
                    : 'font-display text-lg font-semibold text-foreground'
                }
              >
                {t.woche.momBody}
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-foreground">
              {localized(info.momBody, locale)}
            </p>
          </section>
        )}

        {/* Fun fact — "Wusstest du?" */}
        {info?.funFact && showBlock('funFact') && (
          <section
            className="card-elevated mb-6 rounded-2xl border p-6"
            style={{
              backgroundColor: 'hsl(var(--accent) / 0.10)',
              borderColor: 'hsl(var(--accent) / 0.35)',
            }}
          >
            <div className="mb-3 flex items-center gap-2">
              <Sparkles
                className="h-4 w-4"
                strokeWidth={2}
                aria-hidden="true"
                style={{ color: 'hsl(var(--accent))' }}
              />
              <h2
                className={
                  isClassic
                    ? 'text-base font-semibold text-foreground'
                    : 'font-display text-lg font-semibold text-foreground'
                }
              >
                {t.woche.funFact}
              </h2>
            </div>
            <p
              className={
                isClassic
                  ? 'text-sm leading-relaxed text-foreground'
                  : 'font-display text-sm italic leading-relaxed text-foreground'
              }
            >
              {localized(info.funFact, locale)}
            </p>
          </section>
        )}

        {/* Partner tip — "Für deinen Partner" */}
        {info?.partnerTip && showBlock('partnerTip') && (
          <section className="card-elevated mb-6 rounded-2xl border-2 border-primary/20 bg-card p-6">
            <div className="mb-1 flex items-center gap-2">
              {isClassic ? (
                <span aria-hidden="true" className="text-base leading-none">
                  💑
                </span>
              ) : (
                <HeartHandshake
                  className="h-4 w-4 text-primary"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              )}
              <h2
                className={
                  isClassic
                    ? 'text-base font-semibold text-foreground'
                    : 'font-display text-lg font-semibold text-foreground'
                }
              >
                {t.woche.partnerTip}
              </h2>
            </div>
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {t.woche.partnerSubtitle}
            </p>
            <p className="text-sm leading-relaxed text-foreground">
              {localized(info.partnerTip, locale)}
            </p>
          </section>
        )}

        {/* Sternzeichen — small info card near end */}
        {zodiac && (
          <section className="card-elevated mb-6 rounded-2xl border p-6" style={{ backgroundColor: 'hsl(var(--secondary) / 0.35)' }}>
            <div className="mb-2 flex items-center gap-2">
              <span aria-hidden="true" className="text-2xl">{zodiac.emoji}</span>
              <h2 className={isClassic ? 'text-base font-semibold text-foreground' : 'font-display text-lg font-semibold text-foreground'}>
                Baby-Sternzeichen: {zodiac.label}
              </h2>
            </div>
            <p className={isClassic ? 'text-sm leading-relaxed text-foreground' : 'font-display text-sm italic leading-relaxed text-muted-foreground'}>
              {zodiac.hint} — falls das Baby zum ET kommt.
            </p>
          </section>
        )}

        {/* Next week */}
        {nextInfo && showBlock('nextWeek') && (
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
