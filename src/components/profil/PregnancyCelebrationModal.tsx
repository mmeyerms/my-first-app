'use client'

import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Sparkles,
  ScrollText,
  CalendarDays,
  NotebookPen,
  ShoppingBag,
} from 'lucide-react'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  babyName?: string | null
}

const UNLOCKED = [
  { Icon: ScrollText, key: 'geburtsplan', label: 'Geburtsplan', href: '/geburtsplan' },
  { Icon: Sparkles, key: 'tipps', label: 'Tägliche Tipps', href: '/tipps' },
  { Icon: NotebookPen, key: 'tagebuch', label: 'Schwangerschafts-Tagebuch', href: '/tagebuch' },
  { Icon: CalendarDays, key: 'termine', label: 'Termine-Kalender', href: '/termine' },
  { Icon: ShoppingBag, key: 'listen', label: 'Baby-Ausstattung & Kliniktasche', href: '/einkaufsliste' },
]

export function PregnancyCelebrationModal({ open, onOpenChange, babyName }: Props) {
  const router = useRouter()

  function goTo(href: string) {
    onOpenChange(false)
    // Small delay so Dialog can close before navigation to avoid focus/scroll conflicts
    setTimeout(() => {
      router.push(href)
    }, 50)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <span className="text-5xl" aria-hidden="true">🌸</span>
          </div>
          <DialogTitle className="text-center font-display text-2xl font-medium">
            Herzlichen Glückwunsch!
          </DialogTitle>
        </DialogHeader>

        <p className="text-center text-sm leading-relaxed text-muted-foreground">
          {babyName ? (
            <>
              Wie schön — <span className="font-semibold text-foreground">{babyName}</span> ist auf dem Weg.
              Wir begleiten euch ab jetzt Woche für Woche.
            </>
          ) : (
            <>
              Wie schön — dein Baby ist auf dem Weg. Wir begleiten euch ab jetzt Woche für Woche.
            </>
          )}
        </p>

        <div className="mt-3 rounded-2xl border border-primary/15 bg-secondary/50 p-4">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-primary">
            Ab jetzt für dich freigeschaltet
          </p>
          <ul className="space-y-2.5">
            {UNLOCKED.map(({ Icon, key, label }) => (
              <li key={key} className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-card">
                  <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="text-sm text-foreground">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-center text-xs italic text-muted-foreground">
          Alles findest du übersichtlich im Dashboard — kein Druck, alles in deinem Tempo.
        </p>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button type="button" className="w-full" onClick={() => goTo('/dashboard')}>
            Zum Dashboard →
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full border-primary/20 text-primary"
            onClick={() => goTo('/geburtsplan')}
          >
            Direkt zum Geburtsplan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
