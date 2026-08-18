import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { WorkflowTimeline } from './UI/WorkflowTimeline'
import { MOCK_DISPOSITIFS, MOCK_WORKFLOWS } from '@/mock'

export function WorkflowsPage() {
  const [activeTab, setActiveTab] = useState<string>(MOCK_DISPOSITIFS[0].id)
  const wf = MOCK_WORKFLOWS[activeTab]

  return (
    <div className="space-y-6">

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <div className="overflow-x-auto w-full no-scrollbar">
          <TabsList className="flex items-center gap-1 border-b border-slate-200 w-max min-w-full bg-transparent p-0 h-auto rounded-none justify-start">
            {MOCK_DISPOSITIFS.map(d => (
              <TabsTrigger 
                key={d.id} 
                value={d.id}
                className="!bg-transparent !shadow-none after:hidden px-4 py-2.5 text-[13.5px] font-semibold text-slate-500 border-t-0 border-l-0 border-r-0 border-b-[2.5px] border-transparent data-[state=active]:text-[#E7722B] data-[state=active]:!border-[#E7722B] hover:text-[#131C29] whitespace-nowrap -mb-[1px] transition-colors rounded-none"
              >
                {d.libelle}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-6 outline-none">
          <div className="mb-6">
            <Button size="sm" className="bg-[#E7722B] hover:bg-[#C85E18] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une étape
            </Button>
          </div>

          <WorkflowTimeline cycles={wf.cycles} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
