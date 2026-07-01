import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { getActivePregnancy } from '@/lib/pregnancy/server'
import { generateGroupId, generateOccurrenceDates } from '@/lib/termine/recurrence'
import type { Termin } from '@/lib/termine/types'

const TERMIN_TYPE_IDS = [
  'erstgespraech',
  'erste_vorsorge',
  'nackenfaltenmessung',
  'triple_test',
  'feindiagnostik',
  'zuckertest',
  'dritter_ultraschall',
  'ctg',
  'hebammengespraech',
  'geburtsplangespraech',
  'klinikbesichtigung',
  'wochenbett_hebamme',
  'geburtsvorbereitung',
  'stillberatung',
  'zahnarzt',
  'custom',
] as const

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ungültiges Datum')
const timeSchema = z.string().regex(/^\d{2}:\d{2}$/, 'Ungültige Zeit')

const terminInputSchema = z.object({
  type: z.enum(TERMIN_TYPE_IDS),
  title: z.string().min(1).max(200),
  date: dateSchema,
  time: timeSchema.optional().or(z.literal('')),
  location: z.string().max(200).optional().or(z.literal('')),
  doctor: z.string().max(200).optional().or(z.literal('')),
  notes: z.string().max(2000).optional().or(z.literal('')),
  done: z.boolean().optional(),
})

const recurrenceSchema = z.object({
  enabled: z.boolean(),
  rhythm: z.enum(['weekly', 'biweekly', 'monthly']),
  count: z.number().int().min(2).max(20),
})

const postSchema = z.object({
  termin: terminInputSchema,
  recurrence: recurrenceSchema.optional(),
})

type DbTermin = {
  id: string
  type: string
  title: string
  date: string
  time: string | null
  location: string | null
  doctor: string | null
  notes: string | null
  done: boolean
  group_id: string | null
  created_at: string
}

function rowToTermin(r: DbTermin): Termin {
  const out: Termin = {
    id: r.id,
    type: r.type as Termin['type'],
    title: r.title,
    date: r.date,
    createdAt: r.created_at,
  }
  if (r.time) out.time = r.time
  if (r.location) out.location = r.location
  if (r.doctor) out.doctor = r.doctor
  if (r.notes) out.notes = r.notes
  if (r.done) out.done = r.done
  if (r.group_id) out.groupId = r.group_id
  return out
}

function emptyToNull<T extends Record<string, unknown>>(obj: T): T {
  const out: Record<string, unknown> = { ...obj }
  for (const k of Object.keys(out)) {
    if (out[k] === '') out[k] = null
  }
  return out as T
}

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const active = await getActivePregnancy(supabase, user.id)
  if (!active) return NextResponse.json([])

  const { data, error } = await supabase
    .from('termine')
    .select('*')
    .eq('user_id', user.id)
    .eq('pregnancy_id', active.id)
    .order('date', { ascending: true })
    .limit(500)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const rows = (data ?? []) as DbTermin[]
  return NextResponse.json(rows.map(rowToTermin))
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Ungültiges JSON' }, { status: 400 })
  }

  const parsed = postSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const active = await getActivePregnancy(supabase, user.id)
  const { termin, recurrence } = parsed.data

  const baseRow = emptyToNull({
    user_id: user.id,
    pregnancy_id: active?.id ?? null,
    type: termin.type,
    title: termin.title,
    location: termin.location ?? null,
    doctor: termin.doctor ?? null,
    notes: termin.notes ?? null,
    done: termin.done ?? false,
  })

  const wantsSeries = !!(recurrence && recurrence.enabled && recurrence.count > 1)

  if (wantsSeries) {
    const dates = generateOccurrenceDates(termin.date, recurrence!.rhythm, recurrence!.count)
    const groupId = generateGroupId()
    const rows = dates.map((d) => ({
      ...baseRow,
      date: d,
      time: termin.time === '' ? null : termin.time ?? null,
      group_id: groupId,
    }))

    const { data, error } = await supabase.from('termine').insert(rows).select()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const created = ((data ?? []) as DbTermin[]).map(rowToTermin)
    return NextResponse.json({ created }, { status: 201 })
  }

  const row = {
    ...baseRow,
    date: termin.date,
    time: termin.time === '' ? null : termin.time ?? null,
    group_id: null,
  }

  const { data, error } = await supabase.from('termine').insert(row).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const created = data ? [rowToTermin(data as DbTermin)] : []
  return NextResponse.json({ created }, { status: 201 })
}
