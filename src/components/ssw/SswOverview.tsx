'use client'

import { SSW_DATA, formatSize, formatWeight } from '@/lib/sswEntwicklung'
import { localized } from '@/lib/i18n/localized'
import { BabyIllustration } from './BabyIllustration'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'
import type { Locale } from '@/lib/i18n/types'
import { getMessages } from '@/lib/i18n/messages'

interface Props {
  locale: Locale
}

const PRINT_STYLES = `
  @media print {
    @page { size: A4 portrait; margin: 1cm; }
    html, body { background: white !important; }
    .ssw-grid { break-inside: auto; }
    .ssw-card { break-inside: avoid; page-break-inside: avoid; }
  }
`

export function SswOverview({ locale }: Props) {
  const t = getMessages(locale)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PRINT_STYLES }} />

      {/* Action bar */}
      <div className="mb-6 flex justify-end gap-2 print:hidden">
        <Button onClick={() => window.print()} className="gap-2">
          <Printer className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          {t.woche.printPdf}
        </Button>
      </div>

      {/* Print-only header */}
      <div className="hidden print:block mb-8 text-center">
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          MamaMap — {t.woche.overviewTitle}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {locale === 'de'
            ? 'Entwicklung Schwangerschaftswoche 4 bis 42'
            : 'Development from week 4 to 42'}
        </p>
      </div>

      {/* Grid: 1 col on mobile, 2 on tablet, 3 on desktop, 2 in print */}
      <div className="ssw-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-2 print:gap-3">
        {SSW_DATA.map((info) => (
          <article
            key={info.ssw}
            className="ssw-card rounded-2xl border border-border bg-card p-4 shadow-sm flex flex-col items-center text-center print:shadow-none print:border-gray-300"
          >
            <BabyIllustration ssw={info.ssw} size={120} bare={false} />
            <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {t.woche.overviewLabel}
            </p>
            <p className="font-display text-3xl font-medium text-primary leading-none">
              {info.ssw}
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              {formatSize(info.sizeMm, locale)}
              {info.weightG ? ` · ${formatWeight(info.weightG, locale)}` : ''}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-foreground line-clamp-3">
              {localized(info.development, locale)}
            </p>
          </article>
        ))}
      </div>
    </>
  )
}
