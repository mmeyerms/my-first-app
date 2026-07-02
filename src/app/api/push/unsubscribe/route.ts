import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

const bodySchema = z.object({
  endpoint: z.string().url().max(2048),
})

/**
 * POST /api/push/unsubscribe
 *
 * Marks the caller's subscription with this endpoint as inactive. We do NOT
 * delete the row — leaving `active=false` preserves audit history and
 * prevents accidental re-subscription for spam campaigns.
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
    return NextResponse.json({ error: 'Ungültige Anfrage' }, { status: 400 })
  }

  await supabase
    .from('push_subscriptions')
    .update({ active: false })
    .eq('endpoint', parsed.data.endpoint)
    .eq('user_id', user.id)

  return NextResponse.json({ ok: true })
}
