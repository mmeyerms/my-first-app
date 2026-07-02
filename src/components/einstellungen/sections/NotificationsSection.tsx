'use client'

import { useCallback, useEffect, useState } from 'react'
import { BellRing, BellOff, Send } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { usePreferences } from '@/lib/preferences/client'
import { useT } from '@/lib/i18n/client'
import {
  getPermission,
  isPushSupported,
  isSubscribed,
  sendTestPush,
  subscribePush,
  unsubscribePush,
} from '@/lib/push/client'
import { cn } from '@/lib/utils'

type PermissionStatus = NotificationPermission | 'unsupported' | 'unknown'

export function NotificationsSection() {
  const { prefs, update } = usePreferences()
  const t = useT()
  const ts = t.settings.notifications
  const pushT = ts.push

  const [permission, setPermission] = useState<PermissionStatus>('unknown')
  const [subscribed, setSubscribed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setPermission(getPermission())
    setSubscribed(await isSubscribed())
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  async function handleEnable() {
    setBusy(true)
    setFeedback(null)
    const res = await subscribePush()
    if (res.ok) {
      setSubscribed(true)
      setPermission(getPermission())
    } else if (res.error === 'denied') {
      setFeedback(pushT.permissionDenied)
    } else if (res.error === 'unsupported') {
      setFeedback(pushT.unsupported)
    } else {
      setFeedback(pushT.permissionDenied)
    }
    setBusy(false)
  }

  async function handleDisable() {
    setBusy(true)
    await unsubscribePush()
    setSubscribed(false)
    setBusy(false)
  }

  async function handleTest() {
    setBusy(true)
    setFeedback(null)
    const ok = await sendTestPush()
    if (ok) setFeedback(pushT.testSent)
    setBusy(false)
  }

  const supported = isPushSupported() && permission !== 'unsupported'
  const active = subscribed && permission === 'granted'
  const pushPrefs = prefs.notifications.push

  return (
    <div className="space-y-6">
      {/* Weekly Email (existing) */}
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

      {/* Push Section */}
      <section className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">{pushT.sectionTitle}</div>
            <p className="mt-0.5 text-xs text-muted-foreground">{pushT.sectionDescription}</p>
          </div>
          <span
            className={cn(
              'inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider',
              active
                ? 'border-primary/40 bg-secondary/60 text-primary'
                : 'border-border bg-secondary/30 text-muted-foreground',
            )}
          >
            {active ? <BellRing className="h-3 w-3" strokeWidth={1.5} /> : <BellOff className="h-3 w-3" strokeWidth={1.5} />}
            {active ? pushT.statusEnabled : pushT.statusDisabled}
          </span>
        </div>

        {!supported && (
          <p className="mb-3 rounded-lg border border-dashed border-border bg-secondary/30 p-3 text-xs text-muted-foreground">
            {pushT.unsupported}
          </p>
        )}

        {supported && !active && (
          <Button onClick={handleEnable} disabled={busy} className="w-full">
            {busy ? pushT.subscribing : pushT.enableCta}
          </Button>
        )}

        {supported && active && (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleTest} disabled={busy} className="gap-2">
              <Send className="h-3.5 w-3.5" strokeWidth={1.5} />
              {pushT.testCta}
            </Button>
            <Button variant="ghost" onClick={handleDisable} disabled={busy}>
              {pushT.disableCta}
            </Button>
          </div>
        )}

        {feedback && (
          <p className="mt-3 text-xs text-muted-foreground">{feedback}</p>
        )}

        {active && (
          <div className="mt-5 border-t border-border pt-4">
            <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{pushT.typesLabel}</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{pushT.typeWeekChange}</div>
                  <div className="text-xs text-muted-foreground">{pushT.typeWeekChangeHint}</div>
                </div>
                <Switch
                  checked={pushPrefs.weekChange}
                  onCheckedChange={(v) => update({ notifications: { ...prefs.notifications, push: { ...pushPrefs, weekChange: v } } })}
                  aria-label={pushT.typeWeekChange}
                />
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{pushT.typeTerminReminder}</div>
                  <div className="text-xs text-muted-foreground">{pushT.typeTerminReminderHint}</div>
                </div>
                <Switch
                  checked={pushPrefs.terminReminder}
                  onCheckedChange={(v) => update({ notifications: { ...prefs.notifications, push: { ...pushPrefs, terminReminder: v } } })}
                  aria-label={pushT.typeTerminReminder}
                />
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{pushT.typeHelpClaim}</div>
                  <div className="text-xs text-muted-foreground">{pushT.typeHelpClaimHint}</div>
                </div>
                <Switch
                  checked={pushPrefs.helpSlotClaimed}
                  onCheckedChange={(v) => update({ notifications: { ...prefs.notifications, push: { ...pushPrefs, helpSlotClaimed: v } } })}
                  aria-label={pushT.typeHelpClaim}
                />
              </li>
            </ul>
          </div>
        )}
      </section>

      {/* Setup Info (existing) */}
      <section className="rounded-xl border border-dashed border-border bg-secondary/30 p-4 text-xs text-muted-foreground">
        <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{ts.setupInfoLabel}</p>
        <p>{ts.setupInfoText}</p>
      </section>
    </div>
  )
}

export default NotificationsSection
