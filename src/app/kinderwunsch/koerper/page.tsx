import Link from 'next/link'
import { KoerperChecklist } from '@/components/kinderwunsch/KoerperChecklist'

export default function KinderwunschKoerperPage() {
  return (
    <main className="min-h-screen bg-rose-50">
      <div className="mx-auto max-w-sm px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">🌱 Körper bereit?</h1>
          <Link href="/kinderwunsch" className="text-sm text-rose-500 hover:underline shrink-0">
            ← Garten
          </Link>
        </div>
        <KoerperChecklist />
      </div>
    </main>
  )
}
