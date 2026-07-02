'use client'

import { useT } from '@/lib/i18n/client'

export function WochenbettSection() {
  const t = useT()
  const ts = t.settings.wochenbett

  return (
    <div className="space-y-4">
      <p className="rounded-xl border border-dashed border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
        {ts.info}
      </p>
      <ul className="space-y-2 text-sm">
        <li className="rounded-xl border border-border bg-card p-3">
          <div className="font-semibold">{ts.item1Title}</div>
          <div className="text-xs text-muted-foreground">{ts.item1Hint}</div>
        </li>
        <li className="rounded-xl border border-border bg-card p-3">
          <div className="font-semibold">{ts.item2Title}</div>
          <div className="text-xs text-muted-foreground">{ts.item2Hint}</div>
        </li>
      </ul>
    </div>
  )
}
