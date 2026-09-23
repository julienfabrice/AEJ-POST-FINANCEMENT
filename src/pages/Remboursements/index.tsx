import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { SuiviSubTab } from './UI/SuiviSubTab'
import { DeclarationsSubTab } from './UI/DeclarationsSubTab'

export function RemboursementsPage() {
  const [subTab, setSubTab] = useState<'suivi' | 'declarations'>('suivi')

  return (
    <div className="space-y-6">
      <Tabs
        value={subTab}
        onValueChange={(v) => setSubTab(v as 'suivi' | 'declarations')}
        className="w-full"
      >
        <div className="overflow-x-auto w-full no-scrollbar">
          <TabsList className="flex items-center gap-1 border-b border-slate-200 w-max min-w-full bg-transparent p-0 h-auto rounded-none justify-start">
            <TabsTrigger
              value="suivi"
              className="
                  !bg-transparent !shadow-none after:hidden
                  px-4 py-2.5 text-[13.5px] font-semibold text-slate-500
                  border-t-0 border-l-0 border-r-0 border-b-[2.5px] border-transparent
                  data-[state=active]:text-[#E7722B] data-[state=active]:!border-[#E7722B]
                  hover:text-[#131C29] whitespace-nowrap -mb-[1px] transition-colors rounded-none
                "
            >
              Suivi
            </TabsTrigger>
            <TabsTrigger
              value="declarations"
              className="
                  !bg-transparent !shadow-none after:hidden
                  px-4 py-2.5 text-[13.5px] font-semibold text-slate-500
                  border-t-0 border-l-0 border-r-0 border-b-[2.5px] border-transparent
                  data-[state=active]:text-[#E7722B] data-[state=active]:!border-[#E7722B]
                  hover:text-[#131C29] whitespace-nowrap -mb-[1px] transition-colors rounded-none
                "
            >
              Déclarations de paiement
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="suivi" className="mt-5 outline-none space-y-6">
          <SuiviSubTab />
        </TabsContent>

        <TabsContent value="declarations" className="mt-5 outline-none">
          <DeclarationsSubTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
