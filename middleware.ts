import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

function unauthorized(): Response {
  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="MamaMap", charset="UTF-8"',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-store',
    },
  })
}

function checkSiteGate(request: NextRequest): Response | null {
  const expected = process.env.SITE_PASSWORD
  if (!expected) return null

  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return unauthorized()
  }
  const encoded = authHeader.slice('Basic '.length).trim()
  let decoded = ''
  try {
    decoded = atob(encoded)
  } catch {
    return unauthorized()
  }
  const colon = decoded.indexOf(':')
  if (colon < 0) return unauthorized()
  const pass = decoded.slice(colon + 1)
  if (pass !== expected) return unauthorized()
  return null
}

function withNoIndex(response: NextResponse): NextResponse {
  response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return response
}

// Content Security Policy — conservative baseline that still permits the
// bits we actually use (inline styles from Tailwind, Google Fonts, Supabase
// storage/realtime, Anthropic API, Resend, Vercel Live for preview banners).
// NOT applied to /api/* — those are JSON and CSP is irrelevant there.
const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://*.supabase.co",
  "connect-src 'self' https://*.supabase.co https://api.resend.com wss://*.supabase.co https://api.anthropic.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

function applySecurityHeaders(response: NextResponse, pathname: string): NextResponse {
  // Always apply headers that are cheap and universally safe.
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains',
  )
  // CSP only on HTML responses (page routes). API routes return JSON where
  // script-src etc. are irrelevant and setting CSP just adds noise / risks
  // breaking JSON tooling.
  if (!pathname.startsWith('/api/')) {
    response.headers.set('Content-Security-Policy', CSP_DIRECTIVES)
  }
  return response
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 1. Site-wide password gate (only active when SITE_PASSWORD env is set, e.g. on Vercel)
  const gate = checkSiteGate(request)
  if (gate) return gate

  let supabaseResponse = NextResponse.next({ request })

  // 2. Mock mode: skip Supabase auth entirely
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return applySecurityHeaders(withNoIndex(supabaseResponse), pathname)
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isProtected =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/profil') ||
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/tagebuch') ||
    pathname.startsWith('/termine') ||
    pathname.startsWith('/geburtsplan') ||
    pathname.startsWith('/kinderwunsch') ||
    pathname.startsWith('/woche') ||
    pathname.startsWith('/wochenbett') ||
    (pathname.startsWith('/partner') && !pathname.startsWith('/partner/accept'))
  const isAuthPage = ['/login', '/register', '/passwort-vergessen'].includes(pathname)

  if (!user && isProtected) {
    return applySecurityHeaders(
      withNoIndex(NextResponse.redirect(new URL('/login', request.url))),
      pathname,
    )
  }

  if (user && isAuthPage) {
    return applySecurityHeaders(
      withNoIndex(NextResponse.redirect(new URL('/dashboard', request.url))),
      pathname,
    )
  }

  return applySecurityHeaders(withNoIndex(supabaseResponse), pathname)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
