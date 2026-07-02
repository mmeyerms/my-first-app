import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PartnerAcceptForm } from '@/components/partner/PartnerAcceptForm'

export default async function PartnerAcceptPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-rose-50 px-4">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl bg-white p-8 shadow-sm text-center">
            <p className="mb-4 text-4xl">💑</p>
            <h1 className="mb-2 text-xl font-bold text-gray-800">Partner-Einladung</h1>
            <p className="mb-6 text-sm text-gray-500">
              Du wurdest eingeladen, den Partner-Bereich von MamaMap zu nutzen. Melde dich an oder
              erstelle ein kostenloses Konto, um fortzufahren.
            </p>
            <div className="space-y-3">
              <Link
                href={`/register?next=/partner/accept/${token}`}
                className="block w-full rounded-lg bg-rose-500 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-rose-600"
              >
                Konto erstellen
              </Link>
              <Link
                href={`/login?next=/partner/accept/${token}`}
                className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Bereits registriert? Anmelden
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // User is authenticated. Check whether THIS user is the mother behind the
  // token — if so, show a clear "self-invite is not possible" screen with a
  // sign-out CTA rather than silently letting the accept fail server-side.
  const { data: invite } = await supabase
    .from('partner_invites')
    .select('mother_id, used_at, expires_at')
    .eq('token', token)
    .limit(1)
    .single()

  const isSelfInvite = Boolean(invite && invite.mother_id === user.id)
  const isExpired = Boolean(invite && new Date(invite.expires_at as string) < new Date())
  const isUsed = Boolean(invite?.used_at)

  return (
    <main className="flex min-h-screen items-center justify-center bg-rose-50 px-4 py-8">
      <div className="w-full max-w-sm space-y-3">
        {isSelfInvite && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center">
            <p aria-hidden="true" className="mb-1 text-2xl">👋</p>
            <p className="mb-2 text-sm font-medium text-amber-900">
              Du bist mit deinem eigenen Konto angemeldet
            </p>
            <p className="mb-3 text-xs leading-relaxed text-amber-800">
              Das ist deine eigene Einladung — du kannst dich nicht selbst als Partner hinzufügen.
              Öffne den Link am besten in einem <strong>privaten Tab</strong> deines Browsers und
              melde dich dort mit der E-Mail-Adresse der Person an, die dein Partner werden soll.
            </p>
            <Link
              href="/dashboard"
              className="block w-full rounded-lg bg-amber-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-amber-700"
            >
              Zurück zu meinem Dashboard
            </Link>
          </div>
        )}
        {!isSelfInvite && isExpired && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center">
            <p aria-hidden="true" className="mb-1 text-2xl">⌛</p>
            <p className="mb-2 text-sm font-medium text-red-900">Der Link ist abgelaufen</p>
            <p className="text-xs leading-relaxed text-red-800">
              Einladungen sind 7 Tage gültig. Bitte die werdende Mama, dir einen neuen Link zu
              schicken.
            </p>
          </div>
        )}
        {!isSelfInvite && !isExpired && isUsed && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-center">
            <p aria-hidden="true" className="mb-1 text-2xl">✅</p>
            <p className="mb-2 text-sm font-medium text-blue-900">Bereits verwendet</p>
            <p className="text-xs leading-relaxed text-blue-800">
              Dieser Link wurde schon eingelöst. Falls das du warst — check dein Partner-Dashboard.
            </p>
            <Link
              href="/partner/dashboard"
              className="mt-3 block w-full rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
            >
              Zum Partner-Dashboard
            </Link>
          </div>
        )}
        {!isSelfInvite && !isExpired && !isUsed && (
          <>
            <div className="mb-3 rounded-xl border border-border/60 bg-secondary/40 px-3 py-2 text-center text-xs text-muted-foreground">
              Du bist angemeldet als <strong className="text-foreground">{user.email}</strong>.
              Falls du eine andere Person bist, öffne den Link am besten in einem privaten Tab.
            </div>
            <PartnerAcceptForm token={token} />
          </>
        )}
      </div>
    </main>
  )
}
