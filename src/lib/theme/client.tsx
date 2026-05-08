'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { DEFAULT_THEME, THEME_COOKIE, isTheme, type Theme } from './types'

interface Ctx {
  theme: Theme
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<Ctx>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
})

function readClientTheme(): Theme {
  if (typeof document === 'undefined') return DEFAULT_THEME
  try {
    const m = document.cookie.match(new RegExp(`(?:^|; )${THEME_COOKIE}=([^;]*)`))
    const c = m?.[1]
    if (c) {
      const decoded = decodeURIComponent(c)
      if (isTheme(decoded)) return decoded
    }
  } catch {
    // fall through
  }
  return DEFAULT_THEME
}

export function ThemeProvider({
  initialTheme,
  children,
}: {
  initialTheme: Theme
  children: React.ReactNode
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme)

  useEffect(() => {
    const detected = readClientTheme()
    if (detected !== theme) {
      setThemeState(detected)
      try {
        document.documentElement.dataset.theme = detected
      } catch {
        // ignore
      }
    }
    // Run only on mount; intentionally exclude `theme`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    try {
      document.cookie = `${THEME_COOKIE}=${t}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
    } catch {
      // ignore
    }
    try {
      document.documentElement.dataset.theme = t
    } catch {
      // ignore
    }
    // Force a refresh so server components re-render with the new theme
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): Ctx {
  return useContext(ThemeContext)
}
