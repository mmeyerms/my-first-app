'use client'

import { useEffect } from 'react'
import { usePreferences } from '@/lib/preferences/client'

/**
 * Syncs prefs (accent color + font size) to <html data-*> attributes
 * so CSS variables in globals.css react without a full page reload.
 */
export function PreferencesEffects() {
  const { prefs } = usePreferences()
  useEffect(() => {
    try {
      document.documentElement.dataset.accent = prefs.accentColor
      document.documentElement.dataset.fontsize = prefs.fontSize
    } catch {
      // ignore
    }
  }, [prefs.accentColor, prefs.fontSize])
  return null
}
