'use client'

import { usePreferences } from '@/lib/preferences/client'
import { useT } from '@/lib/i18n/client'
import type {
  ChecklistLocation,
  ChecklistSeason,
  ChecklistSetup,
} from '@/lib/preferences/types'
import { cn } from '@/lib/utils'

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
  const t = useT()
  const ts = t.settings.checklists.presets
  const presets = prefs.listPresets

  const locations: Array<{ key: ChecklistLocation; label: string; hint: string }> = [
    { key: 'klinik', label: ts.location.clinic, hint: ts.location.clinicHint },
    { key: 'hausgeburt', label: ts.location.homebirth, hint: ts.location.homebirthHint },
    { key: 'geburtshaus', label: ts.location.birthCenter, hint: ts.location.birthCenterHint },
  ]

  const seasons: Array<{ key: ChecklistSeason; label: string; hint: string }> = [
    { key: 'sommer', label: ts.season.summer, hint: ts.season.summerHint },
    { key: 'winter', label: ts.season.winter, hint: ts.season.winterHint },
  ]

  const setups: Array<{ key: ChecklistSetup; label: string; hint: string }> = [
    { key: 'solo', label: ts.setup.solo, hint: ts.setup.soloHint },
    { key: 'duo', label: ts.setup.duo, hint: ts.setup.duoHint },
  ]

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
        <h2 className="mb-1 text-sm font-semibold text-foreground">{ts.title}</h2>
        <p className="text-xs text-muted-foreground">{ts.description}</p>
      </div>

      <section aria-label={ts.location.title} className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {ts.location.title}
        </h3>
        <div className="grid gap-2 sm:grid-cols-3">
          {locations.map((opt) => (
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

      <section aria-label={ts.season.title} className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {ts.season.title}
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {seasons.map((opt) => (
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

      <section aria-label={ts.setup.title} className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {ts.setup.title}
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {setups.map((opt) => (
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
            {ts.resetAll}
          </button>
        </div>
      )}

      <p className="rounded-xl border border-dashed border-border bg-secondary/30 p-3 text-xs text-muted-foreground">
        {ts.tip}
      </p>
    </div>
  )
}
