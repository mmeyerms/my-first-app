import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))

import { POST, DELETE, GET, PUT } from './route'
import { createClient } from '@/lib/supabase/server'

const USER = { id: 'mother-123' }

function makeChain(result: unknown) {
  return {
    update: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ error: null }),
    upsert: vi.fn().mockResolvedValue({ error: null }),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(result),
  }
}

function makeMock(user: unknown = USER, dbResult: unknown = { data: null, error: null }) {
  return {
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user } }) },
    from: vi.fn().mockReturnValue(makeChain(dbResult)),
  }
}

beforeEach(() => vi.clearAllMocks())

describe('POST /api/partner/invite', () => {
  it('returns 401 when not authenticated', async () => {
    vi.mocked(createClient).mockResolvedValue(makeMock(null) as never)
    const res = await POST()
    expect(res.status).toBe(401)
  })

  it('returns a token for authenticated mother', async () => {
    vi.mocked(createClient).mockResolvedValue(makeMock() as never)
    const res = await POST()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.token).toBeDefined()
    expect(body.expiresAt).toBeDefined()
  })
})

describe('DELETE /api/partner/invite', () => {
  it('returns 401 when not authenticated', async () => {
    vi.mocked(createClient).mockResolvedValue(makeMock(null) as never)
    const res = await DELETE()
    expect(res.status).toBe(401)
  })

  it('returns success for authenticated mother', async () => {
    vi.mocked(createClient).mockResolvedValue(makeMock() as never)
    const res = await DELETE()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
  })
})

describe('GET /api/partner/invite', () => {
  it('returns 401 when not authenticated', async () => {
    vi.mocked(createClient).mockResolvedValue(makeMock(null) as never)
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('returns partner status', async () => {
    vi.mocked(createClient).mockResolvedValue(makeMock() as never)
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect('hasPartner' in body).toBe(true)
  })
})

describe('PUT /api/partner/invite (accept)', () => {
  it('returns 401 when not authenticated', async () => {
    vi.mocked(createClient).mockResolvedValue(makeMock(null) as never)
    const req = new NextRequest('http://localhost', { method: 'PUT', body: JSON.stringify({ token: crypto.randomUUID() }), headers: { 'content-type': 'application/json' } })
    const res = await PUT(req)
    expect(res.status).toBe(401)
  })

  it('returns 400 for expired/invalid token', async () => {
    vi.mocked(createClient).mockResolvedValue(makeMock() as never)
    const req = new NextRequest('http://localhost', { method: 'PUT', body: JSON.stringify({ token: crypto.randomUUID() }), headers: { 'content-type': 'application/json' } })
    const res = await PUT(req)
    expect(res.status).toBe(400)
  })
})
