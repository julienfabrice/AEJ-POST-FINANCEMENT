import { useState } from 'react'
import { Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataGrid } from '@/components/ui/DataGrid'

import { useLocalitesGrid, type LocaliteTab } from './hooks/useLocalitesGrid'

const TABS_CONFIG = [
  { id: 'divisions', label: 'Divisions régionales', sing: 'une division régionale' },
  { id: 'villes', label: 'Villes', sing: 'une ville' },
  { id: 'communes', label: 'Communes', sing: 'une commune' },
  { id: 'lieux', label: "Lieux d'habitation", sing: 'un lieu' },
] as const

export function LocalitesPage() {
  const [activeTab, setActiveTab] = useState<LocaliteTab>('divisions')
  const [searchQuery, setSearchQuery] = useState('')

  const { columnDefs, data, isLoading, isError, error } = useLocalitesGrid(activeTab, searchQuery)

  return (
    <div className="space-y-2">
      <div>
        <h1 className="text-2xl font-extrabold text-[#131C29]">Localités</h1>
        <p className="text-sm text-[#5A6B80] mt-1">
          Découpage géographique national — synchronisé depuis le portail agenceemploijeunes.ci, en lecture seule.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(val) => { setActiveTab(val as LocaliteTab); setSearchQuery('') }}
        className="w-full"
      >
        <div className="overflow-x-auto w-full no-scrollbar">
          <TabsList className="flex items-center gap-1 border-b border-slate-200 w-max min-w-full bg-transparent p-0 h-auto rounded-none justify-start">
            {TABS_CONFIG.map((tab) => (
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

        {TABS_CONFIG.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-0 outline-none">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 my-4">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder={`Rechercher ${tab.sing}…`}
                  className="pl-9 h-9 bg-white border-slate-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <span className="text-[12.5px] text-slate-500 whitespace-nowrap">
                {isLoading ? 'Chargement...' : `${data.length} ${tab.label.toLowerCase()}`}
              </span>
              <div className="flex-1" />
              <Badge variant="outline" className="ml-auto bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 whitespace-nowrap">
                Fourni par l'AEJ
              </Badge>
            </div>

            <Card className="p-0 overflow-hidden border-slate-200 rounded-lg shadow-sm">
              {isLoading ? (
                <div className="w-full h-[calc(100vh-300px)] flex flex-col">
                  <div className="h-[48px] bg-[#fafbfd] border-b border-[#E5EAF1] flex items-center px-4 gap-4">
                    <Skeleton className="h-4 w-32" />
                    <div className="flex-1" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex-1 p-4 space-y-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-50 last:border-0">
                        <Skeleton className="h-5 w-48" />
                        <div className="flex-1" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : isError ? (
                <div className="flex flex-col items-center justify-center gap-2 py-16 text-red-600">
                  <span className="text-sm font-medium">Impossible de charger les données</span>
                  {error instanceof Error && <span className="text-xs text-red-500">{error.message}</span>}
                </div>
              ) : (
                <DataGrid
                  rowData={data}
                  columnDefs={columnDefs}
                  height="calc(100vh - 300px)"
                  rowHeight={55}
                  defaultColDef={{ sortable: true, filter: true, resizable: true }}
                />
              )}
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
