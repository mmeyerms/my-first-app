import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Sprout,
  ScrollText,
  Sparkle,
  NotebookPen,
  CalendarDays,
  ShoppingBag,
  Briefcase,
  HandHeart,
  HeartHandshake,
  ChevronRight,
  UserCircle2,
  type LucideIcon,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { calculateSSW } from '@/lib/utils'
import { getTipForDay } from '@/lib/tips'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DailyTipPopup } from '@/components/tipps/DailyTipPopup'
import { LocaleSelector } from '@/components/i18n/LocaleSelector'
import { Logo } from '@/components/brand/Logo'
import { WelcomeCard } from '@/components/dashboard/WelcomeCard'
import { getServerTheme } from '@/lib/theme/server'
import { getServerLocale } from '@/lib/i18n/server'
import { getMessages } from '@/lib/i18n/messages'

interface Profile {
  name: string
  baby_name: string | null
  due_date: string | null
  mode: 'planning' | 'pregnant' | null
}

interface NavItem {
  href: string
  icon: LucideIcon
  emoji: string
  title: string
  description: string
  available: boolean
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, baby_name, due_date, mode')
    .eq('user_id', user.id)
    .single() as { data: Profile | null }

  if (!profile) {
    // No profile: check if this user is a partner (not a mother)
    const { data: partnerLink } = await supabase
      .from('partner_links')
      .select('mother_id')
      .eq('partner_user_id', user.id)
      .eq('active', true)
      .single()
    if (partnerLink) redirect('/partner/dashboard')
    redirect('/onboarding')
  }

  // Default mode is 'pregnant' for any pre-existing profile that doesn't have it set.
  const mode: 'planning' | 'pregnant' = profile.mode ?? 'pregnant'
  const isPlanning = mode === 'planning'

  // SSW only computed if due_date is known. If unknown, fall back to a neutral
  // value (1) for tip rotation; we still show the tip card for pregnant users
  // so they have something to read.
  const ssw = profile.due_date ? calculateSSW(profile.due_date) : null
  const tipSsw = ssw ?? 1
  const tip = getTipForDay(tipSsw)
  const theme = await getServerTheme()
  const isClassic = theme === 'classic'
  const locale = await getServerLocale()
  const t = getMessages(locale)

  interface NavSection {
    id: string
    title: string
    description: string
    items: NavItem[]
  }

  // Reflection section is always available for both modes.
  const reflectionItems: NavItem[] = [
    {
      href: '/kinderwunsch',
      icon: Sprout,
      emoji: '🌷',
      title: t.dashboard.cards.kinderwunsch.title,
      description: t.dashboard.cards.kinderwunsch.description,
      available: true,
    },
    {
      href: '/geburtsplan',
      icon: ScrollText,
      emoji: '📋',
      title: t.dashboard.cards.geburtsplan.title,
      description: t.dashboard.cards.geburtsplan.description,
      // Birth plan is offered for pregnant mode; in planning mode it's locked
      // since SSW-based stages aren't applicable yet.
      available: !isPlanning,
    },
  ]

  const sections: NavSection[] = [
    {
      id: 'reflection',
      title: t.dashboard.sections.reflection.title,
      description: t.dashboard.sections.reflection.description,
      items: reflectionItems,
    },
  ]

  // Daily / practical sections only make sense when pregnant. Hide for planning.
  if (!isPlanning) {
    sections.push({
      id: 'daily',
      title: t.dashboard.sections.daily.title,
      description: t.dashboard.sections.daily.description,
      items: [
        {
          href: '/tipps',
          icon: Sparkle,
          emoji: '💡',
          title: t.dashboard.cards.tipps.title,
          description: t.dashboard.cards.tipps.description.replace('{ssw}', String(tipSsw)),
          available: true,
        },
        {
          href: '/tagebuch',
          icon: NotebookPen,
          emoji: '📔',
          title: t.dashboard.cards.tagebuch.title,
          description: t.dashboard.cards.tagebuch.description,
          available: true,
        },
        {
          href: '/termine',
          icon: CalendarDays,
          emoji: '📅',
          title: t.dashboard.cards.termine.title,
          description: t.dashboard.cards.termine.description,
          available: true,
        },
      ],
    })

    sections.push({
      id: 'practical',
      title: t.dashboard.sections.practical.title,
      description: t.dashboard.sections.practical.description,
      items: [
        {
          href: '/einkaufsliste',
          icon: ShoppingBag,
          emoji: '🛍️',
          title: t.dashboard.cards.einkaufsliste.title,
          description: t.dashboard.cards.einkaufsliste.description,
          available: true,
        },
        {
          href: '/packliste',
          icon: Briefcase,
          emoji: '🏥',
          title: t.dashboard.cards.packliste.title,
          description: t.dashboard.cards.packliste.description,
          available: true,
        },
        {
          href: '/wochenbett',
          icon: HandHeart,
          emoji: '💞',
          title: t.dashboard.cards.wochenbett.title,
          description: t.dashboard.cards.wochenbett.description,
          available: true,
        },
      ],
    })
  }

  // Together / partner section is shown for both modes.
  sections.push({
    id: 'together',
    title: t.dashboard.sections.together.title,
    description: t.dashboard.sections.together.description,
    items: [
      {
        href: '/partner',
        icon: HeartHandshake,
        emoji: '💑',
        title: t.dashboard.cards.partner.title,
        description: t.dashboard.cards.partner.description,
        available: true,
      },
    ],
  })

  return (
    <main className="min-h-screen bg-background">
      {/* Daily tip popup is only relevant for pregnant users with a known SSW. */}
      {!isPlanning && ssw !== null && <DailyTipPopup tip={tip} ssw={ssw} />}
      <div className="mx-auto max-w-sm px-4 py-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-2">
            <LocaleSelector variant="compact" />
            <Link
              href="/profil"
              aria-label={t.nav.profileAria}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
            >
              <UserCircle2 className="h-5 w-5" strokeWidth={1.5} />
            </Link>
          </div>
        </header>

        {/* Welcome card */}
        <WelcomeCard
          name={profile.name}
          babyName={profile.baby_name}
          ssw={ssw}
          dueDate={profile.due_date}
          mode={mode}
        />

        {/* Navigation grouped into sections */}
        <nav aria-label={t.nav.sectionsAria} className="space-y-8">
          {sections.map((section) => (
            <section key={section.id} aria-labelledby={`section-${section.id}`}>
              <header className="mb-3 px-1">
                <h2
                  id={`section-${section.id}`}
                  className={
                    isClassic
                      ? 'text-xs font-semibold uppercase tracking-[0.18em] text-primary'
                      : 'text-[10px] font-semibold uppercase tracking-[0.22em] text-primary'
                  }
                >
                  {section.title}
                </h2>
                <p
                  className={
                    isClassic
                      ? 'mt-0.5 text-xs text-muted-foreground'
                      : 'mt-0.5 font-display text-xs italic text-muted-foreground'
                  }
                >
                  {section.description}
                </p>
              </header>
              <div className="space-y-3">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const cardContent = (
                    <CardContent className="flex items-start gap-4 p-5">
                      <span
                        aria-hidden="true"
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-secondary"
                      >
                        {isClassic ? (
                          <span className="text-3xl leading-none">{item.emoji}</span>
                        ) : (
                          <Icon
                            className="h-6 w-6 text-primary"
                            strokeWidth={1.5}
                          />
                        )}
                      </span>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center gap-2">
                          <p
                            className={
                              isClassic
                                ? 'text-base font-semibold leading-tight text-foreground'
                                : 'font-display text-lg font-semibold leading-tight text-foreground'
                            }
                          >
                            {item.title}
                          </p>
                          {!item.available && (
                            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                              {isPlanning ? t.dashboard.lockedNote : t.dashboard.soonBadge}
                            </Badge>
                          )}
                        </div>
                        <p
                          className={
                            isClassic
                              ? 'mt-1 text-sm text-muted-foreground'
                              : 'mt-1 font-display text-sm italic text-muted-foreground'
                          }
                        >
                          {item.description}
                        </p>
                      </div>
                      <ChevronRight
                        className="mt-3 h-4 w-4 shrink-0 text-muted-foreground"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </CardContent>
                  )
                  return item.available ? (
                    <Link key={item.href} href={item.href} aria-label={item.title}>
                      <Card className="card-elevated cursor-pointer border-border/60 bg-card transition-all hover:-translate-y-0.5 hover:shadow-md">
                        {cardContent}
                      </Card>
                    </Link>
                  ) : (
                    <Card key={item.href} className="card-elevated border-border/60 bg-card opacity-60">
                      {cardContent}
                    </Card>
                  )
                })}
              </div>
            </section>
          ))}
        </nav>
      </div>
    </main>
  )
}
