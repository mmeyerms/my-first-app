import { PacklisteView } from '@/components/packliste/PacklisteView'

export default function PacklistePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-sm px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-2xl font-medium text-foreground">Krankenhaustasche</h1>
          <a href="/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-primary">← Dashboard</a>
        </div>
        <PacklisteView />
      </div>
    </main>
  )
}
