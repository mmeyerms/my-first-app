/*
 * MamaMap Push Service Worker
 *
 * Handles: push events (show notification), notificationclick (deep-link into app).
 * Registered by src/lib/push/client.ts on user opt-in — NOT auto-installed.
 * Scope: '/'. One SW registration per origin.
 */

self.addEventListener('install', (event) => {
  // Activate immediately on install so the first notification works without a reload.
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  // Claim all open clients so we can dispatch messages on notificationclick.
  event.waitUntil(self.clients.claim())
})

self.addEventListener('push', (event) => {
  let payload = { title: 'MamaMap', body: '' }
  if (event.data) {
    try {
      payload = event.data.json()
    } catch {
      payload = { title: 'MamaMap', body: event.data.text() }
    }
  }

  const options = {
    body: payload.body || '',
    icon: payload.icon || '/icon-192.png',
    badge: '/icon-badge.png',
    tag: payload.tag || 'mamamap',
    // Multiple pushes with the same tag collapse into one notification.
    renotify: false,
    data: { url: payload.url || '/' },
  }

  event.waitUntil(self.registration.showNotification(payload.title || 'MamaMap', options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = (event.notification.data && event.notification.data.url) || '/'

  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      // If a MamaMap tab is already open, focus it and navigate.
      for (const client of allClients) {
        if ('focus' in client && client.url.includes(self.location.origin)) {
          await client.focus()
          if ('navigate' in client) {
            try { await client.navigate(url) } catch { /* cross-origin nav blocked */ }
          }
          return
        }
      }
      // Otherwise open a fresh tab.
      if (self.clients.openWindow) {
        await self.clients.openWindow(url)
      }
    })(),
  )
})
