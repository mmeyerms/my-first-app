'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sparkles,
  Sprout,
  ScrollText,
  Sparkle,
  NotebookPen,
  CalendarDays,
  ShoppingBag,
  Briefcase,
  HandHeart,
  HeartHandshake,
  Palette,
  X,
  type LucideIcon,
} from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useT } from '@/lib/i18n/client'
import { useTheme } from '@/lib/theme/client'
import { cn } from '@/lib/utils'

interface AppTourProps {
  open: boolean
  userName: string
  onComplete: () => void
  onSkip: () => void
}

interface SlideMeta {
  /** Title text (with {name} placeholders already substituted). */
  title: string
  body: string
  cta?: { href: string; label: string }
  /** One or more lucide icons (used in editorial). */
  icons: LucideIcon[]
  /** One or more emojis (used in classic). */
  emojis: string[]
}

const FADE_MS = 180

export function AppTour({ open, userName, onComplete, onSkip }: AppTourProps) {
  const router = useRouter()

  function completeAndGo(href: string) {
    onComplete()
    setTimeout(() => router.push(href), 50)
  }

  const t = useT()
  const { theme } = useTheme()
  const isClassic = theme === 'classic'

  const [slideIdx, setSlideIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  // Reset to first slide whenever the modal is re-opened.
  useEffect(() => {
    if (open) {
      setSlideIdx(0)
      setVisible(true)
    }
  }, [open])

  const slides: SlideMeta[] = useMemo(() => {
    const tour = t.tour
    return [
      {
        title: tour.slide1.title.replace('{name}', userName),
        body: tour.slide1.body,
        icons: [Sparkles],
        emojis: ['🌸'],
      },
      {
        title: tour.slide2.title,
        body: tour.slide2.body,
        cta: { href: '/kinderwunsch', label: tour.slide2.cta },
        icons: [Sprout, ScrollText],
        emojis: ['🌷', '📋'],
      },
      {
        title: tour.slide3.title,
        body: tour.slide3.body,
        icons: [Sparkle, NotebookPen, CalendarDays],
        emojis: ['💡', '📔', '📅'],
      },
      {
        title: tour.slide4.title,
        body: tour.slide4.body,
        icons: [ShoppingBag, Briefcase, HandHeart],
        emojis: ['🛍️', '🏥', '💞'],
      },
      {
        title: tour.slide5.title,
        body: tour.slide5.body,
        icons: [HeartHandshake],
        emojis: ['💑'],
      },
      {
        title: tour.slide6.title,
        body: tour.slide6.body,
        cta: { href: '/profil', label: tour.slide6.cta },
        icons: [Palette],
        emojis: ['🎨'],
      },
      {
        title: tour.slide7.title,
        body: tour.slide7.body,
        icons: [Sparkles],
        emojis: ['💛'],
      },
    ]
  }, [t, userName])

  const total = slides.length
  const isFirst = slideIdx === 0
  const isLast = slideIdx === total - 1
  const slide = slides[slideIdx] ?? slides[0]

  function changeSlide(nextIdx: number) {
    if (nextIdx < 0 || nextIdx >= total) return
    setVisible(false)
    window.setTimeout(() => {
      setSlideIdx(nextIdx)
      setVisible(true)
    }, FADE_MS)
  }

  function handleNext() {
    if (isLast) {
      onComplete()
    } else {
      changeSlide(slideIdx + 1)
    }
  }

  function handleBack() {
    if (!isFirst) changeSlide(slideIdx - 1)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onSkip()
      }}
    >
      <DialogContent
        className={cn(
          'max-w-md gap-0 overflow-hidden border-border bg-card p-0 shadow-xl',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          // On mobile: full-screen-ish; rounded only on bigger screens
          'h-[100dvh] max-h-[100dvh] w-screen rounded-none sm:h-auto sm:max-h-[92vh] sm:w-full sm:rounded-2xl',
        )}
        onInteractOutside={(e) => {
          // Allow the default behaviour: openChange(false) -> onSkip.
          // We just keep the event flowing.
          void e
        }}
      >
        {/* Hidden a11y title/description (DialogContent requires DialogTitle for screen readers) */}
        <DialogTitle className="sr-only">{slide.title}</DialogTitle>
        <DialogDescription className="sr-only">{slide.body}</DialogDescription>

        {/* Skip button (top-right) */}
        <button
          type="button"
          onClick={onSkip}
          aria-label={t.tour.closeAria}
          className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span>{t.tour.skip}</span>
          <X className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
        </button>

        <div className="flex h-full flex-col">
          {/* Decorative top band */}
          <div
            aria-hidden="true"
            className={cn(
              'h-24 w-full shrink-0 sm:h-28',
              isClassic
                ? 'bg-gradient-to-br from-primary/20 via-secondary to-accent/30'
                : 'bg-gradient-to-br from-secondary via-secondary/70 to-accent/20',
            )}
          />

          {/* Slide content area */}
          <div className="relative flex flex-1 flex-col px-6 pb-6 pt-0 sm:px-8 sm:pb-8">
            {/* Icon/emoji row — pulled up over the band */}
            <div
              className={cn(
                '-mt-10 mb-6 flex items-center justify-center gap-3 transition-all duration-200',
                visible ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0',
              )}
              aria-hidden="true"
            >
              <SlideIcons slide={slide} isClassic={isClassic} />
            </div>

            {/* Title + body — fade transition */}
            <div
              className={cn(
                'flex-1 transition-opacity duration-200',
                visible ? 'opacity-100' : 'opacity-0',
              )}
            >
              <h2
                className={cn(
                  'text-balance text-center text-foreground',
                  isClassic
                    ? 'text-2xl font-semibold leading-tight'
                    : 'font-display text-3xl font-medium leading-tight',
                )}
              >
                {slide.title}
              </h2>
              <p
                className={cn(
                  'mt-4 text-pretty text-center leading-relaxed text-muted-foreground',
                  isClassic ? 'text-base' : 'font-display text-base italic',
                )}
              >
                {slide.body}
              </p>

              {slide.cta && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => slide.cta && completeAndGo(slide.cta.href)}
                    className={cn(
                      'inline-flex items-center justify-center rounded-full border border-primary/30 bg-secondary/60 px-4 py-2 text-sm font-medium text-primary shadow-sm transition-all hover:-translate-y-0.5 hover:bg-secondary hover:shadow',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card',
                    )}
                  >
                    {slide.cta.label}
                  </button>
                </div>
              )}
            </div>

            {/* Footer: progress dots + nav buttons */}
            <div className="mt-8 space-y-5">
              <ProgressDots
                total={total}
                current={slideIdx}
                onSelect={(i) => changeSlide(i)}
                progressLabel={t.tour.progress
                  .replace('{current}', String(slideIdx + 1))
                  .replace('{total}', String(total))}
              />

              <div className="flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  disabled={isFirst}
                  className={cn(
                    'min-w-[5rem] text-muted-foreground hover:text-foreground',
                    isFirst && 'invisible',
                  )}
                >
                  {t.tour.back}
                </Button>

                <Button
                  type="button"
                  onClick={handleNext}
                  size="sm"
                  className="min-w-[10rem] rounded-full px-6"
                >
                  {isLast ? t.tour.start : t.tour.next}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function SlideIcons({
  slide,
  isClassic,
}: {
  slide: SlideMeta
  isClassic: boolean
}): ReactNode {
  if (isClassic) {
    return (
      <>
        {slide.emojis.map((e, i) => (
          <span
            key={`${e}-${i}`}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card text-3xl shadow-sm ring-1 ring-border/60"
          >
            {e}
          </span>
        ))}
      </>
    )
  }
  return (
    <>
      {slide.icons.map((Icon, i) => (
        <span
          key={i}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card text-primary shadow-sm ring-1 ring-border/60"
        >
          <Icon className="h-6 w-6" strokeWidth={1.5} />
        </span>
      ))}
    </>
  )
}

function ProgressDots({
  total,
  current,
  onSelect,
  progressLabel,
}: {
  total: number
  current: number
  onSelect: (i: number) => void
  progressLabel: string
}) {
  return (
    <div
      role="tablist"
      aria-label={progressLabel}
      className="flex items-center justify-center gap-1.5"
    >
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === current
        return (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`${i + 1} / ${total}`}
            onClick={() => onSelect(i)}
            className={cn(
              'h-1.5 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card',
              isActive ? 'w-6 bg-primary' : 'w-1.5 bg-border hover:bg-muted-foreground/40',
            )}
          />
        )
      })}
      <span className="sr-only">{progressLabel}</span>
    </div>
  )
}
