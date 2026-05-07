import Link from 'next/link'
import { ManifestView } from '@/components/kinderwunsch/ManifestView'

export default function KinderwunschManifestPage() {
  return (
    <main className="min-h-screen bg-rose-50">
      <div className="mx-auto max-w-sm px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">📜 Werte-Manifest</h1>
          <Link href="/kinderwunsch" className="text-sm text-rose-500 hover:underline shrink-0">
            ← Garten
          </Link>
        </div>
        <ManifestView />
      </div>
    </main>
  )
}
