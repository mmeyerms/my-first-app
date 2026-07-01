'use client'

import { PreferencesProvider } from '@/lib/preferences/client'
import type { UserPreferences } from '@/lib/preferences/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DesignSection } from './sections/DesignSection'
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

interface Props {
  initialPrefs: UserPreferences
  pregnancyMode: string | null
}

export function EinstellungenTabs({ initialPrefs, pregnancyMode }: Props) {
  const isPlanning = pregnancyMode === 'planning'
  return (
    <PreferencesProvider initialPrefs={initialPrefs}>
      <Tabs defaultValue="design" className="w-full">
        <div className="mb-6 -mx-4 overflow-x-auto px-4">
          <TabsList className="flex w-max gap-1">
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="snapshot">Home</TabsTrigger>
            <TabsTrigger value="greeting">Anrede</TabsTrigger>
            <TabsTrigger value="woche">Woche</TabsTrigger>
            <TabsTrigger value="termine">Termine</TabsTrigger>
            <TabsTrigger value="tagebuch">Tagebuch</TabsTrigger>
            <TabsTrigger value="geburtsplan">Geburtsplan</TabsTrigger>
            <TabsTrigger value="checklists">Listen</TabsTrigger>
            <TabsTrigger value="partner">Partner</TabsTrigger>
            {isPlanning && <TabsTrigger value="kinderwunsch">Kinderwunsch</TabsTrigger>}
            <TabsTrigger value="wochenbett">Wochenbett</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="design"><DesignSection /></TabsContent>
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
      </Tabs>
    </PreferencesProvider>
  )
}
