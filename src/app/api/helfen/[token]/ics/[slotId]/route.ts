import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export const runtime = 'nodejs'

const slotIdSchema = z.string().uuid()

interface SlotRow {
  id: string
  category: string
  description: string | null
  date: string | null
  time: string | null
  helper_name: string | null
}

/**
 * Escape a text value for iCalendar (RFC 5545 §3.3.11):
 *   backslash, semicolon, comma → escape; newlines → \n literal
 */
function icsEscape(v: string): string {
  return v.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')
}

/**
 * GET /api/helfen/[token]/ics/[slotId]
 *
 * Public endpoint — helpers do not need to be signed in to download an
 * .ics file for the slot they just claimed. The Wochenbett-Chef share
 * token gates access; anyone with the token can see slots anyway.
 *
 * Only slots with a resolvable date are exportable. Slots without a date
 * return 404 (nothing to put in DTSTART).
 *
 * Rate-limited to 20 downloads per IP per minute — enough for retry
 * fumbles, low enough to blunt scraping.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string; slotId: string }> },
) {
  const ip = getClientIp(request)
  const rate = rateLimit(`helfen-ics:${ip}`, { window: 60_000, max: 20 })
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Zu viele Anfragen' }, {
      status: 429,
      headers: { 'Retry-After': String(rate.retryAfter ?? 60) },
    })
  }

  const { token, slotId } = await params
  if (!token || typeof token !== 'string' || token.length < 16) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
  }
  const slotResult = slotIdSchema.safeParse(slotId)
  if (!slotResult.success) {
    return NextResponse.json({ error: 'Invalid slot' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data: req } = await supabase
    .from('help_requests')
    .select('id, title')
    .eq('share_token', token)
    .limit(1)
    .single()
  if (!req) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const requestId = (req as { id: string; title: string | null }).id
  const requestTitle = (req as { title: string | null }).title ?? 'Wochenbett-Chef'

  const { data: slot } = await supabase
    .from('help_slots')
    .select('id, category, description, date, time, helper_name')
    .eq('id', slotResult.data)
    .eq('request_id', requestId)
    .limit(1)
    .single()

  if (!slot) return NextResponse.json({ error: 'Slot not found' }, { status: 404 })
  const s = slot as SlotRow
  if (!s.date) {
    return NextResponse.json({ error: 'Slot has no date' }, { status: 404 })
  }

  const [year, month, day] = s.date.split('-').map(Number)
  const [hh, mm] = (s.time && /^\d{2}:\d{2}$/.test(s.time) ? s.time : '10:00').split(':').map(Number)
  if (!year || !month || !day) {
    return NextResponse.json({ error: 'Invalid date' }, { status: 500 })
  }

  const dtStart = new Date(Date.UTC(year, month - 1, day, hh, mm))
  const dtEnd = new Date(dtStart.getTime() + 60 * 60 * 1000) // Default 1h duration

  function fmt(d: Date): string {
    // YYYYMMDDTHHMMSSZ per RFC 5545 for UTC datetimes.
    const p = (n: number) => String(n).padStart(2, '0')
    return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}T${p(d.getUTCHours())}${p(d.getUTCMinutes())}00Z`
  }

  const summary = s.description?.trim() || `${requestTitle} — ${s.category}`
  const description = [
    s.description ? `${s.description}` : '',
    s.helper_name ? `Helfer:in: ${s.helper_name}` : '',
  ].filter(Boolean).join('\n')

  const uid = `mamamap-slot-${s.id}@mamamap.app`
  const dtStamp = fmt(new Date())

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MamaMap//Wochenbett-Chef//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${fmt(dtStart)}`,
    `DTEND:${fmt(dtEnd)}`,
    `SUMMARY:${icsEscape(summary)}`,
    description ? `DESCRIPTION:${icsEscape(description)}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n')

  return new NextResponse(ics, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="mamamap-${s.id.slice(0, 8)}.ics"`,
      'Cache-Control': 'private, max-age=60',
    },
  })
}
