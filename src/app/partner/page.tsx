import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PartnerInviteManager } from '@/components/partner/PartnerInviteManager'
import { PartnerContentView } from '@/components/partner/PartnerContentView'
import { calculateSSW } from '@/lib/utils'

export default async function PartnerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: link } = await supabase
    .from('partner_links')
    .select('partner_user_id')
    .eq('mother_id', user.id)
    .eq('active', true)
    .single()

  const { data: invite } = await supabase
    .from('partner_invites')
    .select('token, expires_at')
    .eq('mother_id', user.id)
    .is('used_at', null)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const initialStatus = {
    hasPartner: !!link,
    pendingToken: invite?.token ?? null,
    pendingExpiry: invite?.expires_at ?? null,
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('baby_name, due_date')
    .eq('user_id', user.id)
    .single() as { data: { baby_name: string; due_date: string } | null }

  const ssw = profile ? calculateSSW(profile.due_date) : 20
  const babyName = profile?.baby_name ?? 'euer Baby'

  return (
    <main className="min-h-screen bg-rose-50">
      <div className="mx-auto max-w-sm px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
            ‹
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Partner-Bereich</h1>
        </div>

        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm leading-relaxed text-gray-600">
            Gib deinem Partner Zugang zu deiner MamaMap. Er sieht die aktuelle
            Schwangerschaftswoche, phasenspezifische Tipps und deinen Geburtsplan — kann aber
            nichts bearbeiten.
          </p>
        </div>

        <PartnerInviteManager initialStatus={initialStatus} />

        <PartnerContentView ssw={ssw} babyName={babyName} />
      </div>
    </main>
  )
}
