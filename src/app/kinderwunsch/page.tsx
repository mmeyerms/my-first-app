import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { KinderwunschHub } from '@/components/kinderwunsch/KinderwunschHub'

export default async function KinderwunschPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <main className="min-h-screen bg-rose-50">
      <KinderwunschHub />
    </main>
  )
}
