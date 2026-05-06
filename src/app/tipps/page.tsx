import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { calculateSSW } from '@/lib/utils'
import { getTipForDay, CATEGORY_LABELS } from '@/lib/tips'
import { Badge } from '@/components/ui/badge'

export default async function TippsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('due_date')
    .eq('user_id', user.id)
    .single()

  if (!profile) redirect('/onboarding')

  const ssw = calculateSSW(profile.due_date)
  const tip = getTipForDay(ssw)

  return (
    <main className="min-h-screen bg-rose-50">
      <div className="mx-auto max-w-sm px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
            ← Dashboard
          </Link>
        </div>
        <h1 className="mb-6 text-2xl font-bold text-gray-800">💡 Tipp des Tages</h1>

        <div className="rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-rose-500 px-6 py-5 text-white">
            <p className="text-xs text-rose-100 mb-1">SSW {ssw} · {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            <p className="text-xl font-bold">{tip.emoji} {CATEGORY_LABELS[tip.category]}</p>
          </div>
          <div className="bg-white px-6 py-5">
            <p className="text-sm leading-relaxed text-gray-700">{tip.text}</p>
            {tip.detail && (
              <p className="mt-3 text-xs leading-relaxed text-gray-500">{tip.detail}</p>
            )}
            <div className="mt-4">
              <Badge variant="secondary" className="text-xs">{CATEGORY_LABELS[tip.category]}</Badge>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-400 text-center">
            Jeden Tag ein neuer Tipp — abgestimmt auf deine aktuelle Schwangerschaftswoche.
          </p>
        </div>
      </div>
    </main>
  )
}
