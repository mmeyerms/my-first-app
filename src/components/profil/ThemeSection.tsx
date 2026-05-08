'use client'

import { Check } from 'lucide-react'
import { useLocale } from '@/lib/i18n/client'
import { useTheme } from '@/lib/theme/client'
import { THEMES, type Theme } from '@/lib/theme/types'

export function ThemeSection() {
  const { t } = useLocale()
  const { theme, setTheme } = useTheme()

  const themeMeta: Record<Theme, { title: string; description: string }> = {
    classic: {
      title: t.theme.classic,
      description: t.theme.classicDescription,
    },
    editorial: {
      title: t.theme.editorial,
      description: t.theme.editorialDescription,
    },
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">
        {t.profile.sectionAppearance.title}
      </h3>
      <p className="text-xs text-gray-500">
        {t.profile.sectionAppearance.description}
      </p>
      <div role="radiogroup" aria-label={t.profile.sectionAppearance.choose} className="grid grid-cols-2 gap-3">
        {THEMES.map((option) => {
          const isActive = theme === option
          const meta = themeMeta[option]
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => {
                if (!isActive) setTheme(option)
              }}
              className={[
                'group relative flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                isActive
                  ? 'border-primary bg-secondary/60 ring-2 ring-primary/40'
                  : 'border-border bg-card hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm',
              ].join(' ')}
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  {meta.title}
                </span>
                {isActive && (
                  <span
                    aria-label={t.theme.selected}
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  >
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                  </span>
                )}
              </div>
              <span className="text-xs leading-relaxed text-muted-foreground">
                {meta.description}
              </span>
              {/* Mini swatches that hint at the palette */}
              <div className="mt-1 flex items-center gap-1.5" aria-hidden="true">
                {option === 'classic' ? (
                  <>
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: 'hsl(350 89% 60%)' }} />
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: 'hsl(316 60% 88%)' }} />
                    <span className="h-3 w-3 rounded-full border border-border" style={{ backgroundColor: 'hsl(0 0% 100%)' }} />
                  </>
                ) : (
                  <>
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: 'hsl(354 26% 30%)' }} />
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: 'hsl(38 47% 62%)' }} />
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: 'hsl(33 33% 96%)' }} />
                  </>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
