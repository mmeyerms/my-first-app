'use client'

import { useLocale } from '@/lib/i18n/client'

interface Props {
  statements: { id: string; text: string }[]
  signedAt: string
  mama?: string
  partner?: string
}

const PRINT_STYLES = `
@media print {
  @page {
    size: A4 portrait;
    margin: 1.2cm;
  }
  html, body {
    background: white !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  body * {
    visibility: hidden !important;
  }
  .manifest-certificate, .manifest-certificate * {
    visibility: visible !important;
  }
  .manifest-certificate {
    position: absolute !important;
    inset: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    box-shadow: none !important;
    background: white !important;
    color: #111 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .manifest-certificate .cert-frame-outer {
    border-color: #b45309 !important;
  }
  .manifest-certificate .cert-frame-inner {
    border-color: #b45309 !important;
  }
  .manifest-certificate .cert-accent {
    color: #b45309 !important;
  }
}
`

function formatDateLong(iso: string, locale: 'de' | 'en'): string {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''
    return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d)
  } catch {
    return ''
  }
}

const COPY = {
  de: {
    label: 'Zertifikat',
    title: 'Unser Eltern-Manifest',
    subtitle: 'Eine gegenseitige Verpflichtung',
    intro1: 'Wir,',
    intro2: 'verpflichten uns auf dem gemeinsamen Weg in die Elternschaft',
    intro3: 'zu folgenden Grundsätzen:',
    sealed: 'Besiegelt an diesem',
    fallbackNames: 'die werdenden Eltern',
    mamaPlaceholder: 'Mama',
    partnerPlaceholder: 'Partner/in',
    footer: 'MamaMap · ein Versprechen an euch und euer Kind',
  },
  en: {
    label: 'Certificate',
    title: 'Our Parent Manifesto',
    subtitle: 'A mutual commitment',
    intro1: 'We,',
    intro2: 'commit on our shared journey into parenthood',
    intro3: 'to the following principles:',
    sealed: 'Sealed on this',
    fallbackNames: 'the soon-to-be parents',
    mamaPlaceholder: 'Mom',
    partnerPlaceholder: 'Partner',
    footer: 'MamaMap · a promise to you and your child',
  },
} as const

export function ManifestCertificate({ statements, signedAt, mama, partner }: Props) {
  const { locale } = useLocale()
  const c = COPY[locale]
  const dateLong = formatDateLong(signedAt, locale)
  const namesLine = [mama, partner].filter(Boolean).join('  &  ') || c.fallbackNames

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PRINT_STYLES }} />
      <div
        className="manifest-certificate relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50/40 via-white to-amber-50/30 px-6 py-10 shadow-lg sm:px-10 sm:py-14"
      >
        {/* Outer ornamental frame */}
        <div className="cert-frame-outer pointer-events-none absolute inset-3 rounded-xl border-2 border-rose-300/70" aria-hidden="true" />
        {/* Inner ornamental frame */}
        <div className="cert-frame-inner pointer-events-none absolute inset-5 rounded-lg border border-rose-200/80" aria-hidden="true" />

        {/* Top crest */}
        <div className="relative text-center">
          <div className="cert-accent text-3xl tracking-[0.4em] text-rose-400">✦ ✦ ✦</div>
          <div className="mt-4 text-6xl">🌷</div>
          <p className="cert-accent mt-3 text-[10px] font-semibold uppercase tracking-[0.5em] text-rose-500">
            {c.label}
          </p>
          <h1
            className="mt-2 font-serif text-3xl font-bold text-gray-800 sm:text-4xl"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            {c.title}
          </h1>
          <p className="mt-2 text-sm italic text-gray-500">
            {c.subtitle}
          </p>
          <div className="cert-accent mx-auto mt-4 h-px w-24 bg-rose-300" />
        </div>

        {/* Intro */}
        <div className="relative mt-8 text-center">
          <p
            className="font-serif text-base leading-relaxed text-gray-700 sm:text-lg"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            {c.intro1} <span className="cert-accent font-semibold text-rose-600">{namesLine}</span>,
            {' '}{c.intro2}
            <br className="hidden sm:block" /> {c.intro3}
          </p>
        </div>

        {/* Statements */}
        <ol className="relative mx-auto mt-8 max-w-xl space-y-4 sm:mt-10">
          {statements.map((s, idx) => (
            <li key={s.id} className="flex gap-4">
              <span
                className="cert-accent shrink-0 font-serif text-2xl font-bold leading-none text-rose-400"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                {String(idx + 1).padStart(2, '0')}
              </span>
              <p
                className="font-serif text-sm leading-relaxed text-gray-800 sm:text-base"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                {s.text}
              </p>
            </li>
          ))}
        </ol>

        {/* Date */}
        <div className="relative mt-10 text-center">
          <div className="cert-accent mx-auto h-px w-32 bg-rose-300" />
          <p className="mt-4 text-sm italic text-gray-600">
            {c.sealed}
          </p>
          <p
            className="cert-accent mt-1 font-serif text-xl font-semibold text-rose-600"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            {dateLong}
          </p>
        </div>

        {/* Signatures */}
        <div className="relative mt-12 grid grid-cols-2 gap-6 px-2 sm:gap-12 sm:px-8">
          <div className="text-center">
            <div className="border-b-2 border-gray-400 pb-1">&nbsp;</div>
            <p className="mt-2 text-xs uppercase tracking-widest text-gray-500">
              {mama || c.mamaPlaceholder}
            </p>
          </div>
          <div className="text-center">
            <div className="border-b-2 border-gray-400 pb-1">&nbsp;</div>
            <p className="mt-2 text-xs uppercase tracking-widest text-gray-500">
              {partner || c.partnerPlaceholder}
            </p>
          </div>
        </div>

        {/* Bottom flourish */}
        <div className="relative mt-10 text-center">
          <div className="cert-accent text-2xl tracking-[0.4em] text-rose-400">✦ ✦ ✦</div>
          <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-gray-400">
            {c.footer}
          </p>
        </div>
      </div>
    </>
  )
}
