import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataGrid } from '@/components/ui/DataGrid'
import { TypeEntrepriseFormModal } from './components/TypeEntrepriseFormModal'
import { SecteurFormModal } from './components/SecteurFormModal'
import { SousSecteurFormModal } from './components/SousSecteurFormModal'
import { SituationMatrimonialeFormModal } from './components/SituationMatrimonialeFormModal'
import { TypeEmploiFormModal } from './components/TypeEmploiFormModal'
import { IndicateurFormModal } from './components/IndicateurFormModal'
import { useReferentielsGrid, type ReferentielTab } from './hooks/useReferentielsGrid'

const TABS_CONFIG = [
  { id: 'secteurs', label: 'Secteurs d\'activité', sing: 'secteur' },
  { id: 'sous_secteurs', label: 'Sous-secteurs', sing: 'sous-secteur' },
  { id: 'type_entreprises', label: 'Types d\'entreprise', sing: 'type' },
  { id: 'pieces_identite', label: 'Pièces d\'identité', sing: 'pièce' },
  { id: 'situation_matrimoniale', label: 'Situations matrimoniales', sing: 'situation' },
  { id: 'type_emplois', label: 'Types d\'emploi', sing: 'type' },
  { id: 'indicateurs', label: 'Indicateurs de suivi', sing: 'indicateur' },
] as const

export function ReferentielsPage() {
  const [activeTab, setActiveTab] = useState<ReferentielTab>('secteurs')
  const [searchQuery, setSearchQuery] = useState('')
  
  const { columnDefs, data, isLoading, modalNode } = useReferentielsGrid(activeTab, searchQuery)

  return (
    <>
      {modalNode}
    <div className="space-y-2">

      <Tabs 
        value={activeTab} 
        onValueChange={(val) => { setActiveTab(val as ReferentielTab); setSearchQuery(''); }} 
        className="w-full"
      >
        <div className="overflow-x-auto w-full no-scrollbar">
          <TabsList className="flex items-center gap-1 border-b border-slate-200 w-max min-w-full bg-transparent p-0 h-auto rounded-none justify-start">
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

        {TABS_CONFIG.map(tab => (
          <TabsContent key={tab.id} value={tab.id} className="mt-0 outline-none">
            {/* Toolbar (.pgt) */}
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
              {(() => {
              const btn = (
                <Button className="h-9">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau {tab.sing}
                </Button>
              )
              switch (tab.id) {
                case 'type_entreprises': return <TypeEntrepriseFormModal>{btn}</TypeEntrepriseFormModal>
                case 'secteurs': return <SecteurFormModal>{btn}</SecteurFormModal>
                case 'sous_secteurs': return <SousSecteurFormModal>{btn}</SousSecteurFormModal>
                case 'situation_matrimoniale': return <SituationMatrimonialeFormModal>{btn}</SituationMatrimonialeFormModal>
                case 'type_emplois': return <TypeEmploiFormModal>{btn}</TypeEmploiFormModal>
                case 'indicateurs': return <IndicateurFormModal>{btn}</IndicateurFormModal>
                default: return btn
              }
            })()}
            </div>

            <Card className="p-0 overflow-hidden border-slate-200 rounded-lg shadow-sm">
              {isLoading ? (
                <div className="w-full h-[calc(100vh-300px)] flex flex-col">
                  {/* Entête du tableau simulé */}
                  <div className="h-[48px] bg-[#fafbfd] border-b border-[#E5EAF1] flex items-center px-4 gap-4">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-32" />
                    <div className="flex-1" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  {/* Lignes du tableau */}
                  <div className="flex-1 p-4 space-y-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-50 last:border-0">
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-5 w-48" />
                        <div className="flex-1" />
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-7 w-7 rounded-md" />
                          <Skeleton className="h-7 w-7 rounded-md" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <DataGrid 
                  rowData={data} 
                  columnDefs={columnDefs} 
                  height="calc(100vh - 300px)"
                  rowHeight={55}
                  defaultColDef={{
                    sortable: true,
                    filter: true,
                    resizable: true,
                  }}
                />
              )}
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
    </>
  )
}
