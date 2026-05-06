import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const profileSchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich').max(50),
  baby_name: z.string().min(1, 'Arbeitsname ist erforderlich').max(50),
  positive_test_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ungültiges Datum'),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ungültiges Datum'),
}).refine(
  (d) => new Date(d.due_date) > new Date(d.positive_test_date),
  { message: 'Geburtstermin muss nach dem Test-Datum liegen', path: ['due_date'] }
)

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { data, error } = await supabase
    .from('profiles')
    .select('name, baby_name, positive_test_date, due_date, updated_at')
    .eq('user_id', user.id)
    .single()

  if (error?.code === 'PGRST116') {
    return NextResponse.json({ error: 'Kein Profil gefunden' }, { status: 404 })
  }
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
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

  const result = profileSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
  }

  const { error } = await supabase.from('profiles').upsert({
    user_id: user.id,
    ...result.data,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
