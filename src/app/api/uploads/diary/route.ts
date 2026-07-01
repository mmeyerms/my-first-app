import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const MAX_BYTES = 3 * 1024 * 1024 // 3MB
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'])
const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
  'image/heif': 'heif',
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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
    return NextResponse.json({ error: 'File too large — max 3 MB' }, { status: 400 })
  }

  const mime = file.type?.toLowerCase() ?? ''
  if (!ALLOWED_MIME.has(mime)) {
    return NextResponse.json({ error: 'Only JPEG, PNG, WEBP, HEIC/HEIF allowed' }, { status: 400 })
  }

  const ext = EXT_BY_MIME[mime] ?? 'jpg'
  const id =
    typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  const path = `${user.id}/${id}.${ext}`

  const buffer = await file.arrayBuffer()

  const { error: uploadError } = await supabase.storage
    .from('diary-photos')
    .upload(path, buffer, {
      contentType: mime,
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
