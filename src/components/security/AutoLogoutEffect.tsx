'use client'

import { useEffect } from 'react'
import { usePreferences } from '@/lib/preferences/client'
import { createClient } from '@/lib/supabase/client'

/**
 * AutoLogoutEffect — invisible effect component.
 *
 * When `prefs.security.autoLogoutMinutes` is a positive integer we register
 * a suite of activity listeners (mousemove, keydown, touchstart, scroll,
 * focus). Every event resets a rolling timer; when the timer expires we
 * call `supabase.auth.signOut()` and hard-redirect the browser to /login.
 *
 * When the setting is `null` we skip the whole side-effect so no timers
 * are created.
 *
 * The component renders nothing.
 */
export function AutoLogoutEffect() {
  const { prefs } = usePreferences()
  const minutes = prefs.security?.autoLogoutMinutes ?? null

  useEffect(() => {
    if (!minutes || typeof window === 'undefined') return

    const ms = minutes * 60 * 1000
    let timer: ReturnType<typeof setTimeout> | null = null

    const logout = async () => {
      try {
        await createClient().auth.signOut()
      } catch {
        // even if sign-out fails, force navigation to /login so the
        // session cookie is discarded on the next protected page load.
      }
      window.location.href = '/login'
    }

    const reset = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        void logout()
      }, ms)
    }

    const events: Array<keyof WindowEventMap> = [
      'mousemove',
      'keydown',
      'touchstart',
      'scroll',
      'focus',
    ]
    for (const ev of events) {
      window.addEventListener(ev, reset, { passive: true })
    }

    reset()

    return () => {
      if (timer) clearTimeout(timer)
      for (const ev of events) {
        window.removeEventListener(ev, reset)
      }
    }
  }, [minutes])

  return null
}

export default AutoLogoutEffect
