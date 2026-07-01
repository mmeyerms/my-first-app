'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Baby, Sparkles, Star, Trash2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { useT, useLocale } from '@/lib/i18n/client'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BornModal } from '@/components/pregnancy/BornModal'
import { SternenkindModal } from '@/components/pregnancy/SternenkindModal'
import { NewPregnancyModal } from '@/components/pregnancy/NewPregnancyModal'
import { TransferFromPregnancyModal } from '@/components/pregnancy/TransferFromPregnancyModal'
import type { Pregnancy, PregnancyStatus, UltrasoundEntry } from '@/lib/pregnancy/server'

function formatDate(iso: string | null, locale: string): string {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(locale === 'en' ? 'en-GB' : 'de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

function StatusBadge({ status }: { status: PregnancyStatus }) {
  const t = useT()
  const map: Record<PregnancyStatus, { label: string; emoji: string; color: string }> = {
    planning: { label: t.pregnancy.status.planning, emoji: '🌷', color: 'hsl(140 30% 40%)' },
    pregnant: { label: t.pregnancy.status.pregnant, emoji: '🤰', color: 'hsl(350 60% 45%)' },
    born: { label: t.pregnancy.status.born, emoji: '👶', color: 'hsl(30 60% 45%)' },
    sternenkind: { label: t.pregnancy.status.sternenkind, emoji: '⭐', color: 'hsl(280 25% 45%)' },
  }
  const meta = map[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{
        backgroundColor: `${meta.color}15`,
        color: meta.color,
      }}
    >
      <span aria-hidden="true">{meta.emoji}</span>
      {meta.label}
    </span>
  )
}

function UltrasoundGallery({
  pregnancyId,
  initialEntries,
}: {
  pregnancyId: string
  initialEntries: UltrasoundEntry[]
}) {
  const [entries, setEntries] = useState<UltrasoundEntry[]>(initialEntries)
  const [busy, setBusy] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      toast.error('Bitte wähle ein Bild (JPG, PNG oder WebP).')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Datei zu groß — max. 5 MB erlaubt.')
      return
    }
    setBusy(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('pregnancyId', pregnancyId)
      const res = await fetch('/api/uploads/ultrasound', { method: 'POST', body: fd })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(typeof body.error === 'string' ? body.error : 'Upload fehlgeschlagen')
      }
      const data = (await res.json()) as UltrasoundEntry
      setEntries((prev) => [...prev, data])
      toast.success('Ultraschall-Bild hinzugefügt')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload fehlgeschlagen'
      toast.error(msg)
    } finally {
      setBusy(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleDelete(path: string) {
    setBusy(true)
    try {
      const url = `/api/uploads/ultrasound?pregnancyId=${encodeURIComponent(
        pregnancyId,
      )}&path=${encodeURIComponent(path)}`
      const res = await fetch(url, { method: 'DELETE' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(typeof body.error === 'string' ? body.error : 'Löschen fehlgeschlagen')
      }
      setEntries((prev) => prev.filter((e) => e.path !== path))
      toast.success('Bild entfernt')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Löschen fehlgeschlagen'
      toast.error(msg)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-4 space-y-3 border-t border-border/60 pt-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Ultraschall-Bilder
        </h4>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
          disabled={busy}
          className="h-7 text-xs"
          aria-label="Ultraschall-Bild hochladen"
        >
          <Upload className="mr-1 h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
          Hochladen
        </Button>
      </div>

      {entries.length === 0 ? (
        <p className="text-xs italic text-muted-foreground">
          Noch keine Bilder — lade dein erstes Ultraschall-Foto hoch.
        </p>
      ) : (
        <ul className="grid grid-cols-3 gap-2">
          {entries.map((entry) => (
            <li key={entry.path} className="group relative aspect-square overflow-hidden rounded-lg bg-muted">
              <Image
                src={entry.url}
                alt={
                  entry.ssw !== null
                    ? `Ultraschall SSW ${entry.ssw}`
                    : 'Ultraschall-Bild'
                }
                fill
                sizes="120px"
                className="object-cover"
                unoptimized
              />
              {entry.ssw !== null && (
                <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  SSW {entry.ssw}
                </span>
              )}
              <button
                type="button"
                onClick={() => handleDelete(entry.path)}
                disabled={busy}
                aria-label="Bild entfernen"
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity hover:bg-destructive group-hover:opacity-100 focus:opacity-100"
              >
                <Trash2 className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void handleFile(file)
        }}
      />
    </div>
  )
}

function PregnancyCard({
  pregnancy,
  onChanged,
}: {
  pregnancy: Pregnancy
  onChanged: () => void
}) {
  const t = useT()
  const { locale } = useLocale()
  const [bornOpen, setBornOpen] = useState(false)
  const [sternenkindOpen, setSternenkindOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [busy, setBusy] = useState(false)

  const isMemorial = pregnancy.status === 'born' || pregnancy.status === 'sternenkind'
  const isSternenkind = pregnancy.status === 'sternenkind'

  // For multiples, prefer joined baby_names (e.g. "Zwillinge: Emma & Leon").
  // Falls back to the legacy baby_name when baby_names is empty/null.
  const multipleNames =
    pregnancy.is_multiple && Array.isArray(pregnancy.baby_names)
      ? pregnancy.baby_names.filter((n) => n && n.trim().length > 0)
      : []
  const joinedMultipleNames =
    multipleNames.length >= 2
      ? multipleNames.slice(0, -1).join(', ') + ' & ' + multipleNames[multipleNames.length - 1]
      : multipleNames[0] ?? ''
  const displayName = pregnancy.is_multiple
    ? multipleNames.length > 0
      ? `Zwillinge: ${joinedMultipleNames}`
      : 'Zwillinge'
    : pregnancy.baby_name || t.pregnancy.overview.yourBaby

  async function handleActivate() {
    setBusy(true)
    try {
      await fetch(`/api/pregnancies/${pregnancy.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ is_active: true }),
      })
      onChanged()
    } finally {
      setBusy(false)
    }
  }

  async function handleAnnouncePregnant() {
    setBusy(true)
    try {
      await fetch(`/api/pregnancies/${pregnancy.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: 'pregnant' }),
      })
      onChanged()
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete() {
    setBusy(true)
    try {
      await fetch(`/api/pregnancies/${pregnancy.id}`, { method: 'DELETE' })
      onChanged()
    } finally {
      setBusy(false)
      setConfirmDelete(false)
    }
  }

  // Card visual style: editorial palette for sternenkind, normal otherwise
  const cardStyle = isSternenkind
    ? {
        background:
          'linear-gradient(180deg, hsl(280 25% 97%) 0%, hsl(40 30% 97%) 100%)',
        borderColor: 'hsl(280 20% 86%)',
      }
    : undefined

  return (
    <div
      className={`rounded-2xl border p-5 transition-all ${
        pregnancy.is_active && !isSternenkind
          ? 'border-primary/30 bg-card shadow-sm'
          : isSternenkind
            ? 'border'
            : 'border-border bg-card'
      }`}
      style={cardStyle}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <StatusBadge status={pregnancy.status} />
          {pregnancy.is_active && (
            <span className="inline-flex w-fit items-center rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary-foreground">
              {t.pregnancy.overview.activeBadge}
            </span>
          )}
        </div>
        <h3
          className="text-right font-display text-lg font-medium leading-tight"
          style={isSternenkind ? { color: 'hsl(280 25% 30%)' } : undefined}
        >
          {displayName}
        </h3>
      </div>

      {/* Date range */}
      <div
        className="mb-4 space-y-0.5 text-xs"
        style={isSternenkind ? { color: 'hsl(280 15% 40%)' } : { color: 'hsl(var(--muted-foreground))' }}
      >
        {pregnancy.status === 'born' && pregnancy.birth_date && (
          <p>{t.pregnancy.overview.born.replace('{date}', formatDate(pregnancy.birth_date, locale))}</p>
        )}
        {isSternenkind && pregnancy.ended_date && (
          <p className="font-medium">
            {t.pregnancy.overview.sternenkindOn.replace(
              '{date}',
              formatDate(pregnancy.ended_date, locale),
            )}
          </p>
        )}
        {pregnancy.positive_test_date && (
          <p>{t.pregnancy.overview.testDate.replace('{date}', formatDate(pregnancy.positive_test_date, locale))}</p>
        )}
        {pregnancy.due_date && pregnancy.status !== 'born' && pregnancy.status !== 'sternenkind' && (
          <p>{t.pregnancy.overview.dueDate.replace('{date}', formatDate(pregnancy.due_date, locale))}</p>
        )}
      </div>

      {/* Memorial note for sternenkind */}
      {isSternenkind && pregnancy.memorial_note && (
        <div
          className="mb-4 rounded-xl px-4 py-3"
          style={{ backgroundColor: 'hsl(280 30% 95%)' }}
        >
          <p
            className="mb-1 text-[10px] font-medium uppercase tracking-[0.18em]"
            style={{ color: 'hsl(280 25% 50%)' }}
          >
            {t.pregnancy.overview.memorialNote}
          </p>
          <p
            className="font-display text-sm italic leading-relaxed"
            style={{ color: 'hsl(280 20% 30%)' }}
          >
            {pregnancy.memorial_note}
          </p>
        </div>
      )}

      {/* Actions */}
      {!isMemorial && (
        <div className="flex flex-wrap gap-2">
          {pregnancy.status === 'pregnant' && (
            <>
              <Button
                size="sm"
                onClick={() => setBornOpen(true)}
                disabled={busy}
                className="flex-1"
              >
                <Baby className="mr-1.5 h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                {t.pregnancy.born.cta}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline" disabled={busy}>
                    {t.pregnancy.overview.changeStatus}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSternenkindOpen(true)}>
                    <Star className="mr-2 h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                    {t.pregnancy.sternenkind.optionLabel}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {pregnancy.status === 'planning' && (
            <Button
              size="sm"
              onClick={handleAnnouncePregnant}
              disabled={busy}
              className="flex-1"
            >
              <Sparkles className="mr-1.5 h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              {t.pregnancy.overview.announcePregnancy}
            </Button>
          )}
        </div>
      )}

      {isSternenkind && (
        <Link
          href="/trauer"
          className="mb-3 inline-flex items-center text-sm font-medium underline-offset-2 hover:underline"
          style={{ color: 'hsl(280 30% 38%)' }}
        >
          {t.pregnancy.overview.grief}
        </Link>
      )}

      {!isSternenkind && (
        <UltrasoundGallery
          pregnancyId={pregnancy.id}
          initialEntries={
            Array.isArray(pregnancy.ultrasound_urls) ? pregnancy.ultrasound_urls : []
          }
        />
      )}

      {/* Footer: activate + delete */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
        {!pregnancy.is_active && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleActivate}
            disabled={busy}
            className="text-xs"
          >
            {t.pregnancy.overview.activate}
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setConfirmDelete(true)}
          disabled={busy}
          className="ml-auto text-xs text-muted-foreground hover:text-destructive"
        >
          {t.pregnancy.overview.delete}
        </Button>
      </div>

      {/* Modals */}
      <BornModal
        open={bornOpen}
        onOpenChange={setBornOpen}
        pregnancyId={pregnancy.id}
        babyName={pregnancy.baby_name}
        onSuccess={onChanged}
      />
      <SternenkindModal
        open={sternenkindOpen}
        onOpenChange={setSternenkindOpen}
        pregnancyId={pregnancy.id}
        babyName={pregnancy.baby_name}
        onSuccess={onChanged}
      />

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.pregnancy.overview.delete}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.pregnancy.overview.confirmDelete}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>{t.common.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={busy}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t.pregnancy.overview.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export function PregnancyOverview() {
  const t = useT()
  const [pregnancies, setPregnancies] = useState<Pregnancy[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [newOpen, setNewOpen] = useState(false)
  const [transferOpen, setTransferOpen] = useState(false)
  const [pendingTransferTargetId, setPendingTransferTargetId] = useState<string | undefined>(undefined)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/pregnancies', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed')
      const data = (await res.json()) as Pregnancy[]
      setPregnancies(data)
      setError(null)
    } catch {
      setError(t.pregnancy.overview.loadError)
    }
  }, [t.pregnancy.overview.loadError])

  useEffect(() => {
    load()
  }, [load])

  const handleChanged = useCallback(() => {
    // After mutation, reload list. For status changes that affect SSW etc.,
    // a full reload makes sure dashboard / nav state stays consistent.
    void load().then(() => {
      try {
        window.location.reload()
      } catch {
        // ignore
      }
    })
  }, [load])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-medium text-foreground">
          {t.pregnancy.overview.title}
        </h2>
      </div>

      {pregnancies === null && !error && (
        <p className="text-sm italic text-muted-foreground">{t.pregnancy.overview.loading}</p>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
      )}

      {pregnancies && pregnancies.length === 0 && (
        <p className="text-sm italic text-muted-foreground">{t.pregnancy.overview.empty}</p>
      )}

      {pregnancies && pregnancies.length > 0 && (
        <div className="space-y-3">
          {pregnancies
            .slice()
            .sort((a, b) => {
              if (a.is_active !== b.is_active) return a.is_active ? -1 : 1
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            })
            .map((p) => (
              <PregnancyCard key={p.id} pregnancy={p} onChanged={handleChanged} />
            ))}
        </div>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setNewOpen(true)}
        >
          {t.pregnancy.overview.addNew}
        </Button>
        {pregnancies && pregnancies.length >= 2 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setTransferOpen(true)}
          >
            Aus vorheriger SS übernehmen
          </Button>
        )}
      </div>

      <NewPregnancyModal
        open={newOpen}
        onOpenChange={setNewOpen}
        onSuccess={(newlyCreatedId) => {
          // If there was already at least one pregnancy, offer to transfer instead
          // of doing a full reload — the Transfer modal needs the fresh list.
          if (pregnancies && pregnancies.length >= 1 && newlyCreatedId) {
            // Point the target at the freshly-created pregnancy explicitly.
            // Otherwise the modal defaults to the currently-active pregnancy,
            // which — when the user just set the new one active — is the same,
            // but when the user unchecked "activate now", the transfer would
            // silently write into the wrong pregnancy.
            setPendingTransferTargetId(newlyCreatedId)
            void load().then(() => {
              setTransferOpen(true)
            })
          } else {
            handleChanged()
          }
        }}
      />
      <TransferFromPregnancyModal
        open={transferOpen}
        onOpenChange={(o) => {
          setTransferOpen(o)
          if (!o) setPendingTransferTargetId(undefined)
        }}
        targetPregnancyId={pendingTransferTargetId}
        onSuccess={handleChanged}
      />
    </div>
  )
}
