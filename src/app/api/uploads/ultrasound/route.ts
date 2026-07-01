import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
const EXT_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

interface UltrasoundEntry {
  url: string
  path: string
  ssw: number | null
  uploadedAt: string
}

const uuidSchema = z.string().uuid('Ungültige Pregnancy-ID')

/**
 * POST /api/uploads/ultrasound
 *
 * FormData:
 *   - file: JPG/PNG/WebP, max. 5 MB
 *   - pregnancyId: UUID der Schwangerschaft
 *   - ssw?: SSW-Zahl (optional)
 *
 * Speichert in Bucket "ultrasounds" unter <user_id>/<pregnancyId>/<uuid>.<ext>.
 * Signed URL (24h) wird zurückgegeben; die persistente Referenz (path)
 * wird als Eintrag in pregnancies.ultrasound_urls (JSONB-Array) angehängt.
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
  const pregnancyIdRaw = formData.get('pregnancyId')
  const sswRaw = formData.get('ssw')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Keine Datei übermittelt' }, { status: 400 })
  }
  if (typeof pregnancyIdRaw !== 'string') {
    return NextResponse.json({ error: 'pregnancyId fehlt' }, { status: 400 })
  }

  const pregnancyIdResult = uuidSchema.safeParse(pregnancyIdRaw)
  if (!pregnancyIdResult.success) {
    return NextResponse.json({ error: 'Ungültige pregnancyId' }, { status: 400 })
  }
  const pregnancyId = pregnancyIdResult.data

  const ssw: number | null =
    typeof sswRaw === 'string' && sswRaw.trim().length > 0 && !Number.isNaN(Number(sswRaw))
      ? Math.min(45, Math.max(1, Math.round(Number(sswRaw))))
      : null

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: 'Ungültiger Dateityp — erlaubt: JPG, PNG, WebP' },
      { status: 400 },
    )
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Datei zu groß (max. 5 MB)' }, { status: 400 })
  }

  // Verifiziere: Pregnancy gehört diesem User.
  const { data: preg, error: pregError } = await supabase
    .from('pregnancies')
    .select('id, ultrasound_urls, user_id')
    .eq('id', pregnancyId)
    .eq('user_id', user.id)
    .single()

  if (pregError || !preg) {
    return NextResponse.json({ error: 'Schwangerschaft nicht gefunden' }, { status: 404 })
  }

  const ext = EXT_MAP[file.type] ?? 'jpg'
  const uuid = crypto.randomUUID()
  const path = `${user.id}/${pregnancyId}/${uuid}.${ext}`

  const arrayBuffer = await file.arrayBuffer()
  const { error: uploadError } = await supabase.storage
    .from('ultrasounds')
    .upload(path, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  // Signed URL (privater Bucket) — 24 h Gültigkeit.
  const { data: signed } = await supabase.storage
    .from('ultrasounds')
    .createSignedUrl(path, 60 * 60 * 24)
  const url = signed?.signedUrl ?? ''

  const existing: UltrasoundEntry[] = Array.isArray(preg.ultrasound_urls)
    ? (preg.ultrasound_urls as UltrasoundEntry[])
    : []
  const nextEntries: UltrasoundEntry[] = [
    ...existing,
    { url, path, ssw, uploadedAt: new Date().toISOString() },
  ]

  const { error: updateError } = await supabase
    .from('pregnancies')
    .update({ ultrasound_urls: nextEntries })
    .eq('id', pregnancyId)
    .eq('user_id', user.id)

  if (updateError) {
    // Rollback: entferne Datei, falls DB-Update fehlschlägt.
    await supabase.storage.from('ultrasounds').remove([path])
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ url, path, ssw, uploadedAt: nextEntries[nextEntries.length - 1].uploadedAt })
}

/**
 * DELETE /api/uploads/ultrasound?pregnancyId=<uuid>&path=<path>
 * Entfernt ein einzelnes Ultraschall-Bild.
 */
export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const pregnancyIdParam = searchParams.get('pregnancyId')
  const pathParam = searchParams.get('path')

  if (!pregnancyIdParam || !pathParam) {
    return NextResponse.json({ error: 'pregnancyId und path erforderlich' }, { status: 400 })
  }

  const pregnancyIdResult = uuidSchema.safeParse(pregnancyIdParam)
  if (!pregnancyIdResult.success) {
    return NextResponse.json({ error: 'Ungültige pregnancyId' }, { status: 400 })
  }
  const pregnancyId = pregnancyIdResult.data

  // Schutz: path muss mit user.id/ starten (Ordner-Präfix).
  if (!pathParam.startsWith(`${user.id}/`)) {
    return NextResponse.json({ error: 'Kein Zugriff auf diesen Pfad' }, { status: 403 })
  }

  const { data: preg, error: pregError } = await supabase
    .from('pregnancies')
    .select('id, ultrasound_urls')
    .eq('id', pregnancyId)
    .eq('user_id', user.id)
    .single()

  if (pregError || !preg) {
    return NextResponse.json({ error: 'Schwangerschaft nicht gefunden' }, { status: 404 })
  }

  const existing: UltrasoundEntry[] = Array.isArray(preg.ultrasound_urls)
    ? (preg.ultrasound_urls as UltrasoundEntry[])
    : []
  const nextEntries = existing.filter((e) => e.path !== pathParam)

  await supabase.storage.from('ultrasounds').remove([pathParam])

  const { error: updateError } = await supabase
    .from('pregnancies')
    .update({ ultrasound_urls: nextEntries })
    .eq('id', pregnancyId)
    .eq('user_id', user.id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
