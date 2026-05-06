import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))

import { GET, PUT } from './route'
import { createClient } from '@/lib/supabase/server'

function makeSupabaseMock({
  user = { id: 'user-123' } as { id: string } | null,
  planData = null as unknown,
  planError = null as unknown,
  upsertError = null as unknown,
} = {}) {
  const singleMock = vi.fn().mockResolvedValue({ data: planData, error: planError })
  const eqMock = vi.fn().mockReturnValue({ single: singleMock })
  const selectMock = vi.fn().mockReturnValue({ eq: eqMock })
  const upsertMock = vi.fn().mockResolvedValue({ error: upsertError })

  return {
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user } }) },
    from: vi.fn().mockReturnValue({ select: selectMock, upsert: upsertMock }),
  }
}

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/geburtsplan', {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  })
}

beforeEach(() => vi.clearAllMocks())

describe('GET /api/geburtsplan', () => {
  it('returns 401 when not authenticated', async () => {
    vi.mocked(createClient).mockResolvedValue(makeSupabaseMock({ user: null }) as never)
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('returns empty answers when no plan exists yet', async () => {
    vi.mocked(createClient).mockResolvedValue(
      makeSupabaseMock({ planError: { code: 'PGRST116' } }) as never
    )
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.answers).toEqual({})
  })

  it('returns existing answers', async () => {
    const answers = { location: 'Krankenhaus', companions: ['Partner/in'] }
    vi.mocked(createClient).mockResolvedValue(
      makeSupabaseMock({ planData: { answers } }) as never
    )
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.answers.location).toBe('Krankenhaus')
  })
})

describe('PUT /api/geburtsplan', () => {
  it('returns 401 when not authenticated', async () => {
    vi.mocked(createClient).mockResolvedValue(makeSupabaseMock({ user: null }) as never)
    const res = await PUT(makeRequest({ answers: {} }))
    expect(res.status).toBe(401)
  })

  it('returns 400 for invalid payload', async () => {
    vi.mocked(createClient).mockResolvedValue(makeSupabaseMock() as never)
    const res = await PUT(makeRequest({ wrong: 'field' }))
    expect(res.status).toBe(400)
  })

  it('saves answers and returns success', async () => {
    vi.mocked(createClient).mockResolvedValue(makeSupabaseMock() as never)
    const res = await PUT(makeRequest({ answers: { location: 'Geburtshaus', companions: ['Partner/in'] } }))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
  })
})
