'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { DEFAULT_PREFERENCES, mergePreferences, type UserPreferences } from './types'

interface Ctx {
  prefs: UserPreferences
  update: (patch: Partial<UserPreferences>) => Promise<void>
  loading: boolean
}

const PreferencesContext = createContext<Ctx>({
  prefs: DEFAULT_PREFERENCES,
  update: async () => {},
  loading: false,
})

export function PreferencesProvider({
  initialPrefs,
  children,
}: {
  initialPrefs?: UserPreferences | null
  children: React.ReactNode
}) {
  const [prefs, setPrefs] = useState<UserPreferences>(
    mergePreferences(initialPrefs ?? undefined),
  )
  const [loading, setLoading] = useState(!initialPrefs)

  useEffect(() => {
    if (initialPrefs) return
    let cancelled = false
    fetch('/api/preferences')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return
        setPrefs(mergePreferences(data as Partial<UserPreferences>))
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [initialPrefs])

  const update = useCallback(async (patch: Partial<UserPreferences>) => {
    setPrefs((prev) => mergePreferences({ ...prev, ...patch }))
    try {
      const res = await fetch('/api/preferences', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(patch),
      })
      if (res.ok) {
        const data = await res.json()
        setPrefs(mergePreferences(data as Partial<UserPreferences>))
      }
    } catch {
      // optimistic update stays; user sees change locally
    }
  }, [])

  return (
    <PreferencesContext.Provider value={{ prefs, update, loading }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences(): Ctx {
  return useContext(PreferencesContext)
}
