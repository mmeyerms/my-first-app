import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { getActivePregnancy } from '@/lib/pregnancy/server'

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ungültiges Datum')

const postSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().or(z.literal('')),
  due_date: dateSchema.optional().or(z.literal('')).nullable().optional(),
})

const patchSchema = z.object({
  id: z.string().uuid('Ungültige ID'),
  done: z.boolean(),
})

export type PartnerTodoDb = {
  id: string
  user_id: string
  pregnancy_id: string | null
  title: string
  description: string | null
  due_date: string | null
  done: boolean
  created_at: string
  updated_at: string
}

export type PartnerTodo = {
  id: string
  userId: string
  pregnancyId: string | null
  title: string
  description: string | null
  dueDate: string | null
  done: boolean
  createdAt: string
  updatedAt: string
}

function rowToTodo(r: PartnerTodoDb): PartnerTodo {
  return {
    id: r.id,
    userId: r.user_id,
    pregnancyId: r.pregnancy_id,
    title: r.title,
    description: r.description,
    dueDate: r.due_date,
    done: r.done,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

/**
 * GET /api/partner-todos
 * Scoped to the caller's active pregnancy when caller is the mother.
 * If the caller is a linked partner, returns todos for the mother's
 * active pregnancy instead.
 */
export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Resolve which user's todos to fetch. If the caller has a partner_link
  // (=partner viewing the mother's dashboard), fetch her todos. Otherwise
  // fetch the caller's own todos.
  const { data: link } = await supabase
    .from('partner_links')
    .select('mother_id')
    .eq('partner_user_id', user.id)
    .eq('active', true)
    .limit(1)
    .single()

  const targetUserId = (link as { mother_id: string } | null)?.mother_id ?? user.id

  const active = await getActivePregnancy(supabase, targetUserId)

  let query = supabase
    .from('partner_todos')
    .select('*')
    .eq('user_id', targetUserId)
    .order('done', { ascending: true })
    .order('due_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(200)

  if (active) {
    query = query.eq('pregnancy_id', active.id)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const rows = (data ?? []) as PartnerTodoDb[]
  return NextResponse.json(rows.map(rowToTodo))
}

/**
 * POST /api/partner-todos
 * Mother-only: create a new partner todo bound to the caller's active pregnancy.
 */
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

  const row = {
    user_id: user.id,
    pregnancy_id: active?.id ?? null,
    title: parsed.data.title.trim(),
    description:
      parsed.data.description && parsed.data.description.trim().length > 0
        ? parsed.data.description.trim()
        : null,
    due_date:
      parsed.data.due_date && parsed.data.due_date.length > 0 ? parsed.data.due_date : null,
    done: false,
  }

  const { data, error } = await supabase
    .from('partner_todos')
    .insert(row)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(rowToTodo(data as PartnerTodoDb), { status: 201 })
}

/**
 * PATCH /api/partner-todos
 * Body: { id, done }
 * Both mother AND linked partner may toggle 'done' — RLS on partner_todos
 * enforces that only the owner or the linked partner can update.
 * This route restricts writeable fields to 'done' only.
 */
export async function PATCH(request: NextRequest) {
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

  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { id, done } = parsed.data

  const { error } = await supabase
    .from('partner_todos')
    .update({ done })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

/**
 * DELETE /api/partner-todos?id=xxx
 * Mother-only: remove a todo.
 */
export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(request.url)
  const id = url.searchParams.get('id')
  if (!id || !/^[0-9a-fA-F-]{36}$/.test(id)) {
    return NextResponse.json({ error: 'Ungültige ID' }, { status: 400 })
  }

  const { error } = await supabase
    .from('partner_todos')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
