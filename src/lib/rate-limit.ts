/**
 * Simple in-memory sliding-window rate limiter.
 *
 * Serverless-Instances haben separate Zähler — ausreichend fuer Basic-Brute-Force-Schutz,
 * nicht fuer verteilte Angriffe. Fuer Production-Grade: Upstash Redis oder Vercel KV.
 *
 * Nutzung:
 *   const result = rateLimit('login:1.2.3.4', { window: 60_000, max: 10 })
 *   if (!result.allowed) {
 *     return NextResponse.json(
 *       { error: 'Rate limit' },
 *       { status: 429, headers: { 'Retry-After': String(result.retryAfter) } },
 *     )
 *   }
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

const buckets = new Map<string, number[]>()

/** Alte Einträge vor `cutoff` entfernen. */
function prune(timestamps: number[], cutoff: number): number[] {
  // Timestamps sind chronologisch: erst-suche nach dem ersten gültigen Index.
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
  return { allowed: true }
}

/**
 * Extract a stable client IP from the request headers.
 * `x-forwarded-for` may contain a comma-separated chain; we take the leftmost entry.
 */
export function getClientIp(req: { headers: Headers }): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) {
    const first = fwd.split(',')[0]?.trim()
    if (first) return first
  }
  const real = req.headers.get('x-real-ip')
  if (real) return real.trim()
  return 'unknown'
}

/**
 * Reset internal state — TEST ONLY.
 * Do not call in application code.
 */
export function __resetRateLimitForTests(): void {
  buckets.clear()
}
