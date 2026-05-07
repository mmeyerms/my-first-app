import { EinkaufslisteView } from '@/components/einkaufsliste/EinkaufslisteView'

export default function EinkaufslistePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-sm px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-2xl font-medium text-foreground">Baby-Ausstattung</h1>
          <a href="/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-primary">← Dashboard</a>
        </div>
        <EinkaufslisteView />
      </div>
    </main>
  )
}
