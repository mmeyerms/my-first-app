'use client'

import { usePreferences } from '@/lib/preferences/client'
import type {
  ChecklistLocation,
  ChecklistSeason,
  ChecklistSetup,
} from '@/lib/preferences/types'
import { cn } from '@/lib/utils'

const LOCATIONS: Array<{ key: ChecklistLocation; label: string; hint: string }> = [
  { key: 'klinik', label: 'Klinik', hint: 'Krankenhaus-Geburt mit Voranmeldung' },
  { key: 'hausgeburt', label: 'Hausgeburt', hint: 'Zuhause — keine Klinik-Utensilien nötig' },
  { key: 'geburtshaus', label: 'Geburtshaus', hint: 'Ambulant im Geburtshaus' },
]

const SEASONS: Array<{ key: ChecklistSeason; label: string; hint: string }> = [
  { key: 'sommer', label: 'Sommer', hint: 'Warme Socken raus, dünne Kleidung' },
  { key: 'winter', label: 'Winter', hint: 'Alles Warme bleibt an Bord' },
]

const SETUPS: Array<{ key: ChecklistSetup; label: string; hint: string }> = [
  { key: 'solo', label: 'Solo', hint: 'Ich gehe alleine — Partner-Items ausblenden' },
  { key: 'duo', label: 'Zu zweit', hint: 'Partner:in ist dabei — komplette Liste' },
]

interface OptionButtonProps<T extends string> {
  value: T
  label: string
  hint: string
  active: boolean
  onSelect: (v: T | null) => void
}

function OptionButton<T extends string>({ value, label, hint, active, onSelect }: OptionButtonProps<T>) {
  return (
    <button
      type="button"
      onClick={() => onSelect(active ? null : value)}
      aria-pressed={active}
      className={cn(
        'flex w-full flex-col items-start gap-0.5 rounded-xl border p-3 text-left transition-all',
        active
          ? 'border-primary bg-secondary/60 ring-2 ring-primary/40'
          : 'border-border bg-card hover:border-primary/40',
      )}
    >
      <span className="text-sm font-semibold">{label}</span>
      <span className="text-xs text-muted-foreground">{hint}</span>
    </button>
  )
}

export function ChecklistPresetsSection() {
  const { prefs, update } = usePreferences()
  const presets = prefs.listPresets

  function setLocation(value: ChecklistLocation | null) {
    update({ listPresets: { ...presets, location: value } })
  }
  function setSeason(value: ChecklistSeason | null) {
    update({ listPresets: { ...presets, season: value } })
  }
  function setSetup(value: ChecklistSetup | null) {
    update({ listPresets: { ...presets, setup: value } })
  }

  function resetAll() {
    update({ listPresets: { location: null, season: null, setup: null } })
  }

  const anyActive = presets.location || presets.season || presets.setup

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-sm font-semibold text-foreground">Listen-Vorlagen</h2>
        <p className="text-xs text-muted-foreground">
          Wähle Vorlagen aus — nicht benötigte Items werden aus deiner Packliste ausgeblendet.
          Einkaufsliste und Wochenbett zeigen die aktive Vorlage als Hinweis.
        </p>
      </div>

      <section aria-label="Geburtsort" className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Geburtsort
        </h3>
        <div className="grid gap-2 sm:grid-cols-3">
          {LOCATIONS.map((opt) => (
            <OptionButton
              key={opt.key}
              value={opt.key}
              label={opt.label}
              hint={opt.hint}
              active={presets.location === opt.key}
              onSelect={setLocation}
            />
          ))}
        </div>
      </section>

      <section aria-label="Jahreszeit" className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Jahreszeit
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {SEASONS.map((opt) => (
            <OptionButton
              key={opt.key}
              value={opt.key}
              label={opt.label}
              hint={opt.hint}
              active={presets.season === opt.key}
              onSelect={setSeason}
            />
          ))}
        </div>
      </section>

      <section aria-label="Begleitung" className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Begleitung
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {SETUPS.map((opt) => (
            <OptionButton
              key={opt.key}
              value={opt.key}
              label={opt.label}
              hint={opt.hint}
              active={presets.setup === opt.key}
              onSelect={setSetup}
            />
          ))}
        </div>
      </section>

      {anyActive && (
        <div className="pt-2">
          <button
            type="button"
            onClick={resetAll}
            className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
          >
            Alle Vorlagen zurücksetzen
          </button>
        </div>
      )}

      <p className="rounded-xl border border-dashed border-border bg-secondary/30 p-3 text-xs text-muted-foreground">
        Tipp: Ausgeblendete Items kannst du in der jeweiligen Liste jederzeit wieder einblenden.
      </p>
    </div>
  )
}
