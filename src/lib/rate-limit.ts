/**
 * Simple in-memory sliding-window rate limiter.
 *
 * ⚠️  DEFENSE-IN-DEPTH ONLY, NOT AUTHORITATIVE ⚠️
 *
 * Fundamental limitations you must know about:
 *   1. In-memory state per serverless instance. Vercel spawns fresh instances
 *      per cold-start; a warm pool of 5 instances effectively multiplies the
 *      limit by 5. On production, an attacker distributing requests across
 *      instances will bypass this trivially.
 *   2. This runs INSIDE the app, so it cannot protect against attacks that
 *      bypass the app (e.g. direct hits to Supabase Auth URLs). For login/
 *      register brute-force, Supabase Auth's built-in rate limiting is the
 *      real gate; this pre-flight only slows down naive attackers.
 *
 * The real production stack for hard rate-limiting is:
 *   - Supabase Auth built-in throttling (login/register/oauth)
 *   - Vercel Firewall / Rate-Limit rules at the CDN edge
 *   - Upstash Redis or Vercel KV for shared state across instances
 *
 * This module remains useful as:
 *   - Development-mode brute-force protection
 *   - A friendly UX message BEFORE Supabase blocks the user server-side
 *   - Slowing down naïve scripted attackers (raises the cost bar)
 *
 * Nutzung:
 *   const result = rateLimit('login:1.2.3.4', { window: 60_000, max: 10 })
 *   if (!result.allowed) return NextResponse.json({ error: 'Rate limit' }, {
 *     status: 429, headers: { 'Retry-After': String(result.retryAfter) },
 *   })
 */

interface RateLimitOptions {
  /** Fenstergrösse in Millisekunden. */
  window: number
  /** Maximale Anzahl Requests pro Fenster. */
  max: number
}

export interface RateLimitResult {
  allowed: boolean
  /** Sekunden bis zum nächsten erlaubten Request (nur gesetzt, wenn allowed=false). */
  retryAfter?: number
}

// Hard cap to prevent unbounded growth (DoS via random keys). LRU-style:
// when the map exceeds MAX_KEYS, we drop the oldest 20 % of entries.
const MAX_KEYS = 10_000
const buckets = new Map<string, number[]>()

function evictIfNeeded(): void {
  if (buckets.size <= MAX_KEYS) return
  const dropCount = Math.floor(MAX_KEYS * 0.2)
  let dropped = 0
  for (const key of buckets.keys()) {
    if (dropped >= dropCount) break
    buckets.delete(key)
    dropped++
  }
}

/** Alte Einträge vor `cutoff` entfernen. */
function prune(timestamps: number[], cutoff: number): number[] {
  let firstValid = 0
  while (firstValid < timestamps.length && timestamps[firstValid] < cutoff) {
    firstValid++
  }
  return firstValid === 0 ? timestamps : timestamps.slice(firstValid)
}

export function rateLimit(key: string, opts: RateLimitOptions): RateLimitResult {
  if (!key || opts.window <= 0 || opts.max <= 0) {
    return { allowed: true }
  }
  const now = Date.now()
  const cutoff = now - opts.window
  const existing = buckets.get(key) ?? []
  const pruned = prune(existing, cutoff)

  if (pruned.length >= opts.max) {
    const oldest = pruned[0] ?? now
    const retryAfterMs = Math.max(0, oldest + opts.window - now)
    buckets.set(key, pruned)
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil(retryAfterMs / 1000)),
    }
  }

  pruned.push(now)
  buckets.set(key, pruned)
  evictIfNeeded()
  return { allowed: true }
}

/**
 * Extract a client IP from the request headers with attacker-resistant precedence.
 *
 * Trust order (most-trusted first):
 *   1. `x-vercel-forwarded-for` — set by Vercel Edge, cannot be spoofed by the client.
 *   2. `x-real-ip` — set by many proxies (also Vercel), same trust level.
 *   3. `x-forwarded-for` — attacker-influenced! Take RIGHTMOST hop because the
 *      leftmost is whatever the client sent; each proxy in the chain APPENDS
 *      the previous hop's address. The rightmost is the last proxy talking
 *      to us, which is trusted infrastructure.
 *
 * We NEVER trust the leftmost `x-forwarded-for` value — that's the original
 * client-supplied header content and is fully attacker-controllable.
 */
export function getClientIp(req: { headers: Headers }): string {
  const vercel = req.headers.get('x-vercel-forwarded-for')?.trim()
  if (vercel) return vercel.split(',').pop()?.trim() || vercel

  const real = req.headers.get('x-real-ip')?.trim()
  if (real) return real

  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) {
    // RIGHTMOST hop — last trusted proxy address.
    const parts = fwd.split(',').map((p) => p.trim()).filter(Boolean)
    if (parts.length > 0) return parts[parts.length - 1]
  }
  return 'unknown'
}

/** Reset internal state — TEST ONLY. Do not call in application code. */
export function __resetRateLimitForTests(): void {
  buckets.clear()
}
