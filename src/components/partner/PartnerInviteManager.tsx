'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PartnerStatus {
  hasPartner: boolean
  pendingToken: string | null
  pendingExpiry: string | null
}

interface Props {
  initialStatus: PartnerStatus
}

export function PartnerInviteManager({ initialStatus }: Props) {
  const [status, setStatus] = useState(initialStatus)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const inviteUrl = status.pendingToken
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/partner/accept/${status.pendingToken}`
    : null

  async function createInvite() {
    setLoading(true)
    try {
      const res = await fetch('/api/partner/invite', { method: 'POST' })
      if (res.ok) {
        const refreshed = await fetch('/api/partner/invite')
        const data = await refreshed.json()
        setStatus(data)
      }
    } finally {
      setLoading(false)
    }
  }

  async function revokeAccess() {
    setLoading(true)
    try {
      await fetch('/api/partner/invite', { method: 'DELETE' })
      setStatus({ hasPartner: false, pendingToken: null, pendingExpiry: null })
    } finally {
      setLoading(false)
    }
  }

  async function copyLink() {
    if (inviteUrl) {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (status.hasPartner) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👫</span>
              <div>
                <p className="font-semibold text-green-800">Partner verbunden</p>
                <p className="text-xs text-green-600">Dein Partner kann deinen Geburtsplan lesen</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={revokeAccess}
              disabled={loading}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              Widerrufen
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (status.pendingToken) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Einladungslink aktiv</CardTitle>
            <Badge variant="secondary">Offen</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg bg-gray-50 p-3 font-mono text-xs text-gray-600 break-all">
            {inviteUrl}
          </div>
          {status.pendingExpiry && (
            <p className="text-xs text-gray-500">
              Gültig bis:{' '}
              {new Date(status.pendingExpiry).toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </p>
          )}
          <div className="flex gap-2">
            <Button onClick={copyLink} variant="outline" size="sm" className="flex-1">
              {copied ? '✓ Kopiert!' : 'Link kopieren'}
            </Button>
            <Button
              onClick={revokeAccess}
              variant="ghost"
              size="sm"
              disabled={loading}
              className="text-red-600 hover:bg-red-50"
            >
              Widerrufen
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-dashed">
      <CardContent className="p-6 text-center">
        <p className="mb-3 text-4xl">💑</p>
        <p className="mb-1 font-semibold text-gray-800">Partner einladen</p>
        <p className="mb-5 text-sm text-gray-500">
          Generiere einen Link für deinen Partner. Er erhält phasenspezifische Tipps und kann deinen
          Geburtsplan lesen — aber nichts bearbeiten.
        </p>
        <Button onClick={createInvite} disabled={loading} className="w-full">
          {loading ? 'Wird erstellt…' : 'Einladungslink erstellen'}
        </Button>
      </CardContent>
    </Card>
  )
}
