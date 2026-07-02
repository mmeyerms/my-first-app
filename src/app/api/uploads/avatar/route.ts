import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { detectImageType, type ImageType } from '@/lib/file-magic'

const MAX_SIZE = 2 * 1024 * 1024 // 2 MB
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
const ALLOWED_MAGIC = new Set<ImageType>(['jpg', 'png', 'webp'])
const EXT_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}
const CONTENT_TYPE_BY_MAGIC: Record<ImageType, string> = {
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  heic: 'image/heic',
}

/**
 * POST /api/uploads/avatar
 *
 * Nimmt FormData mit Feld "file" (JPG/PNG/WebP, max. 2 MB).
 * Speichert in Storage-Bucket "avatars" unter <user_id>/<uuid>.<ext>.
 * Aktualisiert profiles.avatar_url mit der Public-URL.
 * Räumt vorherige Avatar-Datei desselben Users auf.
 *
 * Security-Fluss:
 *   1) Content-Length prüfen BEVOR formData() (verhindert OOM-Angriffe)
 *   2) File streamen und in Buffer packen
 *   3) Magic-Byte-Check gegen ALLOWED_TYPES (MIME kann gelogen sein)
 *   4) Speichern
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  }

  // Size-Check ZUERST via Content-Length header BEVOR formData() aufgerufen wird.
  const contentLengthHeader = request.headers.get('content-length')
  if (contentLengthHeader) {
    const contentLength = Number(contentLengthHeader)
    if (Number.isFinite(contentLength) && contentLength > MAX_SIZE + 8192) {
      // +8kB Overhead-Toleranz für Multipart-Boundaries.
      return NextResponse.json(
        { error: 'Datei zu groß (max. 2 MB)' },
        { status: 413 },
      )
    }
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
      { status: 415 },
    )
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Datei zu groß (max. 2 MB)' }, { status: 413 })
  }

  // File streamen und Magic-Byte-Check durchführen.
  const arrayBuffer = await file.arrayBuffer()
  const detected = await detectImageType(arrayBuffer)
  if (!detected || !ALLOWED_MAGIC.has(detected)) {
    return NextResponse.json(
      { error: 'Dateiinhalt passt nicht zum erlaubten Bildformat (JPG, PNG, WebP)' },
      { status: 415 },
    )
  }

  // Ext aus tatsächlichem Byte-Format wählen (nicht dem behaupteten MIME).
  const ext = detected === 'jpg' ? 'jpg' : (EXT_MAP[file.type] ?? detected)
  const uuid = crypto.randomUUID()
  const path = `${user.id}/${uuid}.${ext}`
  const safeContentType = CONTENT_TYPE_BY_MAGIC[detected]

  // Snapshot old files BEFORE uploading — only delete them AFTER the new
  // upload + DB update both succeed. Prevents "no avatar and no old file"
  // failure mode when upload or DB update fails.
  const { data: existing } = await supabase.storage.from('avatars').list(user.id, {
    limit: 100,
  })
  const oldPaths = (existing ?? []).map((obj) => `${user.id}/${obj.name}`)

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, arrayBuffer, {
      contentType: safeContentType,
      upsert: true,
    })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: publicData } = supabase.storage.from('avatars').getPublicUrl(path)
  const url = publicData?.publicUrl ?? ''

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: url })
    .eq('user_id', user.id)

  if (updateError) {
    // Roll back the freshly uploaded file so we're not left with an orphan.
    await supabase.storage.from('avatars').remove([path]).catch(() => {})
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // Success — now safe to prune the previous files (best-effort).
  const prunable = oldPaths.filter((p) => p !== path)
  if (prunable.length > 0) {
    await supabase.storage.from('avatars').remove(prunable).catch(() => {})
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
