import { AengsteView } from '@/components/kinderwunsch/AengsteView'
import Link from 'next/link'

export default function AengstePage() {
  return (
    <main className="min-h-screen bg-rose-50">
      <div className="mx-auto max-w-sm px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">🤔 Was macht Angst?</h1>
          <Link href="/kinderwunsch" className="text-sm text-rose-500 hover:underline">← Garten</Link>
        </div>
        <AengsteView />
      </div>
    </main>
  )
}
