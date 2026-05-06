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

  return (
    <main className="flex min-h-screen items-center justify-center bg-rose-50 px-4">
      <div className="w-full max-w-sm">
        <PartnerAcceptForm token={token} />
      </div>
    </main>
  )
}
