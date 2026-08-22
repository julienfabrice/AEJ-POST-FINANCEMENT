import { useState } from 'react'
import { Search, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataGrid } from '@/components/ui/DataGrid'

import { useIndicateursGrid, type IndicateurTab } from './hooks/useIndicateursGrid'
import { PlanificationTab } from './components/PlanificationTab'
import { IndicateursKPIs } from './UI/IndicateursKPIs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const TABS_CONFIG = [
  { id: 'plan', label: 'Planification & taux', sing: 'planification' },
  { id: 'ind', label: 'Indicateurs', sing: 'indicateur' },
  { id: 'rel', label: 'Relevés de suivi', sing: 'relevé' },
  { id: 'fic', label: 'Fiches de suivi', sing: 'fiche' },
  { id: 'q', label: 'Questions', sing: 'question' }
] as const

export function IndicateursPage() {
  const [activeTab, setActiveTab] = useState<IndicateurTab>('plan')
  const [searchQuery, setSearchQuery] = useState('')

  const { columnDefs, data, isLoading, modalNode } = useIndicateursGrid(activeTab, searchQuery)

  return (
    <div className="space-y-6">
      {modalNode}
      
      <div>
        <h1 className="text-2xl font-extrabold text-[#131C29] mb-1">Indicateurs &amp; suivi</h1>
        <p className="text-[#5A6B80] text-sm">Indicateurs planifiés (valeur cible) alimentés par les fiches de suivi mensuelles des bénéficiaires.</p>
      </div>

      <IndicateursKPIs />

      <div className="space-y-2">
        <Tabs 
          value={activeTab} 
          onValueChange={(val) => { setActiveTab(val as IndicateurTab); setSearchQuery(''); }} 
          className="w-full"
        >
          <div className="overflow-x-auto w-full no-scrollbar">
            <TabsList className="flex items-center gap-1 border-b border-slate-200 w-max min-w-full bg-transparent p-0 h-auto rounded-none justify-start mb-4">
              {TABS_CONFIG.map(tab => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="!bg-transparent !shadow-none after:hidden px-4 py-2.5 text-[13.5px] font-semibold text-slate-500 border-t-0 border-l-0 border-r-0 border-b-[2.5px] border-transparent data-[state=active]:text-[#E7722B] data-[state=active]:!border-[#E7722B] hover:text-[#131C29] whitespace-nowrap -mb-[1px] transition-colors rounded-none"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {TABS_CONFIG.map(tab => {
            if (tab.id === 'plan') {
              return (
                <TabsContent key={tab.id} value={tab.id} className="mt-0 outline-none space-y-4">
                  <PlanificationTab />
                </TabsContent>
              )
            }

            const disabledBtn = (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="inline-block cursor-not-allowed">
                      <Button className="h-9 opacity-50 pointer-events-none">
                        <Plus className="w-4 h-4 mr-2" />
                        {tab.id === 'fic' || tab.id === 'q' ? 'Nouvelle' : 'Nouveau'} {tab.sing}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    Fonctionnalité en cours de développement
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )

            return (
              <TabsContent key={tab.id} value={tab.id} className="mt-0 outline-none">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 my-4">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      placeholder={`Rechercher un ${tab.sing}…`} 
                      className="pl-9 h-9 bg-white border-slate-200"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <span className="text-[12.5px] text-slate-500 whitespace-nowrap">
                    {isLoading ? 'Chargement...' : `${data.length} ${tab.label.toLowerCase()}`}
                  </span>
                  <div className="flex-1" />
                  
                  {disabledBtn}
                </div>

                <Card className="p-0 overflow-hidden border-slate-200 rounded-lg shadow-sm">
                  <DataGrid 
                    rowData={data} 
                    columnDefs={columnDefs} 
                    getRowId={(params: any) => params.data.id} 
                    height="calc(100vh - 350px)"
                    rowHeight={55}
                    defaultColDef={{
                      sortable: true,
                      filter: true,
                      resizable: true,
                    }}
                  />
                </Card>
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </div>
  )
}
