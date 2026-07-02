'use client'

import { Switch } from '@/components/ui/switch'
import { usePreferences } from '@/lib/preferences/client'
import { useT } from '@/lib/i18n/client'

export function NotificationsSection() {
  const { prefs, update } = usePreferences()
  const t = useT()
  const ts = t.settings.notifications

  return (
    <div className="space-y-6">
      <section className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4">
        <div className="flex-1 space-y-1">
          <div className="text-sm font-semibold">{ts.weeklyEmail.title}</div>
          <p className="text-xs text-muted-foreground">{ts.weeklyEmail.description}</p>
        </div>
        <Switch
          checked={prefs.notifications.weeklyEmail}
          onCheckedChange={(v) => update({ notifications: { ...prefs.notifications, weeklyEmail: v } })}
          aria-label={ts.weeklyEmail.switchAria}
        />
      </section>

      <section className="rounded-xl border border-dashed border-border bg-secondary/30 p-4 text-xs text-muted-foreground">
        <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{ts.setupInfoLabel}</p>
        <p>{ts.setupInfoText}</p>
      </section>
    </div>
  )
}

export default NotificationsSection
