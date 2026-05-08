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

export async function middleware(request: NextRequest) {
  // 1. Site-wide password gate (only active when SITE_PASSWORD env is set, e.g. on Vercel)
  const gate = checkSiteGate(request)
  if (gate) return gate

  let supabaseResponse = NextResponse.next({ request })

  // 2. Mock mode: skip Supabase auth entirely
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return withNoIndex(supabaseResponse)

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

  const pathname = request.nextUrl.pathname
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
    return withNoIndex(NextResponse.redirect(new URL('/login', request.url)))
  }

  if (user && isAuthPage) {
    return withNoIndex(NextResponse.redirect(new URL('/dashboard', request.url)))
  }

  return withNoIndex(supabaseResponse)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
