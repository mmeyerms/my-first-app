'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface Props {
  token: string
}

export function PartnerAcceptForm({ token }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function accept() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/partner/invite', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const body = await res.json()
      if (!res.ok) {
        setError(body.error ?? 'Etwas ist schiefgelaufen')
        return
      }
      router.push('/partner/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-8 text-center">
        <p className="mb-4 text-4xl">🌸</p>
        <h1 className="mb-2 text-xl font-bold text-gray-800">Einladung annehmen</h1>
        <p className="mb-6 text-sm text-gray-500">
          Du erhältst Zugang zu den Schwangerschaftsdaten und dem Geburtsplan deiner Partnerin.
          Du kannst keine Daten bearbeiten.
        </p>
        {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
        <Button onClick={accept} disabled={loading} className="w-full">
          {loading ? 'Wird verbunden…' : 'Einladung annehmen'}
        </Button>
      </CardContent>
    </Card>
  )
}
