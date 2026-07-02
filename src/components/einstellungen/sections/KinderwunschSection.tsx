'use client'

import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { usePreferences } from '@/lib/preferences/client'
import { useT } from '@/lib/i18n/client'

export function KinderwunschSection() {
  const { prefs, update } = usePreferences()
  const t = useT()
  const ts = t.settings.kinderwunsch

  const trackingKeys = [
    { key: 'temperature' as const, label: ts.tracking.temperature, hint: ts.tracking.temperatureHint },
    { key: 'lh' as const, label: ts.tracking.lhTest, hint: ts.tracking.lhTestHint },
    { key: 'symptothermal' as const, label: ts.tracking.symptothermal, hint: ts.tracking.symptothermalHint },
    { key: 'gv' as const, label: ts.tracking.sexualIntercourse, hint: ts.tracking.sexualIntercourseHint },
    { key: 'mens' as const, label: ts.tracking.menstruation, hint: ts.tracking.menstruationHint },
  ]

  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-1 text-sm font-semibold text-foreground">{ts.cycleLength.title}</h2>
        <p className="mb-3 text-xs text-muted-foreground">{ts.cycleLength.description}</p>
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
          <div className="w-16 text-center">
            <div className="font-display text-3xl font-medium text-primary">{prefs.kinderwunschCycleLength}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{ts.cycleLength.unit}</div>
          </div>
          <Slider
            value={[prefs.kinderwunschCycleLength]}
            min={21}
            max={40}
            step={1}
            onValueChange={(v) => update({ kinderwunschCycleLength: v[0] })}
            className="flex-1"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-sm font-semibold text-foreground">{ts.trackingElements.title}</h2>
        <p className="mb-3 text-xs text-muted-foreground">{ts.trackingElements.description}</p>
        <ul className="space-y-2">
          {trackingKeys.map((k) => (
            <li key={k.key} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{k.label}</div>
                <div className="text-xs text-muted-foreground">{k.hint}</div>
              </div>
              <Switch
                checked={prefs.kinderwunschTracking[k.key]}
                onCheckedChange={(v) =>
                  update({ kinderwunschTracking: { ...prefs.kinderwunschTracking, [k.key]: v } })
                }
              />
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-1 text-sm font-semibold text-foreground">{ts.reminders.title}</h2>
        <p className="mb-3 text-xs text-muted-foreground">{ts.reminders.description}</p>
        <div className="space-y-3 rounded-xl border border-border bg-card p-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">{ts.reminders.vitaminsTime}</label>
            <Input
              type="time"
              value={prefs.kinderwunschReminders.vitaminsTime ?? ''}
              onChange={(e) =>
                update({
                  kinderwunschReminders: {
                    ...prefs.kinderwunschReminders,
                    vitaminsTime: e.target.value || null,
                  },
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">{ts.reminders.ovuTestActive}</div>
              <div className="text-xs text-muted-foreground">{ts.reminders.ovuTestActiveHint}</div>
            </div>
            <Switch
              checked={prefs.kinderwunschReminders.ovuTestActive}
              onCheckedChange={(v) =>
                update({
                  kinderwunschReminders: { ...prefs.kinderwunschReminders, ovuTestActive: v },
                })
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">{ts.reminders.wunschEt}</label>
            <Input
              type="date"
              value={prefs.kinderwunschReminders.wunschEt ?? ''}
              onChange={(e) =>
                update({
                  kinderwunschReminders: {
                    ...prefs.kinderwunschReminders,
                    wunschEt: e.target.value || null,
                  },
                })
              }
            />
          </div>
        </div>
      </section>
    </div>
  )
}
