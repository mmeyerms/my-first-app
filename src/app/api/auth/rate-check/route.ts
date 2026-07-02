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
 * ⚠️  DEFENSE-IN-DEPTH ONLY, NOT AUTHORITATIVE ⚠️
 *
 * This is a VOLUNTARY client pre-flight. The browser calls this before
 * `supabase.auth.signInWithPassword()`. A determined attacker can:
 *   1. Skip this endpoint entirely and hit Supabase Auth's public URL
 *      directly.
 *   2. Rotate their IP address by cycling through open proxies.
 *
 * The REAL protection against brute-force here is Supabase Auth's built-in
 * rate limiting (docs: https://supabase.com/docs/guides/platform/going-into-
 * prod#security — "Rate limits"). This endpoint exists to:
 *   a. Show a friendly UX message to the user BEFORE Supabase blocks them
 *      server-side (Supabase returns a generic 429 without context).
 *   b. Raise the cost bar for naive scripted attackers who follow the same
 *      auth flow the browser does.
 *
 * For hard production-grade rate-limiting see Vercel Firewall / Upstash KV.
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
