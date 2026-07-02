import { NextRequest, NextResponse } from 'next/server'
import { sendPushToUser, isPushConfigured } from '@/lib/push/server'
import { getMessages } from '@/lib/i18n/messages'
import { mergePreferences, type UserPreferences } from '@/lib/preferences/types'

export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-dynamic'

interface TerminRow {
  id: string
  user_id: string
  title: string
  date: string
  time: string | null
  reminder_hours: number | null
  reminded_at: string | null
}

/**
 * Hourly cron. Finds pending termin reminders — those whose (date+time -
 * reminder_hours) has now passed but reminded_at is still NULL — and sends
 * a push. Marks reminded_at atomically to prevent double-fire.
 *
 * We compute the "reminder-due" cutoff in JS rather than SQL because the
 * time-of-day column is TEXT ('HH:MM'), not TIME — messy to add/subtract
 * from a DATE in a single expression.
 */
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  if (!isPushConfigured()) {
    return NextResponse.json({ ok: true, skipped: 'VAPID not configured' })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    return NextResponse.json({ ok: true, skipped: 'no service role key' })
  }

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(url, serviceKey)

  const now = new Date()
  // Load termine in the next 4 days that still have a pending reminder.
  // (72h max reminder_hours + 24h slack for late runs.)
  const inFourDays = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000)
  const isoToday = now.toISOString().slice(0, 10)
  const isoInFourDays = inFourDays.toISOString().slice(0, 10)

  const { data: rows } = await supabase
    .from('termine')
    .select('id, user_id, title, date, time, reminder_hours, reminded_at')
    .not('reminder_hours', 'is', null)
    .is('reminded_at', null)
    .eq('done', false)
    .gte('date', isoToday)
    .lte('date', isoInFourDays)
    .limit(2000)

  if (!rows || rows.length === 0) {
    return NextResponse.json({ ok: true, processed: 0 })
  }

  const termine = rows as TerminRow[]
  const userIds = Array.from(new Set(termine.map((t) => t.user_id)))

  const [{ data: prefRows }, { data: profileRows }] = await Promise.all([
    supabase.from('user_preferences').select('user_id, settings').in('user_id', userIds).limit(5000),
    supabase.from('profiles').select('user_id, locale').in('user_id', userIds).limit(5000),
  ])

  const prefsByUser = new Map<string, UserPreferences>()
  for (const row of prefRows ?? []) {
    const r = row as { user_id: string; settings: Partial<UserPreferences> | null }
    prefsByUser.set(r.user_id, mergePreferences(r.settings))
  }
  const localeByUser = new Map<string, 'de' | 'en'>()
  for (const row of profileRows ?? []) {
    const r = row as { user_id: string; locale?: string | null }
    localeByUser.set(r.user_id, r.locale === 'en' ? 'en' : 'de')
  }

  const nowMs = now.getTime()
  let sent = 0
  let skipped = 0

  for (const t of termine) {
    const prefs = prefsByUser.get(t.user_id) ?? mergePreferences(null)
    if (!prefs.notifications.push.terminReminder) { skipped++; continue }

    // Compose termin datetime. If no time, treat as 09:00 local — matches
    // the app default for all-day termine and stops us from firing at midnight.
    const timeStr = t.time && /^\d{2}:\d{2}$/.test(t.time) ? t.time : '09:00'
    const [year, month, day] = t.date.split('-').map(Number)
    const [hh, mm] = timeStr.split(':').map(Number)
    if (!year || !month || !day) { skipped++; continue }
    const terminMs = new Date(year, month - 1, day, hh, mm).getTime()
    const dueMs = terminMs - (t.reminder_hours ?? 0) * 60 * 60 * 1000
    if (dueMs > nowMs) { skipped++; continue }
    if (terminMs < nowMs) { skipped++; continue } // termin already past

    // Atomic reserve: only proceed if we can flip reminded_at from NULL.
    const { data: claimed } = await supabase
      .from('termine')
      .update({ reminded_at: new Date().toISOString() })
      .eq('id', t.id)
      .is('reminded_at', null)
      .select('id')
      .single()
    if (!claimed) { skipped++; continue }

    const locale = localeByUser.get(t.user_id) ?? 'de'
    const msgs = getMessages(locale)
    const push = msgs.settings.notifications.push
    const dateLabel = new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-US', {
      weekday: 'short', day: 'numeric', month: 'short',
    }).format(new Date(year, month - 1, day))
    const body = t.time
      ? push.cronTerminReminderBodyDateTime
          .replace('{date}', dateLabel)
          .replace('{time}', t.time)
      : push.cronTerminReminderBodyDate.replace('{date}', dateLabel)

    const result = await sendPushToUser(supabase, t.user_id, {
      title: push.cronTerminReminderTitle.replace('{title}', t.title),
      body,
      url: '/termine',
      tag: `termin-${t.id}`,
    })
    sent += result.sent
  }

  return NextResponse.json({ ok: true, processed: termine.length, sent, skipped })
}
