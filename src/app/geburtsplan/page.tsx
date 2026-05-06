import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { calculateSSW } from '@/lib/utils'
import { GeburtsplanView } from '@/components/geburtsplan/GeburtsplanView'

export default async function GeburtsplanPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, baby_name, due_date')
    .eq('user_id', user.id)
    .single()

  if (!profile) redirect('/onboarding')

  const { data: plan } = await supabase
    .from('birth_plans')
    .select('answers')
    .eq('user_id', user.id)
    .single()

  const ssw = calculateSSW(profile.due_date)

  return (
    <main className="min-h-screen bg-rose-50">
      <div className="mx-auto max-w-lg px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
            ← Dashboard
          </Link>
        </div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">📋 Mein Geburtsplan</h1>
          <p className="mt-1 text-sm text-gray-500">
            Für {profile.baby_name} · SSW {ssw}
          </p>
        </div>
        <GeburtsplanView
          initialAnswers={(plan?.answers as Record<string, unknown>) ?? {}}
          ssw={ssw}
          babyName={profile.baby_name}
          dueDate={profile.due_date}
        />
      </div>
    </main>
  )
}
