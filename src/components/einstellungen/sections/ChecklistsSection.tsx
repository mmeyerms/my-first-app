'use client'

export function ChecklistsSection() {
  return (
    <div className="space-y-4">
      <p className="rounded-xl border border-dashed border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
        In den einzelnen Listen (Packliste, Einkaufsliste, Wochenbett) findest du die Personalisierung direkt in der Liste:
      </p>
      <ul className="space-y-2 text-sm">
        <li className="rounded-xl border border-border bg-card p-3">
          <div className="font-semibold">Vorlagen wählen</div>
          <div className="text-xs text-muted-foreground">Klinik / Hausgeburt · Sommer / Winter · Solo / Duo</div>
        </li>
        <li className="rounded-xl border border-border bg-card p-3">
          <div className="font-semibold">Eigene Items hinzufügen</div>
          <div className="text-xs text-muted-foreground">Am Ende jeder Kategorie via „+ Eigenes Item"</div>
        </li>
        <li className="rounded-xl border border-border bg-card p-3">
          <div className="font-semibold">Menge · Marke · Notiz</div>
          <div className="text-xs text-muted-foreground">Tippe auf ein Item, um Details zu hinterlegen</div>
        </li>
      </ul>
    </div>
  )
}
