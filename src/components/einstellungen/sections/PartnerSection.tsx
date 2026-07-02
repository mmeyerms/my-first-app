'use client'

import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { usePreferences } from '@/lib/preferences/client'
import type { PartnerRole } from '@/lib/preferences/types'
import { cn } from '@/lib/utils'
import { PartnerTodosManager } from './PartnerTodosManager'
import { useT } from '@/lib/i18n/client'

type RoleMeta = {
  key: PartnerRole
  labelKey: 'partner' | 'grandparent' | 'friend' | 'other'
  hintKey: 'partnerHint' | 'grandparentHint' | 'friendHint' | 'otherHint'
}

const ROLES: ReadonlyArray<RoleMeta> = [
  { key: 'partner', labelKey: 'partner', hintKey: 'partnerHint' },
  { key: 'grandparent', labelKey: 'grandparent', hintKey: 'grandparentHint' },
  { key: 'friend', labelKey: 'friend', hintKey: 'friendHint' },
  { key: 'other', labelKey: 'other', hintKey: 'otherHint' },
]

type VisibilityKey = 'termine' | 'tagebuch' | 'geburtsplan' | 'woche' | 'wochenbett' | 'partnerTodos'

const VISIBILITY_KEYS: ReadonlyArray<{ key: VisibilityKey; hintKey: `${VisibilityKey}Hint` }> = [
  { key: 'termine', hintKey: 'termineHint' },
  { key: 'tagebuch', hintKey: 'tagebuchHint' },
  { key: 'geburtsplan', hintKey: 'geburtsplanHint' },
  { key: 'woche', hintKey: 'wocheHint' },
  { key: 'wochenbett', hintKey: 'wochenbettHint' },
  { key: 'partnerTodos', hintKey: 'partnerTodosHint' },
] as const

export function PartnerSection() {
  const { prefs, update } = usePreferences()
  const t = useT()

  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-1 text-sm font-semibold text-foreground">{t.settings.partner.role.title}</h2>
        <p className="mb-3 text-xs text-muted-foreground">{t.settings.partner.role.description}</p>
        <div className="grid grid-cols-2 gap-2">
          {ROLES.map((r) => (
            <button
              key={r.key ?? 'null'}
              type="button"
              onClick={() => update({ partnerRole: r.key })}
              aria-pressed={prefs.partnerRole === r.key}
              className={cn(
                'rounded-xl border p-3 text-left',
                prefs.partnerRole === r.key ? 'border-primary bg-secondary/60 ring-2 ring-primary/40' : 'border-border bg-card hover:border-primary/40',
              )}
            >
              <div className="text-sm font-semibold">{t.settings.partner.role[r.labelKey]}</div>
              <div className="text-xs text-muted-foreground">{t.settings.partner.role[r.hintKey]}</div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-sm font-semibold text-foreground">{t.settings.partner.label.title}</h2>
        <p className="mb-3 text-xs text-muted-foreground">{t.settings.partner.label.description}</p>
        <Input
          value={prefs.partnerLabel}
          onChange={(e) => update({ partnerLabel: e.target.value.slice(0, 40) })}
          placeholder={t.settings.partner.label.placeholder}
        />
      </section>

      <section>
        <h2 className="mb-1 text-sm font-semibold text-foreground">{t.settings.partner.visibility.title}</h2>
        <p className="mb-3 text-xs text-muted-foreground">
          {t.settings.partner.visibility.description}
        </p>
        <ul className="space-y-2">
          {VISIBILITY_KEYS.map((v) => (
            <li key={v.key} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{t.settings.partner.visibility[v.key]}</div>
                <div className="text-xs text-muted-foreground">{t.settings.partner.visibility[v.hintKey]}</div>
              </div>
              <Switch
                checked={prefs.partnerVisibility[v.key]}
                onCheckedChange={(checked) =>
                  update({
                    partnerVisibility: { ...prefs.partnerVisibility, [v.key]: checked },
                  })
                }
              />
            </li>
          ))}
        </ul>
      </section>

      <PartnerTodosManager />
    </div>
  )
}
