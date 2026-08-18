import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataGrid } from '@/components/ui/DataGrid'
import { useReferentielsGrid, type ReferentielTab } from './hooks/useReferentielsGrid'

import {
  MOCK_SECTEURS,
  MOCK_SOUS_SECTEURS,
  MOCK_TYPE_ENTREPRISES,
  MOCK_PIECES_IDENTITE,
  MOCK_SITUATION_MATRIMONIALE,
  MOCK_TYPE_EMPLOIS,
  MOCK_INDICATEURS
} from '@/mock'

const TABS: { id: ReferentielTab; label: string; data: any[]; sing: string }[] = [
  { id: 'secteurs', label: 'Secteurs d\'activité', data: MOCK_SECTEURS, sing: 'secteur' },
  { id: 'sous_secteurs', label: 'Sous-secteurs', data: MOCK_SOUS_SECTEURS, sing: 'sous-secteur' },
  { id: 'type_entreprises', label: 'Types d\'entreprise', data: MOCK_TYPE_ENTREPRISES, sing: 'type' },
  { id: 'pieces_identite', label: 'Pièces d\'identité', data: MOCK_PIECES_IDENTITE, sing: 'pièce' },
  { id: 'situation_matrimoniale', label: 'Situations matrimoniales', data: MOCK_SITUATION_MATRIMONIALE, sing: 'situation' },
  { id: 'type_emplois', label: 'Types d\'emploi', data: MOCK_TYPE_EMPLOIS, sing: 'type' },
  { id: 'indicateurs', label: 'Indicateurs de suivi', data: MOCK_INDICATEURS, sing: 'indicateur' },
]

export function ReferentielsPage() {
  const [activeTab, setActiveTab] = useState<ReferentielTab>('secteurs')
  const { columnDefs } = useReferentielsGrid(activeTab)

  return (
    <div className="space-y-2">

      <Tabs 
        value={activeTab} 
        onValueChange={(val) => setActiveTab(val as ReferentielTab)} 
        className="w-full"
      >
        <div className="overflow-x-auto w-full no-scrollbar">
          <TabsList className="flex items-center gap-1 border-b border-slate-200 w-max min-w-full bg-transparent p-0 h-auto rounded-none justify-start">
            {TABS.map(tab => (
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

        {TABS.map(tab => (
          <TabsContent key={tab.id} value={tab.id} className="mt-0 outline-none">
            {/* Toolbar (.pgt) */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 my-4">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder={`Rechercher un ${tab.sing}…`} 
                  className="pl-9 h-9 bg-white border-slate-200"
                />
              </div>
              <span className="text-[12.5px] text-slate-500 whitespace-nowrap">
                {tab.data.length} {tab.label.toLowerCase()}
              </span>
              <div className="flex-1" />
              <Button className="h-9">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau {tab.sing}
              </Button>
            </div>

            <Card className="p-0 overflow-hidden border-slate-200 rounded-lg shadow-sm">
              <DataGrid 
                rowData={tab.data} 
                columnDefs={columnDefs} 
                height="calc(100vh - 300px)"
                rowHeight={55}
                defaultColDef={{
                  sortable: true,
                  filter: true,
                  resizable: true,
                }}
              />
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
