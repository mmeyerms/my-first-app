'use client'

import { Switch } from '@/components/ui/switch'
import { usePreferences } from '@/lib/preferences/client'

export function NotificationsSection() {
  const { prefs, update } = usePreferences()

  return (
    <div className="space-y-6">
      <section className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4">
        <div className="flex-1 space-y-1">
          <div className="text-sm font-semibold">Wöchentliche Zusammenfassung</div>
          <p className="text-xs text-muted-foreground">
            Jeden Sonntagmorgen bekommst du eine kurze E-Mail mit deiner aktuellen SSW,
            deinem nächsten Termin und einer Stimmungs-Rückschau der letzten Woche.
          </p>
        </div>
        <Switch
          checked={prefs.notifications.weeklyEmail}
          onCheckedChange={(v) => update({ notifications: { ...prefs.notifications, weeklyEmail: v } })}
          aria-label="Wöchentliche Zusammenfassung per E-Mail aktivieren"
        />
      </section>

      <section className="rounded-xl border border-dashed border-border bg-secondary/30 p-4 text-xs text-muted-foreground">
        <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Setup-Info</p>
        <p>
          Der Cron läuft jeden Sonntag um 9 Uhr UTC. Damit die Mails tatsächlich rausgehen,
          muss <code className="rounded bg-card px-1">RESEND_API_KEY</code> als Environment Variable
          in Vercel gesetzt sein (kostenlos unter <a className="underline" href="https://resend.com/api-keys" target="_blank" rel="noreferrer">resend.com/api-keys</a>).
          Ohne Key läuft die Route im No-Op-Modus und loggt nur „would send to X".
        </p>
      </section>
    </div>
  )
}

export default NotificationsSection
