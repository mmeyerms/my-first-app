import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { DEFAULT_PREFERENCES, mergePreferences, type UserPreferences } from '@/lib/preferences/types'

const accentColor = z.enum(['burgundy', 'rose', 'sage', 'blue'])
const fontSize = z.enum(['sm', 'md', 'lg'])
const greetingTone = z.enum(['warm', 'sachlich', 'locker', 'liebevoll'])
const snapshotDensity = z.enum(['compact', 'expanded'])
const snapshotCardKey = z.enum(['nextTermin', 'ssw', 'tipp', 'tagebuch', 'countdown', 'wochenbettChef', 'sternzeichen'])
const wocheProgressStyle = z.enum(['bar', 'percent', 'weeksLeft', 'none'])
const wocheBlockKey = z.enum(['development', 'comparisons', 'momBody', 'funFact', 'partnerTip', 'nextWeek'])
const wocheComparisonCategory = z.enum(['frucht', 'suessigkeit', 'spielzeug', 'tier', 'alltag', 'sport', 'beauty'])
const partnerRole = z.enum(['partner', 'grandparent', 'friend', 'other'])
const questionSetMode = z.enum(['short', 'full'])
const clinicPreset = z.enum(['klinik', 'hausgeburt', 'geburtshaus', 'ambulant']).nullable()
const listLocation = z.enum(['klinik', 'hausgeburt', 'geburtshaus']).nullable()
const listSeason = z.enum(['sommer', 'winter']).nullable()
const listSetup = z.enum(['solo', 'duo']).nullable()

const partnerVisibility = z.object({
  partnerTodos: z.boolean(),
  termine: z.boolean(),
  tagebuch: z.boolean(),
  geburtsplan: z.boolean(),
  woche: z.boolean(),
  wochenbett: z.boolean(),
}).partial()

const kinderwunschTracking = z.object({
  temperature: z.boolean(),
  lh: z.boolean(),
  symptothermal: z.boolean(),
  gv: z.boolean(),
  mens: z.boolean(),
}).partial()

const timeString = z.string().regex(/^\d{2}:\d{2}$/).nullable()
const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable()

const kinderwunschReminders = z.object({
  vitaminsTime: timeString,
  ovuTestActive: z.boolean(),
  wunschEt: dateString,
}).partial()

const listPresets = z.object({
  location: listLocation,
  season: listSeason,
  setup: listSetup,
}).partial()

const notifications = z.object({
  weeklyEmail: z.boolean(),
}).partial()

// All fields optional — clients send partial patches
const prefsSchema = z.object({
  accentColor,
  fontSize,
  greetingTone,
  snapshotCards: z.array(snapshotCardKey).max(20),
  snapshotDensity,
  showCountdownWidget: z.boolean(),
  wocheProgressStyle,
  wocheBlocks: z.array(wocheBlockKey).max(20),
  wocheComparisonCategories: z.array(wocheComparisonCategory).max(20),
  tagebuchCustomPrompts: z.array(z.string().min(1).max(200)).max(50),
  tagebuchPromptRotation: z.boolean(),
  tagebuchShowRueckblick: z.boolean(),
  geburtsplanQuestionSet: questionSetMode,
  geburtsplanClinicPreset: clinicPreset,
  partnerRole,
  partnerLabel: z.string().min(0).max(60),
  partnerVisibility,
  kinderwunschCycleLength: z.number().int().min(21).max(40),
  kinderwunschTracking,
  kinderwunschReminders,
  listPresets,
  notifications,
}).partial().strict()

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { data } = await supabase
    .from('user_preferences')
    .select('settings')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (!data?.settings) return NextResponse.json(DEFAULT_PREFERENCES)
  return NextResponse.json(mergePreferences(data.settings as Partial<UserPreferences>))
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Ungültiges JSON' }, { status: 400 })
  }

  const parsed = prefsSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  // Server-side merge with existing settings (single-column update; the JSONB
  // merge below is not atomic against concurrent PUTs, so we serialize per-user
  // by grabbing the row again inside the same request. Still susceptible to
  // read-modify-write races if two tabs write at the same millisecond — future
  // improvement: use Postgres jsonb merge operator via .rpc().
  const { data: current } = await supabase
    .from('user_preferences')
    .select('settings')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  const merged = mergePreferences({
    ...(current?.settings ?? {}),
    ...parsed.data,
  } as Partial<UserPreferences>)

  const { error } = await supabase
    .from('user_preferences')
    .upsert(
      { user_id: user.id, settings: merged as unknown as Record<string, unknown> },
      { onConflict: 'user_id' },
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(merged)
}
