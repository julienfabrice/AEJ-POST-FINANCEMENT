import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { DataGrid } from '@/components/ui/DataGrid'

import { ProjetsHeader } from './UI/ProjetsHeader'
import { ProjetsStats } from './UI/ProjetsStats'
import { ProjetsFilters } from './UI/ProjetsFilters'
import { KanbanBoard } from './components/KanbanBoard'
import { useTableData } from './hooks/useTableData'

import { MOCK_PROJETS } from '@/mock'
import { LayoutGrid, List } from 'lucide-react'

type ViewMode = 'kanban' | 'list'

export function ProjetsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('kanban')
  const { columnDefs } = useTableData()

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

      {viewMode === 'list' ? (
        <Card className="p-0 overflow-hidden border-slate-200">
          <DataGrid
            rowData={MOCK_PROJETS}
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
        <KanbanBoard />
      )}
    </div>
  )
}
