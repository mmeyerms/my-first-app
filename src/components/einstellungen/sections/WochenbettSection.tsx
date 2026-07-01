'use client'

export function WochenbettSection() {
  return (
    <div className="space-y-4">
      <p className="rounded-xl border border-dashed border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
        Danke-Nachrichten für den Wochenbett-Chef findest du direkt bei jeder Anfrage — mit einem Klick vorformuliert für kochen, einkaufen, putzen und mehr.
      </p>
      <ul className="space-y-2 text-sm">
        <li className="rounded-xl border border-border bg-card p-3">
          <div className="font-semibold">1-Klick-Danke pro Aufgabe</div>
          <div className="text-xs text-muted-foreground">Vorformulierte, warme Nachrichten je nach Aufgaben-Typ</div>
        </li>
        <li className="rounded-xl border border-border bg-card p-3">
          <div className="font-semibold">Anpassbar</div>
          <div className="text-xs text-muted-foreground">Text ist Vorlage — änderbar bevor du versendest</div>
        </li>
      </ul>
    </div>
  )
}
