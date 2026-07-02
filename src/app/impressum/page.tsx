import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

/**
 * Impressum per § 5 TMG. Values are placeholders — replace before public
 * launch. If you're a Kleinunternehmer without USt-ID: remove that line.
 * For GmbH/UG: add Handelsregister + Sitz + Geschäftsführer.
 */
export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          <span>Zurück</span>
        </Link>

        <article className="prose prose-sm max-w-none">
          <h1 className="font-display text-3xl font-medium text-foreground">Impressum</h1>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Angaben gemäß § 5 TMG</p>

          <section className="mt-8">
            <h2 className="mb-2 font-display text-lg text-foreground">Anbieter</h2>
            <p className="text-sm text-ink-body">
              Maurice Meyer<br />
              Musterstraße 1<br />
              12345 Musterstadt<br />
              Deutschland
            </p>
          </section>

          <section className="mt-6">
            <h2 className="mb-2 font-display text-lg text-foreground">Kontakt</h2>
            <p className="text-sm text-ink-body">
              E-Mail: <a href="mailto:hallo@mamamap.app" className="text-primary hover:underline">hallo@mamamap.app</a>
            </p>
          </section>

          <section className="mt-6">
            <h2 className="mb-2 font-display text-lg text-foreground">Umsatzsteuer</h2>
            <p className="text-sm text-ink-body">
              Kleinunternehmer gemäß § 19 UStG — es wird keine Umsatzsteuer ausgewiesen.
            </p>
          </section>

          <section className="mt-6">
            <h2 className="mb-2 font-display text-lg text-foreground">Verantwortlich für den Inhalt</h2>
            <p className="text-sm text-ink-body">
              gemäß § 55 Abs. 2 RStV: Maurice Meyer (Anschrift wie oben)
            </p>
          </section>

          <section className="mt-6">
            <h2 className="mb-2 font-display text-lg text-foreground">EU-Streitschlichtung</h2>
            <p className="text-sm text-ink-body">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit:{' '}
              <a href="https://ec.europa.eu/consumers/odr" className="text-primary hover:underline" target="_blank" rel="noreferrer">
                ec.europa.eu/consumers/odr
              </a>. Unsere E-Mail-Adresse findest du oben. Wir sind nicht bereit oder verpflichtet, an
              Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section className="mt-6">
            <h2 className="mb-2 font-display text-lg text-foreground">Haftungsausschluss</h2>
            <p className="text-sm text-ink-body">
              MamaMap ist eine Lifestyle-App zur strukturierten Begleitung durch Schwangerschaft und Wochenbett.
              Die Inhalte ersetzen keine medizinische, hebammliche oder therapeutische Beratung. Bei akuten Beschwerden
              wende dich bitte an eine medizinische Fachperson. Im Notfall: 112.
            </p>
            <p className="mt-2 text-sm text-ink-body">
              Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte übernehmen wir keine Gewähr. Für Inhalte
              externer Links sind ausschließlich deren Betreiber verantwortlich.
            </p>
          </section>

          <p className="mt-10 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Stand: 2. Juli 2026
          </p>
        </article>
      </div>
    </main>
  )
}
