import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))

import { GET, PUT } from './route'
import { createClient } from '@/lib/supabase/server'

const VALID_PROFILE = {
  name: 'Anna',
  baby_name: 'Erdnuss',
  positive_test_date: '2025-01-15',
  due_date: '2025-10-20',
}

function makeRequest(method: string, body?: unknown): NextRequest {
  return new NextRequest('http://localhost/api/profile', {
    method,
    ...(body !== undefined ? { body: JSON.stringify(body), headers: { 'content-type': 'application/json' } } : {}),
  })
}

function makeSupabaseMock({
  user = { id: 'user-123' },
  profileData = null as unknown,
  profileError = null as unknown,
  upsertError = null as unknown,
  updateError = null as unknown,
} = {}) {
  const singleMock = vi.fn().mockResolvedValue({ data: profileData, error: profileError })
  const eqMock = vi.fn().mockReturnValue({ single: singleMock })
  const selectMock = vi.fn().mockReturnValue({ eq: eqMock })
  const upsertMock = vi.fn().mockResolvedValue({ error: upsertError })
  const updateEqMock = vi.fn().mockResolvedValue({ error: updateError })
  const updateMock = vi.fn().mockReturnValue({ eq: updateEqMock })

  const fromMock = vi.fn().mockReturnValue({
    select: selectMock,
    upsert: upsertMock,
    update: updateMock,
  })

  return {
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user } }) },
    from: fromMock,
  }
}

beforeEach(() => vi.clearAllMocks())

describe('GET /api/profile', () => {
  it('returns 401 when not authenticated', async () => {
    vi.mocked(createClient).mockResolvedValue(
      makeSupabaseMock({ user: null as unknown as { id: string } }) as never
    )
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('returns 404 when profile does not exist', async () => {
    vi.mocked(createClient).mockResolvedValue(
      makeSupabaseMock({ profileError: { code: 'PGRST116', message: 'No rows' } }) as never
    )
    const res = await GET()
    expect(res.status).toBe(404)
  })

  it('returns profile data for authenticated user', async () => {
    vi.mocked(createClient).mockResolvedValue(
      makeSupabaseMock({ profileData: VALID_PROFILE }) as never
    )
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.name).toBe('Anna')
    expect(body.baby_name).toBe('Erdnuss')
  })
})

describe('PUT /api/profile', () => {
  it('returns 401 when not authenticated', async () => {
    vi.mocked(createClient).mockResolvedValue(
      makeSupabaseMock({ user: null as unknown as { id: string } }) as never
    )
    const res = await PUT(makeRequest('PUT', VALID_PROFILE))
    expect(res.status).toBe(401)
  })

  it('returns 400 for missing required name', async () => {
    vi.mocked(createClient).mockResolvedValue(makeSupabaseMock() as never)
    const res = await PUT(makeRequest('PUT', { name: '' }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBeDefined()
  })

  it('returns 400 when due_date is before positive_test_date', async () => {
    vi.mocked(createClient).mockResolvedValue(makeSupabaseMock() as never)
    const res = await PUT(makeRequest('PUT', {
      ...VALID_PROFILE,
      due_date: '2024-12-01',
      positive_test_date: '2025-01-15',
    }))
    expect(res.status).toBe(400)
  })

  it('returns 200 and upserts valid profile', async () => {
    vi.mocked(createClient).mockResolvedValue(makeSupabaseMock() as never)
    const res = await PUT(makeRequest('PUT', VALID_PROFILE))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
  })

  it('accepts a name-only minimal profile (other fields optional)', async () => {
    vi.mocked(createClient).mockResolvedValue(makeSupabaseMock() as never)
    const res = await PUT(makeRequest('PUT', { name: 'Anna', mode: 'planning' }))
    expect(res.status).toBe(200)
  })

  it('accepts profile with mode and baby_gender', async () => {
    vi.mocked(createClient).mockResolvedValue(makeSupabaseMock() as never)
    const res = await PUT(makeRequest('PUT', {
      ...VALID_PROFILE,
      mode: 'pregnant',
      baby_gender: 'surprise',
    }))
    expect(res.status).toBe(200)
  })

  it('rejects invalid baby_gender value', async () => {
    vi.mocked(createClient).mockResolvedValue(makeSupabaseMock() as never)
    const res = await PUT(makeRequest('PUT', { ...VALID_PROFILE, baby_gender: 'foo' }))
    expect(res.status).toBe(400)
  })

  it('handles partial update with only locale', async () => {
    vi.mocked(createClient).mockResolvedValue(makeSupabaseMock() as never)
    const res = await PUT(makeRequest('PUT', { locale: 'en' }))
    expect(res.status).toBe(200)
  })

  it('handles partial update with only tour_completed', async () => {
    vi.mocked(createClient).mockResolvedValue(makeSupabaseMock() as never)
    const res = await PUT(makeRequest('PUT', { tour_completed: false }))
    expect(res.status).toBe(200)
  })

  it('handles partial update with only mode', async () => {
    vi.mocked(createClient).mockResolvedValue(makeSupabaseMock() as never)
    const res = await PUT(makeRequest('PUT', { mode: 'planning' }))
    expect(res.status).toBe(200)
  })

  it('returns 400 for invalid JSON body', async () => {
    vi.mocked(createClient).mockResolvedValue(makeSupabaseMock() as never)
    const req = new NextRequest('http://localhost/api/profile', {
      method: 'PUT',
      body: 'not-json',
      headers: { 'content-type': 'application/json' },
    })
    const res = await PUT(req)
    expect(res.status).toBe(400)
  })
})
