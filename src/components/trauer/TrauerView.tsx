'use client'

import Link from 'next/link'
import { ChevronLeft, Heart, Phone, Star } from 'lucide-react'
import { useT } from '@/lib/i18n/client'

export function TrauerView() {
  const t = useT()

  const phases = [
    t.trauer.phaseShock,
    t.trauer.phaseAnger,
    t.trauer.phaseBargain,
    t.trauer.phaseGrief,
    t.trauer.phaseAccept,
  ]

  const helpItems = [
    { icon: Phone, text: t.trauer.helpHotline },
    { icon: Heart, text: t.trauer.helpRegenbogen },
    { icon: Star, text: t.trauer.helpSternenkinder },
    { icon: Heart, text: t.trauer.helpProfamilia },
    { icon: Phone, text: t.trauer.helpAcute },
  ]

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          'linear-gradient(180deg, hsl(280 25% 97%) 0%, hsl(40 30% 97%) 100%)',
      }}
    >
      <div className="mx-auto max-w-2xl px-5 py-10 sm:px-6">
        {/* Back link */}
        <div className="mb-8">
          <Link
            href="/profil"
            className="inline-flex items-center gap-1 text-sm transition-colors hover:underline"
            style={{ color: 'hsl(280 25% 38%)' }}
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            {t.trauer.back}
          </Link>
        </div>

        {/* Hero */}
        <header className="mb-12 text-center">
          <div
            className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full"
            style={{ backgroundColor: 'hsl(280 30% 92%)' }}
          >
            <Star
              className="h-7 w-7"
              strokeWidth={1.2}
              style={{ color: 'hsl(280 25% 45%)' }}
              aria-hidden="true"
            />
          </div>
          <h1
            className="font-display text-4xl font-medium leading-tight sm:text-5xl"
            style={{ color: 'hsl(280 25% 26%)' }}
          >
            {t.trauer.title}
          </h1>
          <p
            className="mx-auto mt-4 max-w-md font-display text-base italic leading-relaxed sm:text-lg"
            style={{ color: 'hsl(280 15% 40%)' }}
          >
            {t.trauer.subtitle}
          </p>
        </header>

        <div className="space-y-10">
          {/* Feelings */}
          <section
            className="rounded-3xl p-7 sm:p-9"
            style={{
              backgroundColor: 'hsl(0 0% 100% / 0.6)',
              border: '1px solid hsl(280 20% 88%)',
            }}
          >
            <h2
              className="mb-3 font-display text-2xl font-medium"
              style={{ color: 'hsl(280 25% 28%)' }}
            >
              {t.trauer.feelingsHeading}
            </h2>
            <p
              className="font-display text-base leading-relaxed"
              style={{ color: 'hsl(280 15% 35%)' }}
            >
              {t.trauer.feelingsBody}
            </p>
          </section>

          {/* Phases */}
          <section
            className="rounded-3xl p-7 sm:p-9"
            style={{
              backgroundColor: 'hsl(0 0% 100% / 0.6)',
              border: '1px solid hsl(280 20% 88%)',
            }}
          >
            <h2
              className="mb-5 font-display text-2xl font-medium"
              style={{ color: 'hsl(280 25% 28%)' }}
            >
              {t.trauer.phasesHeading}
            </h2>
            <ol className="mb-5 space-y-3">
              {phases.map((phase, idx) => (
                <li
                  key={idx}
                  className="flex items-baseline gap-3 rounded-xl px-4 py-3"
                  style={{ backgroundColor: 'hsl(280 30% 96%)' }}
                >
                  <span
                    className="font-display text-2xl font-medium leading-none"
                    style={{ color: 'hsl(280 25% 50%)' }}
                  >
                    {idx + 1}
                  </span>
                  <span
                    className="font-display text-base leading-snug"
                    style={{ color: 'hsl(280 20% 30%)' }}
                  >
                    {phase}
                  </span>
                </li>
              ))}
            </ol>
            <p
              className="font-display text-sm italic leading-relaxed"
              style={{ color: 'hsl(280 15% 45%)' }}
            >
              {t.trauer.phasesNonLinear}
            </p>
          </section>

          {/* Body */}
          <section
            className="rounded-3xl p-7 sm:p-9"
            style={{
              backgroundColor: 'hsl(0 0% 100% / 0.6)',
              border: '1px solid hsl(280 20% 88%)',
            }}
          >
            <h2
              className="mb-4 font-display text-2xl font-medium"
              style={{ color: 'hsl(280 25% 28%)' }}
            >
              {t.trauer.bodyHeading}
            </h2>
            <ul className="space-y-2">
              {t.trauer.bodyTips.map((tip, idx) => (
                <li
                  key={idx}
                  className="flex gap-3 font-display text-base leading-relaxed"
                  style={{ color: 'hsl(280 15% 35%)' }}
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: 'hsl(280 25% 55%)' }}
                  />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Help */}
          <section
            className="rounded-3xl p-7 sm:p-9"
            style={{
              backgroundColor: 'hsl(280 30% 95%)',
              border: '1px solid hsl(280 25% 85%)',
            }}
          >
            <h2
              className="mb-5 font-display text-2xl font-medium"
              style={{ color: 'hsl(280 25% 26%)' }}
            >
              {t.trauer.helpHeading}
            </h2>
            <ul className="space-y-3">
              {helpItems.map((item, idx) => {
                const Icon = item.icon
                return (
                  <li
                    key={idx}
                    className="flex items-start gap-3 rounded-xl bg-white/70 px-4 py-3"
                  >
                    <Icon
                      className="mt-0.5 h-4 w-4 shrink-0"
                      strokeWidth={1.5}
                      style={{ color: 'hsl(280 25% 50%)' }}
                      aria-hidden="true"
                    />
                    <span
                      className="font-display text-sm leading-relaxed"
                      style={{ color: 'hsl(280 20% 30%)' }}
                    >
                      {item.text}
                    </span>
                  </li>
                )
              })}
            </ul>
          </section>

          {/* Remember */}
          <section
            className="rounded-3xl p-7 sm:p-9"
            style={{
              backgroundColor: 'hsl(0 0% 100% / 0.6)',
              border: '1px solid hsl(280 20% 88%)',
            }}
          >
            <h2
              className="mb-3 font-display text-2xl font-medium"
              style={{ color: 'hsl(280 25% 28%)' }}
            >
              {t.trauer.rememberHeading}
            </h2>
            <p
              className="font-display text-base leading-relaxed"
              style={{ color: 'hsl(280 15% 35%)' }}
            >
              {t.trauer.rememberBody}
            </p>
          </section>

          {/* Ready */}
          <section
            className="rounded-3xl p-7 sm:p-9"
            style={{
              backgroundColor: 'hsl(40 30% 96%)',
              border: '1px solid hsl(40 25% 85%)',
            }}
          >
            <h2
              className="mb-3 font-display text-2xl font-medium"
              style={{ color: 'hsl(280 25% 28%)' }}
            >
              {t.trauer.readyHeading}
            </h2>
            <p
              className="font-display text-base italic leading-relaxed"
              style={{ color: 'hsl(280 15% 38%)' }}
            >
              {t.trauer.readyBody}
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
