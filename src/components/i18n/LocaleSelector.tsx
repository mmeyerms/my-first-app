'use client'

import { useLocale } from '@/lib/i18n/client'
import { LOCALES, LOCALE_FLAGS, LOCALE_LABELS, isLocale, type Locale } from '@/lib/i18n/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface Props {
  variant?: 'compact' | 'full'
  className?: string
}

export function LocaleSelector({ variant = 'compact', className = '' }: Props) {
  const { locale, setLocale, t } = useLocale()

  function handleChange(value: string) {
    if (isLocale(value)) setLocale(value)
  }

  const isCompact = variant === 'compact'

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger
        aria-label={t.locale.switch}
        className={cn(
          'border-border bg-card text-sm text-foreground shadow-sm transition-colors hover:bg-secondary focus:ring-ring',
          isCompact ? 'h-9 w-auto min-w-[5rem] gap-1.5 px-2.5' : 'h-10 w-full',
          className,
        )}
      >
        <SelectValue>
          <span className="flex items-center gap-2">
            <span aria-hidden="true">{LOCALE_FLAGS[locale]}</span>
            <span className={isCompact ? 'sr-only sm:not-sr-only' : ''}>
              {isCompact ? LOCALE_LABELS[locale] : LOCALE_LABELS[locale]}
            </span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {LOCALES.map((l: Locale) => (
          <SelectItem key={l} value={l}>
            <span className="flex items-center gap-2">
              <span aria-hidden="true">{LOCALE_FLAGS[l]}</span>
              <span>{LOCALE_LABELS[l]}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
