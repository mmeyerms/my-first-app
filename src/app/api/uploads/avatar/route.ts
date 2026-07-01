import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const MAX_SIZE = 2 * 1024 * 1024 // 2 MB
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
const EXT_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

/**
 * POST /api/uploads/avatar
 *
 * Nimmt FormData mit Feld "file" (JPG/PNG/WebP, max. 2 MB).
 * Speichert in Storage-Bucket "avatars" unter <user_id>/<uuid>.<ext>.
 * Aktualisiert profiles.avatar_url mit der Public-URL.
 * Räumt vorherige Avatar-Datei desselben Users auf.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Ungültige FormData' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Keine Datei übermittelt' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: 'Ungültiger Dateityp — erlaubt: JPG, PNG, WebP' },
      { status: 400 },
    )
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Datei zu groß (max. 2 MB)' }, { status: 400 })
  }

  const ext = EXT_MAP[file.type] ?? 'jpg'
  const uuid = crypto.randomUUID()
  const path = `${user.id}/${uuid}.${ext}`

  // Lösche vorherige Avatar-Datei(en) des Users (Cleanup).
  const { data: existing } = await supabase.storage.from('avatars').list(user.id, {
    limit: 100,
  })
  if (existing && existing.length > 0) {
    const oldPaths = existing.map((obj) => `${user.id}/${obj.name}`)
    await supabase.storage.from('avatars').remove(oldPaths)
  }

  const arrayBuffer = await file.arrayBuffer()
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, arrayBuffer, {
      contentType: file.type,
      upsert: true,
    })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: publicData } = supabase.storage.from('avatars').getPublicUrl(path)
  const url = publicData?.publicUrl ?? ''

  // Aktualisiere profiles.avatar_url
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: url })
    .eq('user_id', user.id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ url, path })
}

/**
 * DELETE /api/uploads/avatar
 * Löscht das Profilbild des eingeloggten Users komplett.
 */
export async function DELETE() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  }

  const { data: existing } = await supabase.storage.from('avatars').list(user.id, {
    limit: 100,
  })
  if (existing && existing.length > 0) {
    const paths = existing.map((obj) => `${user.id}/${obj.name}`)
    await supabase.storage.from('avatars').remove(paths)
  }

  await supabase.from('profiles').update({ avatar_url: null }).eq('user_id', user.id)

  return NextResponse.json({ success: true })
}
