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
  baby_name: string
  due_date: string
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
    .select('name, baby_name, due_date')
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

  const ssw = calculateSSW(profile.due_date)
  const tip = getTipForDay(ssw)
  const theme = await getServerTheme()
  const isClassic = theme === 'classic'
  const locale = await getServerLocale()
  const t = getMessages(locale)

  const navItems: NavItem[] = [
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
      available: true,
    },
    {
      href: '/tipps',
      icon: Sparkle,
      emoji: '💡',
      title: t.dashboard.cards.tipps.title,
      description: t.dashboard.cards.tipps.description.replace('{ssw}', String(ssw)),
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
    {
      href: '/partner',
      icon: HeartHandshake,
      emoji: '💑',
      title: t.dashboard.cards.partner.title,
      description: t.dashboard.cards.partner.description,
      available: true,
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <DailyTipPopup tip={tip} ssw={ssw} />
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
        <WelcomeCard name={profile.name} babyName={profile.baby_name} ssw={ssw} />

        {/* Navigation cards */}
        <nav aria-label={t.nav.sectionsAria} className="space-y-3">
          {navItems.map((item) => {
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
                        {t.dashboard.soonBadge}
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
        </nav>
      </div>
    </main>
  )
}
