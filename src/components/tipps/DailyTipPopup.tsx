'use client'

import { useEffect, useState } from 'react'
import { Tip, getTipText, getTipDetail, getCategoryLabel } from '@/lib/tips'
import { useLocale } from '@/lib/i18n/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const STORAGE_KEY = 'mamamap_tip_shown'

interface Props {
  tip: Tip
  ssw: number
}

export function DailyTipPopup({ tip, ssw }: Props) {
  const [open, setOpen] = useState(false)
  const { locale } = useLocale()
  const categoryLabel = getCategoryLabel(tip.category, locale)
  const detailText = getTipDetail(tip, locale)

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== today) {
      setOpen(true)
    }
  }, [])

  function handleClose() {
    const today = new Date().toISOString().split('T')[0]
    localStorage.setItem(STORAGE_KEY, today)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose() }}>
      <DialogContent className="max-w-sm rounded-2xl p-0 overflow-hidden">
        <div className="bg-rose-500 px-6 pt-6 pb-4 text-white">
          <DialogHeader>
            <p className="text-xs font-medium text-rose-100 mb-1">Dein Tipp für heute · SSW {ssw}</p>
            <DialogTitle className="text-lg font-bold text-white leading-snug">
              {tip.emoji} {categoryLabel}
            </DialogTitle>
          </DialogHeader>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-gray-700">{getTipText(tip, locale)}</p>
            {detailText && (
              <p className="text-xs leading-relaxed text-gray-500">{detailText}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs capitalize">{categoryLabel}</Badge>
            <Button onClick={handleClose} size="sm" className="px-5">
              Verstanden 🌸
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
