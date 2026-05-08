import { cookies } from 'next/headers'
import { DEFAULT_THEME, THEME_COOKIE, isTheme, type Theme } from './types'

export async function getServerTheme(): Promise<Theme> {
  try {
    const c = await cookies()
    const v = c.get(THEME_COOKIE)?.value
    return isTheme(v) ? v : DEFAULT_THEME
  } catch {
    return DEFAULT_THEME
  }
}
