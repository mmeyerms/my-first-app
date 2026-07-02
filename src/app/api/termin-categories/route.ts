import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { apiError } from '@/lib/apiError'

const schema = z.object({
  slug: z.string().min(1).max(60).regex(/^[a-z0-9_-]+$/, 'nur a-z, 0-9, _-'),
  label: z.string().min(1).max(60),
  emoji: z.string().max(8).optional().nullable(),
  color: z.string().max(24).optional().nullable(),
  default_location: z.string().max(120).optional().nullable(),
  default_reminder_hours: z.number().int().min(0).max(24 * 30).optional().nullable(),
  notes_template: z.string().max(2000).optional().nullable(),
})

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { data } = await supabase
    .from('termin_categories')
    .select('*')
    .eq('user_id', user.id)
    .order('label')
    .limit(100)

  return NextResponse.json(data ?? [])
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  let body: unknown
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Ungültiges JSON' }, { status: 400 }) }
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { data, error } = await supabase
    .from('termin_categories')
    .upsert({ ...parsed.data, user_id: user.id, is_builtin: false }, { onConflict: 'user_id,slug' })
    .select()
    .single()
  if (error) return apiError(error, 'termin-categories')
  return NextResponse.json(data)
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const url = new URL(request.url)
  const slug = url.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'slug fehlt' }, { status: 400 })

  const { error } = await supabase
    .from('termin_categories')
    .delete()
    .eq('user_id', user.id)
    .eq('slug', slug)
  if (error) return apiError(error, 'termin-categories')
  return NextResponse.json({ success: true })
}
