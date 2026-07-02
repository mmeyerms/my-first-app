import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export const runtime = 'nodejs'

const bodySchema = z.object({
  bucket: z.enum(['login', 'register']),
})

const HOUR_MS = 60 * 60 * 1000
const MAX_PER_HOUR = 10

/**
 * POST /api/auth/rate-check
 *
 * Wird VOR jedem Supabase-Login-/Register-Attempt vom Client aufgerufen,
 * damit wir Brute-Force serverseitig limitieren können (Supabase-Auth
 * läuft direkt vom Client aus und ist daher an unserer API vorbei).
 *
 * Limit: 10 Requests pro Stunde pro IP + Bucket.
 * Response:
 *   200 { ok: true }          — allowed
 *   429 { error, retryAfter } — geblockt
 */
export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Ungültiges JSON' }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Ungültige Anfrage', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const ip = getClientIp(request)
  const key = `${parsed.data.bucket}:${ip}`
  const result = rateLimit(key, { window: HOUR_MS, max: MAX_PER_HOUR })

  if (!result.allowed) {
    return NextResponse.json(
      {
        error: 'Zu viele Versuche — bitte in einer Stunde erneut versuchen.',
        retryAfter: result.retryAfter,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(result.retryAfter ?? 3600) },
      },
    )
  }

  return NextResponse.json({ ok: true })
}
