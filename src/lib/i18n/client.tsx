'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from './types'
import { messages, type Messages } from './messages'

interface Ctx {
  locale: Locale
  setLocale: (l: Locale) => void
  t: Messages
}

const LocaleContext = createContext<Ctx>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: messages[DEFAULT_LOCALE],
})

function readClientLocale(): Locale | null {
  if (typeof document === 'undefined') return null

  // 1. Cookie
  try {
    const m = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`))
    const c = m?.[1]
    if (c) {
      const decoded = decodeURIComponent(c)
      if (isLocale(decoded)) return decoded
    }
  } catch {
    // fall through
  }

  // 2. localStorage
  try {
    const l = localStorage.getItem(LOCALE_COOKIE)
    if (isLocale(l)) return l
  } catch {
    // fall through
  }

  // 3. Browser language
  try {
    const nav = navigator.language?.split('-')[0]
    if (isLocale(nav)) return nav
  } catch {
    // fall through
  }

  return null
}

function writeLocaleSideEffects(l: Locale): void {
  try {
    document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
  } catch {
    // ignore
  }
  try {
    localStorage.setItem(LOCALE_COOKIE, l)
  } catch {
    // ignore
  }
  try {
    document.documentElement.lang = l
  } catch {
    // ignore
  }
}

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale
  children: React.ReactNode
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  useEffect(() => {
    const detected = readClientLocale()
    if (detected && detected !== locale) {
      setLocaleState(detected)
      writeLocaleSideEffects(detected)
    }
    // Run only on mount; intentionally exclude `locale`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    writeLocaleSideEffects(l)

    // Persist to profile if user is logged in, then reload so server
    // components (dashboard, page titles, etc.) pick up the new cookie.
    void fetch('/api/profile', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ locale: l }),
    })
      .catch(() => {
        // Anonymous users will get 401; that's fine
      })
      .finally(() => {
        try {
          window.location.reload()
        } catch {
          // ignore
        }
      })
  }, [])

  return (
    <LocaleContext.Provider
      value={{ locale, setLocale, t: messages[locale] ?? messages.de }}
    >
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): Ctx {
  return useContext(LocaleContext)
}

export function useT(): Messages {
  return useContext(LocaleContext).t
}
