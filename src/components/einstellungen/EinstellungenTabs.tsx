'use client'

import type { UserPreferences } from '@/lib/preferences/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useT } from '@/lib/i18n/client'
import { DesignSection } from './sections/DesignSection'
import { SituationSection } from './sections/SituationSection'
import { SnapshotSection } from './sections/SnapshotSection'
import { GreetingSection } from './sections/GreetingSection'
import { WocheSection } from './sections/WocheSection'
import { TermineSection } from './sections/TermineSection'
import { TagebuchSection } from './sections/TagebuchSection'
import { GeburtsplanSection } from './sections/GeburtsplanSection'
import { ChecklistPresetsSection } from './sections/ChecklistPresetsSection'
import { PartnerSection } from './sections/PartnerSection'
import { KinderwunschSection } from './sections/KinderwunschSection'
import { WochenbettSection } from './sections/WochenbettSection'
import { NotificationsSection } from './sections/NotificationsSection'

interface Props {
  // initialPrefs kept in the signature so the server-page callsite doesn't
  // break, but we intentionally do NOT mount a second PreferencesProvider
  // here — the root layout owns the provider. Nesting caused writes from
  // /einstellungen (accent color, font size) to update inner state only,
  // so PreferencesEffects in the outer provider never applied the change.
  initialPrefs: UserPreferences
  pregnancyMode: string | null
}

export function EinstellungenTabs({ initialPrefs: _initialPrefs, pregnancyMode }: Props) {
  void _initialPrefs
  const t = useT()
  const tabs = t.settings.tabs
  const isPlanning = pregnancyMode === 'planning'
  return (
    <>
      <Tabs defaultValue="design" className="w-full">
        <div className="mb-6 -mx-4 overflow-x-auto px-4">
          <TabsList className="flex w-max gap-1">
            <TabsTrigger value="design">{tabs.design}</TabsTrigger>
            <TabsTrigger value="situation">{tabs.situation}</TabsTrigger>
            <TabsTrigger value="snapshot">{tabs.snapshot}</TabsTrigger>
            <TabsTrigger value="greeting">{tabs.greeting}</TabsTrigger>
            <TabsTrigger value="woche">{tabs.woche}</TabsTrigger>
            <TabsTrigger value="termine">{tabs.termine}</TabsTrigger>
            <TabsTrigger value="tagebuch">{tabs.tagebuch}</TabsTrigger>
            <TabsTrigger value="geburtsplan">{tabs.geburtsplan}</TabsTrigger>
            <TabsTrigger value="checklists">{tabs.checklists}</TabsTrigger>
            <TabsTrigger value="partner">{tabs.partner}</TabsTrigger>
            {isPlanning && <TabsTrigger value="kinderwunsch">{tabs.kinderwunsch}</TabsTrigger>}
            <TabsTrigger value="wochenbett">{tabs.wochenbett}</TabsTrigger>
            <TabsTrigger value="notifications">{tabs.notifications}</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="design"><DesignSection /></TabsContent>
        <TabsContent value="situation"><SituationSection /></TabsContent>
        <TabsContent value="snapshot"><SnapshotSection /></TabsContent>
        <TabsContent value="greeting"><GreetingSection /></TabsContent>
        <TabsContent value="woche"><WocheSection /></TabsContent>
        <TabsContent value="termine"><TermineSection /></TabsContent>
        <TabsContent value="tagebuch"><TagebuchSection /></TabsContent>
        <TabsContent value="geburtsplan"><GeburtsplanSection /></TabsContent>
        <TabsContent value="checklists"><ChecklistPresetsSection /></TabsContent>
        <TabsContent value="partner"><PartnerSection /></TabsContent>
        {isPlanning && (
          <TabsContent value="kinderwunsch"><KinderwunschSection /></TabsContent>
        )}
        <TabsContent value="wochenbett"><WochenbettSection /></TabsContent>
        <TabsContent value="notifications"><NotificationsSection /></TabsContent>
      </Tabs>
    </>
  )
}
