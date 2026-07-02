'use client'

import { useEffect, useState } from 'react'
import { PartnerAcceptForm } from './PartnerAcceptForm'

interface Props {
  token: string
}

/**
 * Client wrapper for the partner accept flow.
 *
 * SECURITY PURPOSE
 * ----------------
 * The `token` here is the raw invite token (a UUID) which — before this
 * wrapper existed — sat in the URL path (/partner/accept/<token>). That
 * pathname has three problems:
 *
 *   1. **Referer leak**: any third-party resource loaded on the page (fonts,
 *      analytics, error trackers, embedded iframes) receives the URL as a
 *      Referer header, so the token could be exfiltrated silently.
 *   2. **Browser history**: the token stays in history/bookmarks even after
 *      it's been consumed.
 *   3. **Share-by-accident**: users copying the URL to send to someone
 *      would inadvertently share a still-valid single-use credential.
 *
 * MITIGATION
 * ----------
 * We keep the token available to React state (so the accept form can POST
 * it in the JSON body — see /api/partner/invite PUT), but immediately after
 * the first client render we call `history.replaceState` to strip the token
 * from `window.location`. Combined with the `<meta name="referrer"
 * content="no-referrer">` this page renders, no outbound request will
 * include the token in its Referer header from that point on.
 *
 * We do not clear the token from React state — the accept form still
 * needs it to complete the flow.
 */
export function PartnerAcceptPageWrapper({ token }: Props) {
  // Hold the token in local state so React re-renders with a stable value
  // even after we mutate the URL. Never expose this outside the tree.
  const [localToken] = useState(token)

  useEffect(() => {
    // Strip the token from the URL on mount. Use replaceState (not
    // pushState) so we don't add a new history entry.
    try {
      const cleaned = '/partner/accept'
      if (typeof window !== 'undefined' && window.location.pathname !== cleaned) {
        window.history.replaceState(window.history.state, '', cleaned)
      }
    } catch {
      // Non-fatal — if the browser blocks history mutation we still succeed
      // functionally (token is still in state), we just don't get the
      // referrer-leak protection. The <meta> tag is the belt-and-braces.
    }
  }, [])

  return <PartnerAcceptForm token={localToken} />
}
