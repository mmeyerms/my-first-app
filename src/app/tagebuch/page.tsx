import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { calculateSSW } from '@/lib/utils'
import { TagebuchView } from '@/components/tagebuch/TagebuchView'
import Link from 'next/link'

export default async function TagebuchPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('baby_name, due_date')
    .eq('user_id', user.id)
    .single() as { data: { baby_name: string; due_date: string } | null }

  if (!profile) redirect('/onboarding')

  const ssw = calculateSSW(profile.due_date)

  return (
    <main className="min-h-screen bg-rose-50">
      <div className="mx-auto max-w-sm px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">📔 Schwangerschafts&shy;tagebuch</h1>
          <Link href="/dashboard" className="text-sm text-rose-500 hover:underline shrink-0">← Dashboard</Link>
        </div>
        <TagebuchView ssw={ssw} babyName={profile.baby_name} />
      </div>
    </main>
  )
}
