import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { calculateSSW } from '@/lib/utils'
import { getTipForDay } from '@/lib/tips'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DailyTipPopup } from '@/components/tipps/DailyTipPopup'
import { LocaleSelector } from '@/components/i18n/LocaleSelector'

interface Profile {
  name: string
  baby_name: string
  due_date: string
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

  const navItems = [
    {
      href: '/kinderwunsch',
      emoji: '🌷',
      title: 'Kinderwunsch & Vorfreude',
      description: 'Vorbereitung & Reflexion vor und um den positiven Test',
      available: true,
    },
    {
      href: '/geburtsplan',
      emoji: '📋',
      title: 'Geburtsplan',
      description: 'Plane deine Wunschgeburt Schritt für Schritt',
      available: true,
    },
    {
      href: '/tipps',
      emoji: '💡',
      title: 'Tägliche Tipps',
      description: `Impulse für SSW ${ssw}`,
      available: true,
    },
    {
      href: '/tagebuch',
      emoji: '📔',
      title: 'Schwangerschaftstagebuch',
      description: 'Halte besondere Momente fest',
      available: true,
    },
    {
      href: '/einkaufsliste',
      emoji: '🛍️',
      title: 'Baby-Ausstattung',
      description: 'Was ihr wirklich braucht',
      available: true,
    },
    {
      href: '/packliste',
      emoji: '🏥',
      title: 'Krankenhaustasche',
      description: 'Checkliste für die Geburt',
      available: true,
    },
    {
      href: '/partner',
      emoji: '💑',
      title: 'Partner-Bereich',
      description: 'Tipps für deinen Partner',
      available: true,
    },
  ]

  return (
    <main className="min-h-screen bg-rose-50">
      <DailyTipPopup tip={tip} ssw={ssw} />
      <div className="mx-auto max-w-sm px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-rose-500">🌸 MamaMap</h1>
          <div className="flex items-center gap-2">
            <LocaleSelector variant="compact" />
            <Link href="/profil" className="text-sm text-gray-500 hover:text-gray-700">
              Profil
            </Link>
          </div>
        </div>

        {/* Welcome card */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Hallo, {profile.name}! 👋</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-5xl font-bold text-rose-500">SSW {ssw}</span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {profile.baby_name} ist auf dem Weg 💛
          </p>
        </div>

        {/* Navigation cards */}
        <div className="space-y-3">
          {navItems.map((item) => {
            const cardContent = (
              <CardContent className="flex items-center gap-4 p-4">
                <span className="text-3xl">{item.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800">{item.title}</p>
                    {!item.available && (
                      <Badge variant="secondary" className="text-xs">Bald</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
                <span className="text-gray-300">›</span>
              </CardContent>
            )
            return item.available ? (
              <Link key={item.href} href={item.href}>
                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  {cardContent}
                </Card>
              </Link>
            ) : (
              <Card key={item.href} className="opacity-60">
                {cardContent}
              </Card>
            )
          })}
        </div>
      </div>
    </main>
  )
}
