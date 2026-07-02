import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

const bodySchema = z.object({
  endpoint: z.string().url().max(2048),
  p256dh: z.string().min(1).max(500),
  auth: z.string().min(1).max(200),
  userAgent: z.string().max(500).optional(),
})

/**
 * POST /api/push/subscribe
 *
 * Upserts a Web Push subscription for the authenticated user. Because a
 * single browser may already have an active subscription with the same
 * endpoint from a previous session, we conflict on `endpoint` and update
 * `active=true`, `user_id`, `last_used_at` in place.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Ungültiges JSON' }, { status: 400 })
  }
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Ungültige Anfrage', details: parsed.error.flatten() }, { status: 400 })
  }

  const now = new Date().toISOString()
  const { error } = await supabase.from('push_subscriptions').upsert(
    {
      user_id: user.id,
      endpoint: parsed.data.endpoint,
      p256dh: parsed.data.p256dh,
      auth: parsed.data.auth,
      user_agent: parsed.data.userAgent ?? null,
      active: true,
      last_used_at: now,
    },
    { onConflict: 'endpoint' },
  )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
