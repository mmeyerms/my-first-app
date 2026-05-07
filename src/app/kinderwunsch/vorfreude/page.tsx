import { VorfreudeView } from '@/components/kinderwunsch/VorfreudeView'
import Link from 'next/link'

export default function VorfreudePage() {
  return (
    <main className="min-h-screen bg-rose-50">
      <div className="mx-auto max-w-sm px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">✨ Vorfreude-Rituale</h1>
          <Link href="/kinderwunsch" className="text-sm text-rose-500 hover:underline">← Garten</Link>
        </div>
        <VorfreudeView />
      </div>
    </main>
  )
}
