import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProfilForm } from '@/components/profil/ProfilForm'
import { LocaleSection } from '@/components/profil/LocaleSection'

export default async function ProfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, baby_name, positive_test_date, due_date')
    .eq('user_id', user.id)
    .single()

  if (!profile) redirect('/onboarding')

  return (
    <main className="min-h-screen bg-rose-50">
      <div className="mx-auto max-w-sm px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
            ← Dashboard
          </Link>
        </div>
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Mein Profil</h1>
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <ProfilForm profile={profile} />
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <LocaleSection />
          </div>
        </div>
      </div>
    </main>
  )
}
