import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { calculateSSW } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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

  if (!profile) redirect('/onboarding')

  const ssw = calculateSSW(profile.due_date)

  const navItems = [
    {
      href: '/geburtsplan',
      emoji: '📋',
      title: 'Geburtsplan',
      description: 'Plane deine Wunschgeburt Schritt für Schritt',
      available: false,
    },
    {
      href: '/tipps',
      emoji: '💡',
      title: 'Tägliche Tipps',
      description: `Impulse für SSW ${ssw}`,
      available: false,
    },
    {
      href: '/partner',
      emoji: '💑',
      title: 'Partner-Bereich',
      description: 'Tipps für deinen Partner',
      available: false,
    },
  ]

  return (
    <main className="min-h-screen bg-rose-50">
      <div className="mx-auto max-w-sm px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-rose-500">🌸 MamaMap</h1>
          <Link href="/profil" className="text-sm text-gray-500 hover:text-gray-700">
            Profil
          </Link>
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
          {navItems.map((item) => (
            <Card
              key={item.href}
              className={`transition-shadow ${item.available ? 'cursor-pointer hover:shadow-md' : 'opacity-60'}`}
            >
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
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
