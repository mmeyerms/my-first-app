'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

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

export type ChecklistKind = 'packliste' | 'einkaufsliste' | 'wochenbett'

const EMPTY_STATE: ChecklistState = {
  checked: [],
  excluded: [],
  custom: [],
}

function legacyStorageKey(kind: ChecklistKind): string {
  return `mamamap-${kind}`
}

function normalizeState(parsed: unknown): ChecklistState {
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
  return EMPTY_STATE
}

function isLegacyKind(value: string): value is ChecklistKind {
  return value === 'packliste' || value === 'einkaufsliste' || value === 'wochenbett'
}

/**
 * Persists a single checklist's state via the API.
 *
 * Accepts either a `ChecklistKind` ('packliste' | 'einkaufsliste' | 'wochenbett')
 * or a legacy storage key like 'mamamap-packliste' (for backwards compatibility
 * with existing call-sites that pass STORAGE_KEY).
 *
 * On first mount, performs a one-time migration from `localStorage` if the
 * server returns an empty state and local data is present.
 */
export function useChecklistState(kindOrKey: ChecklistKind | string) {
  // Resolve the canonical kind from either form.
  const kind: ChecklistKind = isLegacyKind(kindOrKey)
    ? (kindOrKey as ChecklistKind)
    : (kindOrKey.replace(/^mamamap-/, '') as ChecklistKind)

  const [state, setState] = useState<ChecklistState>(EMPTY_STATE)
  const [hydrated, setHydrated] = useState(false)
  const skipNextSaveRef = useRef(false)

  // Load from API on mount + one-time localStorage migration.
  useEffect(() => {
    let cancelled = false
    const localKey = legacyStorageKey(kind)

    fetch(`/api/checklists/${kind}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('fetch failed'))))
      .then(async (raw: unknown) => {
        if (cancelled) return
        const apiState = normalizeState(raw)
        const isEmpty =
          apiState.checked.length === 0 &&
          apiState.custom.length === 0 &&
          apiState.excluded.length === 0

        if (isEmpty && typeof window !== 'undefined') {
          try {
            const localRaw = localStorage.getItem(localKey)
            if (localRaw) {
              const localState = normalizeState(JSON.parse(localRaw))
              const hasLocal =
                localState.checked.length > 0 ||
                localState.custom.length > 0 ||
                localState.excluded.length > 0
              if (hasLocal) {
                await fetch(`/api/checklists/${kind}`, {
                  method: 'PUT',
                  headers: { 'content-type': 'application/json' },
                  body: JSON.stringify({ state: localState }),
                }).catch(() => {})
                try {
                  localStorage.removeItem(localKey)
                } catch {
                  // ignore
                }
                if (!cancelled) {
                  // Avoid double-save (the post-hydration effect will run once).
                  skipNextSaveRef.current = true
                  setState(localState)
                  setHydrated(true)
                }
                return
              }
            }
          } catch {
            // ignore
          }
        }

        if (!cancelled) {
          skipNextSaveRef.current = true
          setState(apiState)
          setHydrated(true)
        }
      })
      .catch(() => {
        if (!cancelled) {
          skipNextSaveRef.current = true
          setState(EMPTY_STATE)
          setHydrated(true)
        }
      })

    return () => {
      cancelled = true
    }
  }, [kind])

  // Debounced save to API on state change after hydration.
  useEffect(() => {
    if (!hydrated) return
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false
      return
    }
    const handle = setTimeout(() => {
      fetch(`/api/checklists/${kind}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ state }),
      }).catch(() => {
        // Silent failure — UI keeps optimistic state.
      })
    }, 500)
    return () => clearTimeout(handle)
  }, [state, hydrated, kind])

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
