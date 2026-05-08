'use client'

import { useState } from 'react'
import { AppTour } from './AppTour'

interface DashboardTourGateProps {
  userName: string
  initialCompleted: boolean
}

export function DashboardTourGate({
  userName,
  initialCompleted,
}: DashboardTourGateProps) {
  const [open, setOpen] = useState(!initialCompleted)

  async function markCompleted() {
    setOpen(false)
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ tour_completed: true }),
      })
    } catch {
      // Best-effort: if the request fails, the user can still see the
      // tour again later from their profile.
    }
  }

  return (
    <AppTour
      open={open}
      userName={userName}
      onComplete={markCompleted}
      onSkip={markCompleted}
    />
  )
}
