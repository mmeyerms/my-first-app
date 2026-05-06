import { EinkaufslisteView } from '@/components/einkaufsliste/EinkaufslisteView'

export default function EinkaufslistePage() {
  return (
    <main className="min-h-screen bg-rose-50">
      <div className="mx-auto max-w-sm px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">🛍️ Baby-Ausstattung</h1>
          <a href="/dashboard" className="text-sm text-rose-500 hover:underline">← Dashboard</a>
        </div>
        <EinkaufslisteView />
      </div>
    </main>
  )
}
