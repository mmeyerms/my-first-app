'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { PERMISSION_SLIPS } from '@/lib/kinderwunsch/permissionSlips'
import { ANTI_ANGST_KARTEN } from '@/lib/kinderwunsch/antiAngstKarten'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const FAV_STORAGE_KEY = 'mamamap-kw-aengste-fav'
const READ_STORAGE_KEY = 'mamamap-kw-aengste-read'

export function AengsteView() {
  const [hydrated, setHydrated] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [readCards, setReadCards] = useState<Set<string>>(new Set())
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    try {
      const rawFav = localStorage.getItem(FAV_STORAGE_KEY)
      if (rawFav) {
        const parsed = JSON.parse(rawFav) as string[]
        if (Array.isArray(parsed)) setFavorites(new Set(parsed))
      }
      const rawRead = localStorage.getItem(READ_STORAGE_KEY)
      if (rawRead) {
        const parsed = JSON.parse(rawRead) as string[]
        if (Array.isArray(parsed)) setReadCards(new Set(parsed))
      }
    } catch {
      // ignore parse errors
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(Array.from(favorites)))
    } catch {
      // ignore quota errors
    }
  }, [favorites, hydrated])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(Array.from(readCards)))
    } catch {
      // ignore quota errors
    }
  }, [readCards, hydrated])

  const slips = PERMISSION_SLIPS
  const currentSlip = slips[currentIndex]
  const isFav = favorites.has(currentSlip.id)

  function toggleFavorite() {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(currentSlip.id)) {
        next.delete(currentSlip.id)
      } else {
        next.add(currentSlip.id)
      }
      return next
    })
  }

  function nextSlip() {
    setCurrentIndex((i) => (i + 1) % slips.length)
  }

  function prevSlip() {
    setCurrentIndex((i) => (i - 1 + slips.length) % slips.length)
  }

  function toggleExpanded(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
        setReadCards((readPrev) => {
          const readNext = new Set(readPrev)
          readNext.add(id)
          return readNext
        })
      }
      return next
    })
  }

  return (
    <Tabs defaultValue="permission" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-rose-100">
        <TabsTrigger
          value="permission"
          className="data-[state=active]:bg-white data-[state=active]:text-rose-700"
        >
          Erlaubniskarten
        </TabsTrigger>
        <TabsTrigger
          value="facts"
          className="data-[state=active]:bg-white data-[state=active]:text-rose-700"
        >
          Sorgen & Fakten
        </TabsTrigger>
      </TabsList>

      {/* Tab 1 — Permission slips */}
      <TabsContent value="permission" className="mt-4">
        <section aria-label="Erlaubniskarten" className="space-y-4">
          {/* Card */}
          <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100 p-8 shadow-sm ring-1 ring-rose-200">
            <div className="flex flex-col items-center text-center">
              <span className="mb-4 text-6xl" aria-hidden="true">
                {currentSlip.emoji}
              </span>
              <h2 className="mb-3 text-xl font-bold text-rose-900">
                {currentSlip.title}
              </h2>
              <p className="text-sm leading-relaxed text-gray-700">
                {currentSlip.body}
              </p>
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFavorite}
                className={
                  isFav
                    ? 'text-rose-600 hover:bg-rose-100 hover:text-rose-700'
                    : 'text-gray-500 hover:bg-rose-100 hover:text-rose-700'
                }
                aria-pressed={isFav}
                aria-label={isFav ? 'Aus Favoriten entfernen' : 'Diese Karte merken'}
              >
                {isFav ? '♥ Gemerkt' : '♡ Diese merken'}
              </Button>
            </div>
          </div>

          {/* Navigation: dots */}
          <div className="flex items-center justify-center gap-1.5" role="tablist" aria-label="Karte auswählen">
            {slips.map((slip, idx) => (
              <button
                key={slip.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Karte ${idx + 1} von ${slips.length}`}
                aria-current={idx === currentIndex}
                className={`h-2 w-2 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-rose-500' : 'bg-rose-200'
                }`}
              />
            ))}
          </div>

          {/* Navigation: arrows */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlip}
              className="border-rose-200 text-rose-700 hover:bg-rose-50"
              aria-label="Vorherige Karte"
            >
              <ChevronLeft className="h-4 w-4" />
              Zurück
            </Button>
            <span className="text-xs text-gray-500">
              {currentIndex + 1} / {slips.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={nextSlip}
              className="border-rose-200 text-rose-700 hover:bg-rose-50"
              aria-label="Nächste Karte"
            >
              Weiter
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Favorited count */}
          <p className="text-center text-xs text-gray-500" aria-live="polite">
            {hydrated ? `${favorites.size} gemerkt` : '—'}
          </p>
        </section>
      </TabsContent>

      {/* Tab 2 — Worries & Facts */}
      <TabsContent value="facts" className="mt-4">
        <section aria-label="Sorgen und Fakten" className="space-y-3">
          <p className="text-xs text-gray-600">
            Tippe auf eine Sorge — dahinter findest du Fakten, die beruhigen.
          </p>
          {ANTI_ANGST_KARTEN.map((karte) => {
            const isOpen = expanded.has(karte.id)
            const isRead = readCards.has(karte.id)
            return (
              <div
                key={karte.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleExpanded(karte.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start gap-3 px-4 py-4 text-left"
                >
                  <span className="text-2xl" aria-hidden="true">
                    {karte.emoji}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-snug text-gray-800">
                      {karte.fear}
                    </p>
                    {isRead && !isOpen && (
                      <Badge
                        variant="secondary"
                        className="mt-2 bg-green-100 text-xs text-green-700 hover:bg-green-100"
                      >
                        ✓ gelesen
                      </Badge>
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-blue-100 bg-blue-50 px-4 py-4">
                    <p className="text-sm leading-relaxed text-blue-900">
                      {karte.fact}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </section>
      </TabsContent>
    </Tabs>
  )
}
