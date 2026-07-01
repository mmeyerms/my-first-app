'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useT } from '@/lib/i18n/client'
import { WochenbettView } from './WochenbettView'
import { HelpCoordinator } from './HelpCoordinator'

type TabKey = 'liste' | 'chef'

interface Props {
  initialTab?: TabKey
}

export function WochenbettTabs({ initialTab = 'liste' }: Props) {
  const t = useT()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<TabKey>(initialTab)

  useEffect(() => {
    const q = searchParams?.get('tab')
    if (q === 'chef' || q === 'liste') {
      if (q !== tab) setTab(q)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  function handleChange(next: string) {
    const nextKey: TabKey = next === 'chef' ? 'chef' : 'liste'
    setTab(nextKey)
    const params = new URLSearchParams(searchParams?.toString() ?? '')
    params.set('tab', nextKey)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <Tabs value={tab} onValueChange={handleChange} className="w-full">
      <TabsList className="mb-4 grid w-full grid-cols-2">
        <TabsTrigger value="liste">{t.wochenbett.tabList}</TabsTrigger>
        <TabsTrigger value="chef">{t.wochenbett.tabChef}</TabsTrigger>
      </TabsList>

      <TabsContent value="liste" className="focus-visible:outline-none">
        <WochenbettView />
      </TabsContent>

      <TabsContent value="chef" className="focus-visible:outline-none">
        <HelpCoordinator />
      </TabsContent>
    </Tabs>
  )
}
