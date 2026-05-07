import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Sprout,
  ScrollText,
  Sparkle,
  NotebookPen,
  ShoppingBag,
  Briefcase,
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

interface Profile {
  name: string
  baby_name: string
  due_date: string
}

interface NavItem {
  href: string
  icon: LucideIcon
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

  const navItems: NavItem[] = [
    {
      href: '/kinderwunsch',
      icon: Sprout,
      title: 'Kinderwunsch & Vorfreude',
      description: 'Vorbereitung & Reflexion vor und um den positiven Test',
      available: true,
    },
    {
      href: '/geburtsplan',
      icon: ScrollText,
      title: 'Geburtsplan',
      description: 'Plane deine Wunschgeburt Schritt für Schritt',
      available: true,
    },
    {
      href: '/tipps',
      icon: Sparkle,
      title: 'Tägliche Tipps',
      description: `Impulse für SSW ${ssw}`,
      available: true,
    },
    {
      href: '/tagebuch',
      icon: NotebookPen,
      title: 'Schwangerschaftstagebuch',
      description: 'Halte besondere Momente fest',
      available: true,
    },
    {
      href: '/einkaufsliste',
      icon: ShoppingBag,
      title: 'Baby-Ausstattung',
      description: 'Was ihr wirklich braucht',
      available: true,
    },
    {
      href: '/packliste',
      icon: Briefcase,
      title: 'Krankenhaustasche',
      description: 'Checkliste für die Geburt',
      available: true,
    },
    {
      href: '/partner',
      icon: HeartHandshake,
      title: 'Partner-Bereich',
      description: 'Tipps für deinen Partner',
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
              aria-label="Profil"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
            >
              <UserCircle2 className="h-5 w-5" strokeWidth={1.5} />
            </Link>
          </div>
        </header>

        {/* Welcome card */}
        <section className="card-elevated mb-8 rounded-2xl bg-card p-7">
          <h1 className="font-display text-2xl font-medium leading-tight text-foreground">
            Hallo, <span className="font-semibold">{profile.name}</span>.
          </h1>
          <div className="mt-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Schwangerschaftswoche
            </p>
            <p className="mt-1 font-display text-6xl font-medium leading-none text-primary">
              {ssw}
            </p>
          </div>
          <div
            aria-hidden="true"
            className="my-5 h-px w-12"
            style={{ backgroundColor: 'hsl(var(--accent))' }}
          />
          <p className="font-display text-base italic text-muted-foreground">
            {profile.baby_name} ist auf dem Weg.
          </p>
        </section>

        {/* Navigation cards */}
        <nav aria-label="Bereiche" className="space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const cardContent = (
              <CardContent className="flex items-start gap-4 p-5">
                <span
                  aria-hidden="true"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-secondary"
                >
                  <Icon
                    className="h-6 w-6 text-primary"
                    strokeWidth={1.5}
                  />
                </span>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2">
                    <p className="font-display text-lg font-semibold leading-tight text-foreground">
                      {item.title}
                    </p>
                    {!item.available && (
                      <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                        Bald
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 font-display text-sm italic text-muted-foreground">
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
