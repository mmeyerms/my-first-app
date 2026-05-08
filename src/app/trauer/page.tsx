import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TrauerView } from '@/components/trauer/TrauerView'

export const metadata = {
  title: 'Begleitung in Trauer · MamaMap',
}

export default async function TrauerPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return <TrauerView />
}
