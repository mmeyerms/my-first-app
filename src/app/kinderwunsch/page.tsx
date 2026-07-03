import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { KinderwunschHub } from '@/components/kinderwunsch/KinderwunschHub'
import { SituationNotes } from '@/components/situation/SituationNotes'

export default async function KinderwunschPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-sm px-4 pt-6">
        <SituationNotes context="kinderwunsch" />
      </div>
      <KinderwunschHub />
    </main>
  )
}
