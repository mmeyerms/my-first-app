'use client'

import { useEffect, useMemo, useState } from 'react'
import { HandHeart, Heart, Plus, Share2, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLocale } from '@/lib/i18n/client'
import {
  HELP_CATEGORIES,
  type HelpCategory,
  type HelpRequestWithSlots,
  type HelpSlot,
} from '@/lib/wochenbett-chef/types'

interface NewSlotDraft {
  category: HelpCategory
  description: string
  date: string
  time: string
}

const EMPTY_DRAFT: NewSlotDraft = {
  category: 'kochen',
  description: '',
  date: '',
  time: '',
}

export function HelpCoordinator() {
  const { t } = useLocale()
  const tc = t.helpCoordinator
  const empties = t.emptyStates

  const [lists, setLists] = useState<HelpRequestWithSlots[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [copiedFor, setCopiedFor] = useState<string | null>(null)
  const [editingTitleFor, setEditingTitleFor] = useState<string | null>(null)
  const [titleDraft, setTitleDraft] = useState('')
  const [introDraft, setIntroDraft] = useState('')
  const [drafts, setDrafts] = useState<Record<string, NewSlotDraft>>({})
  const [openSlotFormFor, setOpenSlotFormFor] = useState<string | null>(null)
  const [savingTitleFor, setSavingTitleFor] = useState<string | null>(null)

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/help-requests', { cache: 'no-store' })
      if (res.ok) {
        const data = (await res.json()) as HelpRequestWithSlots[]
        setLists(data)
      }
    } finally {
      setLoading(false)
    }
  }

  async function createList() {
    setCreating(true)
    try {
      const res = await fetch('/api/help-requests', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({}),
      })
      if (res.ok) {
        const created = (await res.json()) as HelpRequestWithSlots
        setLists((prev) => [created, ...prev])
      }
    } finally {
      setCreating(false)
    }
  }

  function startEditTitle(list: HelpRequestWithSlots) {
    setEditingTitleFor(list.id)
    setTitleDraft(list.title ?? '')
    setIntroDraft(list.intro ?? '')
  }

  async function saveTitle(listId: string) {
    setSavingTitleFor(listId)
    try {
      const res = await fetch(`/api/help-requests/${listId}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title: titleDraft, intro: introDraft }),
      })
      if (res.ok) {
        setLists((prev) =>
          prev.map((l) =>
            l.id === listId
              ? { ...l, title: titleDraft.trim() || null, intro: introDraft.trim() || null }
              : l,
          ),
        )
        setEditingTitleFor(null)
      }
    } finally {
      setSavingTitleFor(null)
    }
  }

  async function deleteList(listId: string) {
    if (!window.confirm(tc.confirmDeleteList)) return
    const res = await fetch(`/api/help-requests/${listId}`, { method: 'DELETE' })
    if (res.ok) {
      setLists((prev) => prev.filter((l) => l.id !== listId))
    }
  }

  async function copyShareLink(token: string) {
    if (typeof window === 'undefined') return
    const url = `${window.location.origin}/helfen/${token}`
    try {
      await navigator.clipboard.writeText(url)
      setCopiedFor(token)
      setTimeout(() => setCopiedFor((c) => (c === token ? null : c)), 1800)
    } catch {
      // ignore
    }
  }

  function getDraft(listId: string): NewSlotDraft {
    return drafts[listId] ?? { ...EMPTY_DRAFT }
  }

  function updateDraft(listId: string, patch: Partial<NewSlotDraft>) {
    setDrafts((prev) => ({
      ...prev,
      [listId]: { ...(prev[listId] ?? { ...EMPTY_DRAFT }), ...patch },
    }))
  }

  function clearDraft(listId: string) {
    setDrafts((prev) => {
      const next = { ...prev }
      delete next[listId]
      return next
    })
    setOpenSlotFormFor(null)
  }

  async function addSlot(listId: string) {
    const draft = getDraft(listId)
    const payload = {
      category: draft.category,
      description: draft.description.trim() || undefined,
      date: draft.date || undefined,
      time: draft.time || undefined,
    }
    const res = await fetch(`/api/help-requests/${listId}/slots`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      const slot = (await res.json()) as HelpSlot
      setLists((prev) =>
        prev.map((l) => (l.id === listId ? { ...l, slots: [...l.slots, slot] } : l)),
      )
      clearDraft(listId)
    }
  }

  async function deleteSlot(listId: string, slotId: string) {
    if (!window.confirm(tc.confirmDeleteSlot)) return
    const res = await fetch(`/api/help-requests/${listId}/slots/${slotId}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      setLists((prev) =>
        prev.map((l) =>
          l.id === listId ? { ...l, slots: l.slots.filter((s) => s.id !== slotId) } : l,
        ),
      )
    }
  }

  const hasLists = lists.length > 0

  return (
    <div className="space-y-6">
      {/* Header CTA */}
      {hasLists && (
        <div className="flex">
          <Button
            onClick={createList}
            disabled={creating}
            className="inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            {creating ? tc.creating : tc.createList}
          </Button>
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-border/60 bg-card p-6 text-sm text-muted-foreground shadow-sm">
          {t.common.loading}
        </div>
      ) : !hasLists ? (
        <div className="rounded-2xl border border-dashed border-border/60 bg-secondary/30 p-8 text-center">
          <HandHeart className="mx-auto mb-3 h-8 w-8 text-primary" strokeWidth={1.5} />
          <h3 className="font-display text-lg font-medium text-foreground">
            {empties.helpCoordinatorTitle}
          </h3>
          <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
            {empties.helpCoordinatorBody}
          </p>
          <Button
            onClick={createList}
            disabled={creating}
            className="mt-5 inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            {creating ? tc.creating : empties.helpCoordinatorCta}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {lists.map((list) => (
            <HelpListCard
              key={list.id}
              list={list}
              tc={tc}
              isEditing={editingTitleFor === list.id}
              titleDraft={titleDraft}
              introDraft={introDraft}
              setTitleDraft={setTitleDraft}
              setIntroDraft={setIntroDraft}
              startEditTitle={() => startEditTitle(list)}
              cancelEditTitle={() => setEditingTitleFor(null)}
              saveTitle={() => saveTitle(list.id)}
              savingTitle={savingTitleFor === list.id}
              copyShareLink={() => copyShareLink(list.share_token)}
              copied={copiedFor === list.share_token}
              deleteList={() => deleteList(list.id)}
              draft={getDraft(list.id)}
              draftOpen={openSlotFormFor === list.id}
              openDraft={() => setOpenSlotFormFor(list.id)}
              updateDraft={(patch) => updateDraft(list.id, patch)}
              cancelDraft={() => clearDraft(list.id)}
              submitDraft={() => addSlot(list.id)}
              deleteSlot={(slotId) => deleteSlot(list.id, slotId)}
              commonT={t.common}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface HelpListCardProps {
  list: HelpRequestWithSlots
  tc: ReturnType<typeof useLocale>['t']['helpCoordinator']
  isEditing: boolean
  titleDraft: string
  introDraft: string
  setTitleDraft: (v: string) => void
  setIntroDraft: (v: string) => void
  startEditTitle: () => void
  cancelEditTitle: () => void
  saveTitle: () => void
  savingTitle: boolean
  copyShareLink: () => void
  copied: boolean
  deleteList: () => void
  draft: NewSlotDraft
  draftOpen: boolean
  openDraft: () => void
  updateDraft: (patch: Partial<NewSlotDraft>) => void
  cancelDraft: () => void
  submitDraft: () => void
  deleteSlot: (slotId: string) => void
  commonT: ReturnType<typeof useLocale>['t']['common']
}

function HelpListCard({
  list,
  tc,
  isEditing,
  titleDraft,
  introDraft,
  setTitleDraft,
  setIntroDraft,
  startEditTitle,
  cancelEditTitle,
  saveTitle,
  savingTitle,
  copyShareLink,
  copied,
  deleteList,
  draft,
  draftOpen,
  openDraft,
  updateDraft,
  cancelDraft,
  submitDraft,
  deleteSlot,
  commonT,
}: HelpListCardProps) {
  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return `/helfen/${list.share_token}`
    return `${window.location.origin}/helfen/${list.share_token}`
  }, [list.share_token])

  return (
    <section className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
      <header className="border-b border-border/60 px-5 py-4">
        {isEditing ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor={`title-${list.id}`} className="text-xs">
                {tc.listTitle}
              </Label>
              <Input
                id={`title-${list.id}`}
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                placeholder={tc.titlePlaceholder}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`intro-${list.id}`} className="text-xs">
                {tc.descriptionLabel}
              </Label>
              <Textarea
                id={`intro-${list.id}`}
                rows={2}
                value={introDraft}
                onChange={(e) => setIntroDraft(e.target.value)}
                placeholder={tc.introPlaceholder}
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={saveTitle} disabled={savingTitle}>
                {savingTitle ? tc.saving : tc.saveTitle}
              </Button>
              <Button size="sm" variant="ghost" onClick={cancelEditTitle}>
                {tc.cancel}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-3">
            <button
              type="button"
              onClick={startEditTitle}
              className="flex-1 text-left transition-colors hover:text-primary"
              title={commonT.edit}
            >
              <h2 className="text-base font-semibold text-foreground">
                {list.title?.trim() || tc.listTitle}
              </h2>
              {list.intro && (
                <p className="mt-0.5 text-xs text-muted-foreground">{list.intro}</p>
              )}
            </button>
            <button
              type="button"
              onClick={deleteList}
              aria-label={tc.deleteList}
              title={tc.deleteList}
              className="shrink-0 rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        )}
      </header>

      {/* Share link */}
      <div className="border-b border-border/60 bg-muted/30 px-5 py-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
          <Share2 className="h-4 w-4" strokeWidth={1.5} />
          {tc.shareTitle}
        </div>
        <p className="mb-3 text-xs text-muted-foreground">{tc.shareBody}</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            readOnly
            value={shareUrl}
            onFocus={(e) => e.currentTarget.select()}
            className="font-mono text-xs"
          />
          <Button
            size="sm"
            variant="secondary"
            onClick={copyShareLink}
            className="shrink-0"
          >
            {copied ? tc.copied : tc.copyLink}
          </Button>
        </div>
      </div>

      {/* Slots */}
      <div className="px-5 py-4">
        {list.slots.length === 0 ? (
          <p className="mb-4 text-sm text-muted-foreground">{tc.emptySlotsHint}</p>
        ) : (
          <ul className="mb-4 space-y-3">
            {list.slots.map((slot) => (
              <SlotRow
                key={slot.id}
                slot={slot}
                requestId={list.id}
                tc={tc}
                onDelete={() => deleteSlot(slot.id)}
              />
            ))}
          </ul>
        )}

        {/* New slot form */}
        {draftOpen ? (
          <div className="space-y-3 rounded-xl border border-border/60 bg-background p-4">
            <div className="space-y-1">
              <Label htmlFor={`cat-${list.id}`} className="text-xs">
                {tc.categoryLabel}
              </Label>
              <Select
                value={draft.category}
                onValueChange={(v) =>
                  updateDraft({ category: v as HelpCategory })
                }
              >
                <SelectTrigger id={`cat-${list.id}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HELP_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {tc.categories[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor={`desc-${list.id}`} className="text-xs">
                {tc.descriptionLabel}
              </Label>
              <Input
                id={`desc-${list.id}`}
                value={draft.description}
                onChange={(e) => updateDraft({ description: e.target.value })}
                placeholder={tc.descriptionPlaceholder}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor={`date-${list.id}`} className="text-xs">
                  {tc.dateLabel}
                </Label>
                <Input
                  id={`date-${list.id}`}
                  type="date"
                  value={draft.date}
                  onChange={(e) => updateDraft({ date: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`time-${list.id}`} className="text-xs">
                  {tc.timeLabel}
                </Label>
                <Input
                  id={`time-${list.id}`}
                  type="time"
                  value={draft.time}
                  onChange={(e) => updateDraft({ time: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={submitDraft}>
                {tc.addSlotSubmit}
              </Button>
              <Button size="sm" variant="ghost" onClick={cancelDraft}>
                {tc.cancel}
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={openDraft}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            {tc.addSlot}
          </button>
        )}
      </div>
    </section>
  )
}

interface SlotRowProps {
  slot: HelpSlot
  requestId: string
  tc: ReturnType<typeof useLocale>['t']['helpCoordinator']
  onDelete: () => void
}

const THANK_YOU_TEMPLATES: Record<string, string[]> = {
  kochen: [
    'Danke {name} — dein Essen war wie eine warme Umarmung. 🫶',
    'Ich weiß gar nicht wie ich dir für die Mahlzeit danken soll, {name}. Du hast mir einen Abend geschenkt.',
    'Das schmeckt so gut, {name}. Danke, dass du an uns denkst.',
  ],
  putzen: [
    'Danke {name} — dass hier heute alles sauber ist, fühlt sich fast surreal an. 💛',
    'Du hast keine Ahnung wie sehr das gerade geholfen hat, {name}. Danke.',
    'Ohne dich läge hier noch alles am Boden, {name}. Riesen-Dank.',
  ],
  einkaufen: [
    'Danke {name} — der Kühlschrank ist voll und ich bin unendlich dankbar.',
    'Du bist ein Engel, {name}. Danke fürs Einkaufen.',
    'Das war so lieb von dir, {name}. Wirklich.',
  ],
  kinderbetreuung: [
    'Danke {name} — dass du dich um die Kleinen kümmerst, hat mir eine echte Pause geschenkt. 🙏',
    'Ich konnte tatsächlich schlafen dank dir, {name}. Das bedeutet gerade alles.',
    'Du hast heute alles möglich gemacht, {name}. Danke von Herzen.',
  ],
  emotionale_unterstützung: [
    'Danke {name} — dass du einfach da warst hat mir mehr gegeben als du weißt.',
    'Deine Nachricht/dein Besuch heute hat mich getragen, {name}. Danke.',
    'Ich fühle mich weniger allein mit dir an meiner Seite, {name}. Danke.',
  ],
}

function SlotRow({ slot, requestId, tc, onDelete }: SlotRowProps) {
  const isClaimed = !!slot.helper_name && slot.helper_name.trim() !== ''
  const [showThankYou, setShowThankYou] = useState(false)
  const [thanksSent, setThanksSent] = useState(!!slot.thanks_sent_at)
  const templates = THANK_YOU_TEMPLATES[slot.category] ?? []

  async function markThanksSent() {
    if (thanksSent) return
    setThanksSent(true) // optimistic
    try {
      await fetch(`/api/help-requests/${requestId}/slots/${slot.id}/thanks`, {
        method: 'POST',
      })
    } catch {
      // Rollback on network failure so user can retry.
      setThanksSent(false)
    }
  }
  const dateLabel = slot.date
    ? slot.time
      ? `${formatDate(slot.date)} · ${slot.time}`
      : formatDate(slot.date)
    : tc.noDate

  return (
    <li className="flex items-start gap-3 rounded-xl border border-border/60 bg-background p-3">
      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-sm font-medium text-foreground">
            {tc.categories[slot.category]}
          </span>
          <span className="text-xs text-muted-foreground">· {dateLabel}</span>
        </div>
        {slot.description && (
          <p className="text-sm text-muted-foreground">{slot.description}</p>
        )}
        {isClaimed ? (
          <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary">
            <Heart className="h-3.5 w-3.5 fill-current" strokeWidth={1.5} />
            {tc.claimedBy.replace('{name}', slot.helper_name!)}
          </p>
        ) : (
          <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
            {tc.open}
          </p>
        )}
        {slot.helper_message && (
          <p className="mt-1 text-xs italic text-muted-foreground">
            “{slot.helper_message}”
          </p>
        )}
        {isClaimed && templates.length > 0 && (
          <div className="mt-2">
            {thanksSent && !showThankYou ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-sage/40 bg-sage/10 px-2.5 py-1 text-[11px] font-medium text-sage">
                <Heart className="h-3 w-3 fill-current" strokeWidth={1.5} /> Danke gesagt ✓
              </span>
            ) : !showThankYou ? (
              <button
                type="button"
                onClick={() => setShowThankYou(true)}
                className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-secondary/40 px-2.5 py-1 text-[11px] font-medium text-primary hover:bg-secondary"
              >
                <Heart className="h-3 w-3" strokeWidth={1.5} /> Danke sagen
              </button>
            ) : (
              <div className="mt-1 space-y-1.5 rounded-lg border border-border/60 bg-secondary/30 p-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Vorlagen</p>
                {templates.map((tpl, i) => {
                  const text = tpl.replace('{name}', slot.helper_name!.trim())
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={async () => {
                        try {
                          if (navigator.share) {
                            await navigator.share({ text })
                          } else {
                            await navigator.clipboard.writeText(text)
                            alert('In Zwischenablage kopiert!')
                          }
                          // Persist that Mama has already reached out for this slot.
                          void markThanksSent()
                          setShowThankYou(false)
                        } catch {
                          // user cancelled share
                        }
                      }}
                      className="w-full rounded-md bg-card p-2 text-left text-xs leading-snug transition-colors hover:bg-secondary"
                    >
                      {text}
                    </button>
                  )
                })}
                <button
                  type="button"
                  onClick={() => setShowThankYou(false)}
                  className="text-[10px] text-muted-foreground underline decoration-dotted"
                >
                  schließen
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onDelete}
        aria-label={tc.deleteSlot}
        title={tc.deleteSlot}
        className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
      </button>
    </li>
  )
}

function formatDate(iso: string): string {
  // Display "YYYY-MM-DD" as-is for compactness — the page itself is bilingual
  // but this is a coordinator card; we keep the value compact and readable.
  // Convert to dd.mm. for German locale users; otherwise keep ISO.
  try {
    const [y, m, d] = iso.split('-')
    if (!y || !m || !d) return iso
    return `${d}.${m}.`
  } catch {
    return iso
  }
}
