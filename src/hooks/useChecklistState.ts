'use client'

import { useCallback, useEffect, useState } from 'react'

export type CustomItem = {
  id: string
  categoryId: string
  label: string
  tip?: string
}

export type ChecklistState = {
  checked: string[]
  excluded: string[]
  custom: CustomItem[]
}

const EMPTY_STATE: ChecklistState = {
  checked: [],
  excluded: [],
  custom: [],
}

function readInitial(storageKey: string): ChecklistState {
  if (typeof window === 'undefined') return EMPTY_STATE
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return EMPTY_STATE
    const parsed: unknown = JSON.parse(raw)
    // Migration: legacy shape was a plain array of checked IDs
    if (Array.isArray(parsed)) {
      return {
        checked: parsed.filter((x): x is string => typeof x === 'string'),
        excluded: [],
        custom: [],
      }
    }
    if (parsed && typeof parsed === 'object') {
      const obj = parsed as Partial<ChecklistState>
      return {
        checked: Array.isArray(obj.checked)
          ? obj.checked.filter((x): x is string => typeof x === 'string')
          : [],
        excluded: Array.isArray(obj.excluded)
          ? obj.excluded.filter((x): x is string => typeof x === 'string')
          : [],
        custom: Array.isArray(obj.custom)
          ? obj.custom.filter(
              (c): c is CustomItem =>
                !!c &&
                typeof c === 'object' &&
                typeof (c as CustomItem).id === 'string' &&
                typeof (c as CustomItem).categoryId === 'string' &&
                typeof (c as CustomItem).label === 'string',
            )
          : [],
      }
    }
  } catch {
    // ignore
  }
  return EMPTY_STATE
}

export function useChecklistState(storageKey: string) {
  const [state, setState] = useState<ChecklistState>(EMPTY_STATE)
  const [hydrated, setHydrated] = useState(false)

  // Load on mount (with legacy shape migration)
  useEffect(() => {
    setState(readInitial(storageKey))
    setHydrated(true)
  }, [storageKey])

  // Persist
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(storageKey, JSON.stringify(state))
    } catch {
      // ignore quota errors
    }
  }, [state, storageKey, hydrated])

  const toggleChecked = useCallback((id: string) => {
    setState((prev) => {
      const has = prev.checked.includes(id)
      return {
        ...prev,
        checked: has ? prev.checked.filter((x) => x !== id) : [...prev.checked, id],
      }
    })
  }, [])

  const exclude = useCallback((id: string) => {
    setState((prev) => {
      if (prev.excluded.includes(id)) return prev
      return {
        ...prev,
        excluded: [...prev.excluded, id],
        checked: prev.checked.filter((x) => x !== id),
      }
    })
  }, [])

  const restore = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      excluded: prev.excluded.filter((x) => x !== id),
    }))
  }, [])

  const addCustom = useCallback((categoryId: string, label: string, tip?: string) => {
    const trimmed = label.trim()
    if (!trimmed) return
    const id = `custom-${categoryId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setState((prev) => ({
      ...prev,
      custom: [...prev.custom, { id, categoryId, label: trimmed, tip: tip?.trim() || undefined }],
    }))
  }, [])

  const removeCustom = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      custom: prev.custom.filter((c) => c.id !== id),
      checked: prev.checked.filter((x) => x !== id),
      excluded: prev.excluded.filter((x) => x !== id),
    }))
  }, [])

  const resetAll = useCallback(() => {
    setState((prev) => ({
      ...prev,
      checked: [],
    }))
  }, [])

  const isChecked = useCallback((id: string) => state.checked.includes(id), [state.checked])
  const isExcluded = useCallback((id: string) => state.excluded.includes(id), [state.excluded])

  return {
    state,
    hydrated,
    isChecked,
    isExcluded,
    toggleChecked,
    exclude,
    restore,
    addCustom,
    removeCustom,
    resetAll,
  }
}
