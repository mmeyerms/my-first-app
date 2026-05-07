'use client'

import { useLocale } from '@/lib/i18n/client'
import { LocaleSelector } from '@/components/i18n/LocaleSelector'

export function LocaleSection() {
  const { t } = useLocale()
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">{t.profile.sectionLanguage.title}</h3>
      <p className="text-xs text-gray-500">{t.profile.sectionLanguage.description}</p>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {t.profile.sectionLanguage.choose}
        </label>
        <LocaleSelector variant="full" />
      </div>
    </div>
  )
}
