'use client'

import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { usePreferences } from '@/lib/preferences/client'

const TRACKING_KEYS = [
  { key: 'temperature', label: 'Basaltemperatur', hint: 'Morgens vor dem Aufstehen' },
  { key: 'lh', label: 'LH-Test', hint: 'Ovulationstest' },
  { key: 'symptothermal', label: 'Symptothermal', hint: 'Zervixschleim + Temperatur' },
  { key: 'gv', label: 'Geschlechtsverkehr', hint: 'Fruchtbare Tage im Fokus' },
  { key: 'mens', label: 'Menstruation', hint: 'Zykluslänge im Blick' },
] as const

export function KinderwunschSection() {
  const { prefs, update } = usePreferences()

  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-1 text-sm font-semibold text-foreground">Zyklus-Länge</h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Deine typische Zykluslänge (in Tagen). Standardwert: 28.
        </p>
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
          <div className="w-16 text-center">
            <div className="font-display text-3xl font-medium text-primary">{prefs.kinderwunschCycleLength}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Tage</div>
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
        <h2 className="mb-1 text-sm font-semibold text-foreground">Tracking-Elemente</h2>
        <p className="mb-3 text-xs text-muted-foreground">Nur das, was dich wirklich interessiert.</p>
        <ul className="space-y-2">
          {TRACKING_KEYS.map((k) => (
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
        <h2 className="mb-1 text-sm font-semibold text-foreground">Erinnerungen</h2>
        <p className="mb-3 text-xs text-muted-foreground">Kleine Anker im Alltag.</p>
        <div className="space-y-3 rounded-xl border border-border bg-card p-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Vitamine — Uhrzeit</label>
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
              <div className="text-sm font-semibold">Ovulationstest aktiv</div>
              <div className="text-xs text-muted-foreground">Push-Erinnerung an fruchtbaren Tagen</div>
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
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Wunsch-ET (Ziel-Datum)</label>
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
