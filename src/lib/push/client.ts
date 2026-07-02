/**
 * Push notification client-side helpers.
 *
 * The consuming component (NotificationsSection) drives the UX. This module
 * only provides the mechanics: register SW, subscribe/unsubscribe with the
 * browser Push API, POST the resulting subscription to the server.
 *
 * We deliberately do NOT auto-register the service worker on page load. Push
 * subscriptions require an explicit user gesture (opt-in click) to avoid a
 * cold Notification permission prompt — which browsers will otherwise block
 * globally after too many silent rejections.
 */

export interface SubscribeResult {
  ok: boolean
  error?: 'unsupported' | 'denied' | 'no-vapid' | 'network' | 'unknown'
}

const SW_PATH = '/sw-push.js'
const SW_SCOPE = '/'

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  // Explicit ArrayBuffer allocation — PushManager.subscribe rejects
  // Uint8Array<ArrayBufferLike> (which may back onto SharedArrayBuffer) but
  // accepts Uint8Array<ArrayBuffer> under strict lib.dom typings.
  const buffer = new ArrayBuffer(raw.length)
  const buf = new Uint8Array(buffer)
  for (let i = 0; i < raw.length; i++) buf[i] = raw.charCodeAt(i)
  return buf
}

export function isPushSupported(): boolean {
  if (typeof window === 'undefined') return false
  return (
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  )
}

export function getPermission(): NotificationPermission | 'unsupported' {
  if (!isPushSupported()) return 'unsupported'
  return Notification.permission
}

export async function isSubscribed(): Promise<boolean> {
  if (!isPushSupported()) return false
  try {
    const reg = await navigator.serviceWorker.getRegistration(SW_SCOPE)
    if (!reg) return false
    const sub = await reg.pushManager.getSubscription()
    return sub !== null
  } catch {
    return false
  }
}

export async function subscribePush(): Promise<SubscribeResult> {
  if (!isPushSupported()) return { ok: false, error: 'unsupported' }

  const vapidPubKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  if (!vapidPubKey) return { ok: false, error: 'no-vapid' }

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return { ok: false, error: 'denied' }

  try {
    let reg = await navigator.serviceWorker.getRegistration(SW_SCOPE)
    if (!reg) {
      reg = await navigator.serviceWorker.register(SW_PATH, { scope: SW_SCOPE })
    }
    await navigator.serviceWorker.ready

    let sub = await reg.pushManager.getSubscription()
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPubKey),
      })
    }

    const json = sub.toJSON()
    if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
      return { ok: false, error: 'unknown' }
    }

    const res = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        endpoint: json.endpoint,
        p256dh: json.keys.p256dh,
        auth: json.keys.auth,
        userAgent: navigator.userAgent.slice(0, 200),
      }),
    })
    if (!res.ok) return { ok: false, error: 'network' }
    return { ok: true }
  } catch (e) {
    console.warn('[push] subscribe failed', e)
    return { ok: false, error: 'unknown' }
  }
}

export async function unsubscribePush(): Promise<SubscribeResult> {
  if (!isPushSupported()) return { ok: false, error: 'unsupported' }
  try {
    const reg = await navigator.serviceWorker.getRegistration(SW_SCOPE)
    const sub = reg && (await reg.pushManager.getSubscription())
    if (!sub) return { ok: true }

    const endpoint = sub.endpoint
    await sub.unsubscribe()
    await fetch('/api/push/unsubscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ endpoint }),
    })
    return { ok: true }
  } catch {
    return { ok: false, error: 'unknown' }
  }
}

export async function sendTestPush(): Promise<boolean> {
  try {
    const res = await fetch('/api/push/test', { method: 'POST' })
    return res.ok
  } catch {
    return false
  }
}
