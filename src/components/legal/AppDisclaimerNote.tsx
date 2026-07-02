import Link from 'next/link'
import { Info } from 'lucide-react'

/**
 * Kompakte Positionierungs-Notiz für sensible Kontexte (Onboarding, Auth).
 * Erklärt in einem Satz: MamaMap ist Lifestyle, nicht medizinisch. Plus
 * Deep-Link zu Datenschutz + Impressum.
 *
 * Rechtlich: dies ersetzt keine Consent-Checkbox — wenn wir später Zahlung
 * einführen, muss ein aktiver AGB-Consent hinzukommen. Für den derzeitigen
 * Beta-Betrieb reicht diese Positionierungs-Klarheit.
 */
interface Props {
  variant?: 'note' | 'footer'
  className?: string
}

export function AppDisclaimerNote({ variant = 'note', className = '' }: Props) {
  if (variant === 'footer') {
    return (
      <p className={`text-center text-[10px] leading-relaxed text-muted-foreground ${className}`}>
        MamaMap ist eine Lifestyle-App und ersetzt keine medizinische Beratung. Bei akuten Beschwerden 112 wählen oder eine
        Fachperson kontaktieren.{' '}
        <Link href="/impressum" className="text-primary hover:underline">Impressum</Link>
        {' · '}
        <Link href="/datenschutz" className="text-primary hover:underline">Datenschutz</Link>
      </p>
    )
  }

  return (
    <div className={`flex items-start gap-2 rounded-lg border border-dashed border-border bg-secondary/30 p-3 text-xs text-muted-foreground ${className}`}>
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-champagne" strokeWidth={1.5} aria-hidden="true" />
      <p className="flex-1 leading-relaxed">
        MamaMap begleitet dich strukturiert durch Schwangerschaft und Wochenbett — als Lifestyle-App, nicht als medizinische
        Beratung. Bei Beschwerden bitte an Hebamme oder Arzt wenden. Im Notfall: 112.{' '}
        <Link href="/impressum" className="text-primary hover:underline">Impressum</Link>
        {' · '}
        <Link href="/datenschutz" className="text-primary hover:underline">Datenschutz</Link>
      </p>
    </div>
  )
}
