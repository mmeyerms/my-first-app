import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/uploads/ultrasound/refresh?path=<storage-path>
 *
 * Generates a short-lived (1 hour) signed URL on-demand for an ultrasound
 * image identified by its storage path. This replaces the previous pattern
 * of persisting a 24h signed URL in the database — which caused 403s the
 * moment the URL expired.
 *
 * Security:
 *  - Caller must be authenticated.
 *  - The requested path must belong to the caller's namespace (starts with
 *    `<user_id>/`). This blocks casual path-guessing across users; the
 *    Supabase storage RLS still provides defense-in-depth if this check is
 *    ever bypassed.
 *
 * Cache: we return `Cache-Control: private, max-age=3300` (55 minutes) so
 * the browser can reuse the URL until just before the signed URL expires
 * without hammering this endpoint.
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')

  if (!path) {
    return NextResponse.json({ error: 'path erforderlich' }, { status: 400 })
  }

  // Reject path traversal + protocol-relative segments before ANY startsWith
  // check. Otherwise `<user.id>/../otheruser/xxx` passes the prefix filter and
  // Supabase Storage may normalize the traversal server-side, leaking files
  // from other users.
  if (path.includes('..') || path.includes('//') || path.includes('\\')) {
    return NextResponse.json({ error: 'Ungültiger Pfad' }, { status: 400 })
  }
  // Strict shape check: <uuid>/<uuid>/<uuid>.<ext>
  // where uuid = 8-4-4-4-12 hex groups and ext = jpg|jpeg|png|webp|heic.
  const STRICT_PATH = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|jpeg|png|webp|heic)$/i
  if (!STRICT_PATH.test(path)) {
    return NextResponse.json({ error: 'Ungültiger Pfad' }, { status: 400 })
  }
  if (!path.startsWith(`${user.id}/`)) {
    return NextResponse.json({ error: 'Kein Zugriff auf diesen Pfad' }, { status: 403 })
  }

  const { data: signed, error } = await supabase.storage
    .from('ultrasounds')
    .createSignedUrl(path, 60 * 60)

  if (error || !signed?.signedUrl) {
    console.error('[ultrasound-refresh]', error)
    return NextResponse.json({ error: 'Signierte URL konnte nicht erzeugt werden' }, { status: 500 })
  }

  return NextResponse.json(
    { url: signed.signedUrl },
    {
      headers: {
        // Private cache — signed URL is per-user; do not let a shared proxy
        // cache it. max-age slightly less than the URL's own 1h TTL.
        'Cache-Control': 'private, max-age=3300',
      },
    },
  )
}
