import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendPushToUser, isPushConfigured } from '@/lib/push/server'
import { getServerLocale } from '@/lib/i18n/server'
import { getMessages } from '@/lib/i18n/messages'

export const runtime = 'nodejs'

/**
 * POST /api/push/test
 *
 * Sends a test push to every active subscription of the authenticated
 * user. Used from the Notifications settings section to verify the setup
 * end-to-end after opt-in.
 */
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  if (!isPushConfigured()) {
    return NextResponse.json(
      { error: 'Push-Server nicht konfiguriert (VAPID Keys fehlen)' },
      { status: 503 },
    )
  }

  const locale = await getServerLocale()
  const t = getMessages(locale)
  const push = t.settings.notifications.push

  const result = await sendPushToUser(supabase, user.id, {
    title: push.testTitle,
    body: push.testBody,
    url: '/dashboard',
    tag: 'test',
  })

  return NextResponse.json({ ok: true, ...result })
}
