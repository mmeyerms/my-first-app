import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

/**
 * Datenschutzerklärung — DSGVO Art. 13 Pflichtinformationen.
 * Enthält alle Auftragsverarbeiter die MamaMap aktuell einsetzt:
 * Supabase (DB+Auth+Storage), Resend (Mail), Web-Push (VAPID),
 * Vercel (Hosting). Ergänze weitere Dienste beim Einbinden.
 * Vor Public-Launch: Anwalt gegenlesen lassen.
 */
export default function DatenschutzPage() {
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
          <h1 className="font-display text-3xl font-medium text-foreground">Datenschutzerklärung</h1>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Informationen gemäß Art. 13, 14 DSGVO</p>

          <section className="mt-8">
            <h2 className="mb-2 font-display text-lg text-foreground">1. Verantwortlich</h2>
            <p className="text-sm text-ink-body">
              Maurice Meyer<br />
              Musterstraße 1, 12345 Musterstadt<br />
              E-Mail: <a href="mailto:hallo@mamamap.app" className="text-primary hover:underline">hallo@mamamap.app</a>
            </p>
          </section>

          <section className="mt-6">
            <h2 className="mb-2 font-display text-lg text-foreground">2. Welche Daten wir verarbeiten</h2>
            <p className="text-sm text-ink-body">Zur Bereitstellung der App verarbeiten wir:</p>
            <ul className="mt-2 space-y-1 pl-4 text-sm text-ink-body">
              <li>· <strong>Kontodaten</strong>: E-Mail-Adresse, verschlüsseltes Passwort, Vorname / gewählter Name</li>
              <li>· <strong>Profil</strong>: Geburtstermin, positiver Test-Datum, Baby-Name(n), Modus (planning/pregnant/sternenkind)</li>
              <li>· <strong>Reise-Inhalte</strong>: Tagebucheinträge, Termine, Geburtsplan-Antworten, Wochenbett-Anfragen</li>
              <li>· <strong>Fotos</strong> (freiwillig): Ultraschall- und Bauchfotos in privaten Storage-Buckets</li>
              <li>· <strong>Push-Endpunkte</strong> (freiwillig): eindeutige URL des Push-Providers, wenn du Push aktivierst</li>
              <li>· <strong>Technische Daten</strong>: IP-Adresse (pseudonymisiert nach 24h), Zeitpunkt der Nutzung</li>
            </ul>
          </section>

          <section className="mt-6">
            <h2 className="mb-2 font-display text-lg text-foreground">3. Rechtsgrundlage &amp; besondere Kategorien</h2>
            <p className="text-sm text-ink-body">
              Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) und Art. 6 Abs. 1 lit. a
              (Einwilligung, für optionale Features wie Push und Ultraschall-Fotos).
            </p>
            <p className="mt-2 text-sm text-ink-body">
              Schwangerschaftsdaten gelten als besondere personenbezogene Daten nach Art. 9 DSGVO. Ihre Verarbeitung erfolgt
              auf Grundlage deiner ausdrücklichen Einwilligung (Art. 9 Abs. 2 lit. a). Du kannst die Einwilligung jederzeit
              in deinen Profil-Einstellungen widerrufen und deinen Account inklusive aller Daten löschen.
            </p>
          </section>

          <section className="mt-6">
            <h2 className="mb-2 font-display text-lg text-foreground">4. Auftragsverarbeiter</h2>
            <p className="text-sm text-ink-body">Zur Bereitstellung der App nutzen wir folgende Dienste, mit denen jeweils ein Auftragsverarbeitungsvertrag (AVV) besteht:</p>
            <ul className="mt-2 space-y-2 text-sm text-ink-body">
              <li>
                · <strong>Supabase Inc.</strong> — Datenbank, Authentifizierung und Speicher, EU-Region (Frankfurt).
                Verarbeitet alle App-Daten. <a href="https://supabase.com/privacy" className="text-primary hover:underline" target="_blank" rel="noreferrer">Datenschutz</a>.
              </li>
              <li>
                · <strong>Vercel Inc.</strong> — Hosting und Auslieferung der Web-App. IP-Adressen werden in
                Zugriffs-Logs 30 Tage gespeichert. <a href="https://vercel.com/legal/privacy-policy" className="text-primary hover:underline" target="_blank" rel="noreferrer">Datenschutz</a>.
              </li>
              <li>
                · <strong>Resend</strong> — Transaktionale E-Mails (Login-Links, Partner-Einladungen, Wochenmail). <a href="https://resend.com/legal/privacy-policy" className="text-primary hover:underline" target="_blank" rel="noreferrer">Datenschutz</a>.
              </li>
              <li>
                · <strong>Web Push (Browser-Anbieter)</strong> — Wenn du Push aktivierst, wird ein anonymer
                Push-Endpunkt zu deinem Browser-Anbieter (Google, Mozilla, Apple) übertragen. Wir speichern nur den
                Endpunkt, keine personenbezogenen Push-Inhalte.
              </li>
            </ul>
          </section>

          <section className="mt-6">
            <h2 className="mb-2 font-display text-lg text-foreground">5. Cookies &amp; lokale Speicherung</h2>
            <p className="text-sm text-ink-body">
              MamaMap nutzt technisch notwendige Cookies für Login-Sessions. Es werden keine Marketing- oder Tracking-Cookies gesetzt.
              Deine Personalisierungs-Einstellungen (Theme, Sprache) werden im lokalen Speicher deines Browsers abgelegt.
            </p>
          </section>

          <section className="mt-6">
            <h2 className="mb-2 font-display text-lg text-foreground">6. Speicherdauer</h2>
            <p className="text-sm text-ink-body">
              Deine Daten bleiben gespeichert, solange dein Account besteht. Wenn du deinen Account löschst, werden alle Daten
              inklusive Ultraschall-Fotos und Tagebucheinträge binnen 30 Tagen aus unseren Systemen entfernt. IP-Adressen in
              Zugriffs-Logs werden nach 30 Tagen pseudonymisiert.
            </p>
          </section>

          <section className="mt-6">
            <h2 className="mb-2 font-display text-lg text-foreground">7. Deine Rechte</h2>
            <p className="text-sm text-ink-body">Du hast das Recht auf:</p>
            <ul className="mt-2 space-y-1 pl-4 text-sm text-ink-body">
              <li>· Auskunft über deine gespeicherten Daten (Art. 15 DSGVO)</li>
              <li>· Berichtigung unrichtiger Daten (Art. 16)</li>
              <li>· Löschung („Recht auf Vergessenwerden", Art. 17)</li>
              <li>· Einschränkung der Verarbeitung (Art. 18)</li>
              <li>· Datenübertragbarkeit (Art. 20)</li>
              <li>· Widerspruch gegen die Verarbeitung (Art. 21)</li>
              <li>· Widerruf einer erteilten Einwilligung (Art. 7 Abs. 3), wirkt für die Zukunft</li>
              <li>· Beschwerde bei der Aufsichtsbehörde (Art. 77)</li>
            </ul>
            <p className="mt-2 text-sm text-ink-body">
              Zur Ausübung genügt eine E-Mail an <a href="mailto:hallo@mamamap.app" className="text-primary hover:underline">hallo@mamamap.app</a>.
              Für Auskunft und Löschung sind auch die Funktionen in deinem Profil verfügbar.
            </p>
          </section>

          <section className="mt-6">
            <h2 className="mb-2 font-display text-lg text-foreground">8. Datensicherheit</h2>
            <p className="text-sm text-ink-body">
              Übertragung erfolgt ausschließlich verschlüsselt (HTTPS/TLS). Die Datenbank nutzt Row-Level-Security — deine
              Daten sind auf DB-Ebene gegen unautorisierten Zugriff geschützt. Passwörter werden mit bcrypt gehashed.
            </p>
          </section>

          <section className="mt-6">
            <h2 className="mb-2 font-display text-lg text-foreground">9. Änderungen</h2>
            <p className="text-sm text-ink-body">
              Wir passen diese Erklärung an geänderte Rechtslage und neue Funktionen an. Bei wesentlichen Änderungen
              informieren wir dich per E-Mail. Stand dieser Version: 2. Juli 2026.
            </p>
          </section>
        </article>
      </div>
    </main>
  )
}
