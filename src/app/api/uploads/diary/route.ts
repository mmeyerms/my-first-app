import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { detectImageType, type ImageType } from '@/lib/file-magic'

const MAX_BYTES = 3 * 1024 * 1024 // 3MB
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'])
const ALLOWED_MAGIC = new Set<ImageType>(['jpg', 'png', 'webp', 'heic'])
const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
  'image/heif': 'heif',
}
const CONTENT_TYPE_BY_MAGIC: Record<ImageType, string> = {
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  heic: 'image/heic',
}

/**
 * POST /api/uploads/diary
 *
 * Security-Fluss:
 *   1) Content-Length prüfen BEVOR formData() (verhindert OOM-Angriffe)
 *   2) File streamen und in Buffer packen
 *   3) Magic-Byte-Check gegen ALLOWED_TYPES (MIME kann gelogen sein)
 *   4) Speichern
 */
export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Size-Check ZUERST via Content-Length header BEVOR formData() aufgerufen wird.
  const contentLengthHeader = req.headers.get('content-length')
  if (contentLengthHeader) {
    const contentLength = Number(contentLengthHeader)
    if (Number.isFinite(contentLength) && contentLength > MAX_BYTES + 8192) {
      return NextResponse.json({ error: 'File too large — max 3 MB' }, { status: 413 })
    }
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid multipart form data' }, { status: 400 })
  }

  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file field' }, { status: 400 })
  }

  if (file.size <= 0) {
    return NextResponse.json({ error: 'Empty file' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File too large — max 3 MB' }, { status: 413 })
  }

  const mime = file.type?.toLowerCase() ?? ''
  if (!ALLOWED_MIME.has(mime)) {
    return NextResponse.json(
      { error: 'Only JPEG, PNG, WEBP, HEIC/HEIF allowed' },
      { status: 415 },
    )
  }

  // File streamen und Magic-Byte-Check durchführen.
  const buffer = await file.arrayBuffer()
  const detected = await detectImageType(buffer)
  if (!detected || !ALLOWED_MAGIC.has(detected)) {
    return NextResponse.json(
      { error: 'File contents do not match an allowed image format (JPEG, PNG, WEBP, HEIC/HEIF)' },
      { status: 415 },
    )
  }

  const ext = EXT_BY_MIME[mime] ?? detected
  const safeContentType = CONTENT_TYPE_BY_MAGIC[detected]
  const id =
    typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  const path = `${user.id}/${id}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('diary-photos')
    .upload(path, buffer, {
      contentType: safeContentType,
      upsert: false,
    })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  // Private bucket: return a signed URL (1 year) so the client can display it.
  const { data: signed, error: signError } = await supabase.storage
    .from('diary-photos')
    .createSignedUrl(path, 60 * 60 * 24 * 365)

  if (signError || !signed?.signedUrl) {
    return NextResponse.json(
      { error: signError?.message ?? 'Failed to generate signed URL' },
      { status: 500 },
    )
  }

  return NextResponse.json({ path, url: signed.signedUrl })
}
