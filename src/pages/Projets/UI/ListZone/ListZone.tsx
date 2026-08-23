import { Card } from '@/components/ui/card'
import { DataGrid } from '@/components/ui/DataGrid'
import { DataPagination } from '@/components/generics/data-pagination'

import { KanbanBoard } from './KanbanBoard'
import { KanbanSkeleton } from '../../components/KanbanSkeleton'
import { ListSkeleton } from '../../components/ListSkeleton'
import { useTableData } from '../../hooks/useTableData'
import { useProjetsData } from '../../hooks/useProjetsData'
import { useProjetsStore } from '@/store/useProjetsStore'

import { LayoutGrid, List } from 'lucide-react'

const PER_PAGE_OPTIONS = [10, 20, 50, 100] as const
const ITEM_LABEL = { singular: 'projet', plural: 'projets' }

export function ListZone() {
  const { viewMode, setViewMode } = useProjetsStore()
  
  const { 
    projets, 
    total,
    page, 
    perPage,
    setPage,
    setPerPage,
    isFetching,
    isError 
  } = useProjetsData()

  const { columnDefs } = useTableData()

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
      </div>

      <Card className="p-0 overflow-hidden border-slate-200">
        {isError ? (
          <div className="p-4 bg-red-50 text-red-600 border-b border-red-100 flex items-center">
            Une erreur est survenue lors du chargement des micro-projets. Veuillez réessayer.
          </div>
        ) : isFetching ? (
          viewMode === 'kanban' ? <KanbanSkeleton /> : <ListSkeleton />
        ) : viewMode === 'list' ? (
          <div className="relative">
            <DataGrid
              rowData={projets}
              columnDefs={columnDefs}
              height="calc(100vh - 450px)"
              rowHeight={60}
              pagination={false}
              defaultColDef={{
                sortable: true,
                filter: true,
                resizable: true,
              }}
            />
          </div>
        ) : (
          <div className="p-4 bg-slate-50">
            <KanbanBoard />
          </div>
        )}

        <DataPagination
          page={page}
          perPage={perPage}
          total={total}
          onPageChange={setPage}
          onPerPageChange={setPerPage}
          perPageOptions={PER_PAGE_OPTIONS}
          itemLabel={ITEM_LABEL}
          isFetching={isFetching}
        />
      </Card>
    </>
  )
}
