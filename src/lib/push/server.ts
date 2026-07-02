import webpush from 'web-push'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Push notification server module — VAPID setup + send-with-retire logic.
 *
 * Deployment prerequisites (see .env.local.example):
 *   NEXT_PUBLIC_VAPID_PUBLIC_KEY  — safe to expose, used by client subscribe
 *   VAPID_PRIVATE_KEY             — SERVER ONLY
 *   VAPID_SUBJECT                 — mailto: or https:// per RFC 8292
 *
 * If VAPID_PRIVATE_KEY is unset, all send calls no-op with a warning. This is
 * intentional so preview/dev environments do not crash when keys are absent.
 */

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
const privateKey = process.env.VAPID_PRIVATE_KEY
const subject = process.env.VAPID_SUBJECT ?? 'mailto:hallo@mamamap.app'

let vapidConfigured = false
if (publicKey && privateKey) {
  try {
    webpush.setVapidDetails(subject, publicKey, privateKey)
    vapidConfigured = true
  } catch (e) {
    console.warn('[push] VAPID setup failed:', e)
  }
}

export function isPushConfigured(): boolean {
  return vapidConfigured
}

export interface PushPayload {
  title: string
  body: string
  /** Deep-link path within the app, e.g. "/dashboard" or "/wochenbett-chef". */
  url?: string
  /** Icon path served from /public. */
  icon?: string
  /** Optional grouping tag so multi-fire pushes collapse in the OS. */
  tag?: string
}

interface StoredSubscription {
  id: string
  endpoint: string
  p256dh: string
  auth: string
}

/**
 * Send a push notification to every ACTIVE subscription of a user. Failed
 * endpoints (410 Gone, 404 Not Found) are auto-marked `active=false` so the
 * next cron/send does not retry them. Other errors are logged but do not
 * disable the subscription.
 *
 * The Supabase client must be a service-role client for cron jobs that hit
 * multiple users. For same-user requests (e.g. /api/push/test), a normal
 * server client also works because RLS scopes rows to auth.uid().
 */
export async function sendPushToUser(
  supabase: SupabaseClient,
  userId: string,
  payload: PushPayload,
): Promise<{ sent: number; retired: number; failed: number }> {
  if (!vapidConfigured) {
    console.warn('[push] VAPID not configured — skipping send for user', userId)
    return { sent: 0, retired: 0, failed: 0 }
  }

  const { data: subs, error } = await supabase
    .from('push_subscriptions')
    .select('id, endpoint, p256dh, auth')
    .eq('user_id', userId)
    .eq('active', true)

  if (error || !subs || subs.length === 0) {
    return { sent: 0, retired: 0, failed: 0 }
  }

  const body = JSON.stringify(payload)
  let sent = 0
  let retired = 0
  let failed = 0

  await Promise.all(
    (subs as StoredSubscription[]).map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          body,
          { TTL: 60 * 60 * 24 }, // 24h — irrelevant beyond one day
        )
        sent++
        await supabase
          .from('push_subscriptions')
          .update({ last_used_at: new Date().toISOString() })
          .eq('id', sub.id)
      } catch (e) {
        const err = e as { statusCode?: number; body?: string }
        // 404 / 410 = endpoint permanently gone. Deactivate so we do not spam.
        if (err.statusCode === 404 || err.statusCode === 410) {
          await supabase
            .from('push_subscriptions')
            .update({ active: false })
            .eq('id', sub.id)
          retired++
        } else {
          console.warn('[push] send failed', err.statusCode, err.body)
          failed++
        }
      }
    }),
  )

  return { sent, retired, failed }
}
