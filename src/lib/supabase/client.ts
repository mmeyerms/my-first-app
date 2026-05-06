import { createBrowserClient } from '@supabase/ssr'

const MOCK_USER = { id: 'mock-user-00000000', email: 'demo@mamamap.de', aud: 'authenticated' }

export function createClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return {
      auth: {
        signInWithPassword: async () => ({
          data: { session: { access_token: 'mock' }, user: MOCK_USER },
          error: null,
        }),
        signUp: async () => ({
          data: { user: MOCK_USER, session: { access_token: 'mock' } },
          error: null,
        }),
        signOut: async () => ({ error: null }),
        resetPasswordForEmail: async () => ({ data: {}, error: null }),
        getUser: async () => ({ data: { user: MOCK_USER }, error: null }),
        updateUser: async (_: unknown) => ({ data: { user: MOCK_USER }, error: null }),
      },
    } as never
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
