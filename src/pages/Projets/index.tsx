import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { DataGrid } from '@/components/ui/DataGrid'
import { Skeleton } from '@/components/ui/skeleton'

import { ProjetsHeader } from './UI/ProjetsHeader'
import { ProjetsStats } from './UI/ProjetsStats'
import { ProjetsFilters } from './UI/ProjetsFilters'
import { KanbanBoard } from './components/KanbanBoard'
import { ProjetDetailsSheet } from './components/ProjetDetailsSheet'
import { useTableData } from './hooks/useTableData'

import { projetsServices } from '@/services/projets.services'
import { LayoutGrid, List } from 'lucide-react'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

type ViewMode = 'kanban' | 'list'

export function ProjetsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('kanban')
  const [selectedProjet, setSelectedProjet] = useState<MICRO_PROJET_T | null>(null)
  
  // We pass setSelectedProjet to the columns so that ActionsCellRenderer can trigger it
  const { columnDefs } = useTableData({ onViewDetails: setSelectedProjet })
  
  const { data: projets = [], isLoading, isError } = projetsServices.useGetAll()

  return (
    <div className="space-y-6">
      <ProjetsHeader />

      <ProjetsStats />

      <ProjetsFilters />
      
      <div className="flex items-center gap-2 bg-slate-100 p-1 w-max rounded-lg border border-slate-200">
        <button
          onClick={() => setViewMode('kanban')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            viewMode === 'kanban' 
              ? 'bg-white text-[#131C29] shadow-sm' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          Kanban
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            viewMode === 'list' 
              ? 'bg-white text-[#131C29] shadow-sm' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
          }`}
        >
          <List className="w-4 h-4" />
          Liste
        </button>
      </div>

      {isLoading ? (
        <div className="h-[400px] flex items-center justify-center space-y-4 flex-col">
          <Skeleton className="w-full h-full rounded-xl" />
        </div>
      ) : isError ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          Une erreur est survenue lors du chargement des micro-projets.
        </div>
      ) : viewMode === 'list' ? (
        <Card className="p-0 overflow-hidden border-slate-200">
          <DataGrid
            rowData={projets}
            columnDefs={columnDefs}
            height="calc(100vh - 450px)"
            rowHeight={60}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
            }}
          />
        </Card>
      ) : (
        <KanbanBoard projets={projets} onViewDetails={setSelectedProjet} />
      )}

      {/* Drawer d'informations détaillées */}
      <ProjetDetailsSheet 
        projet={selectedProjet} 
        open={!!selectedProjet} 
        onOpenChange={(open) => !open && setSelectedProjet(null)} 
      />
    </div>
  )
}
