import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { DataGrid } from '@/components/ui/DataGrid'
import { BudgetFormModal } from './components/BudgetFormModal'
import { useBudgetsGrid } from './hooks/useBudgetsGrid'

export function FinancementsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { columnDefs, data, isLoading, modalNode } = useBudgetsGrid(searchQuery)

  return (
    <>
      {modalNode}
      <div className="space-y-2">
        <div>
          <h1 className="text-2xl font-extrabold text-[#131C29]">Financements</h1>
          <p className="text-sm text-[#5A6B80] mt-1">
            Budgets : accord, source, devise, convention et validation par micro-projet.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 my-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Rechercher un budget…"
              className="pl-9 h-9 bg-white border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <span className="text-[12.5px] text-slate-500 whitespace-nowrap">
            {isLoading ? 'Chargement...' : `${data.length} budget(s)`}
          </span>
          <div className="flex-1" />
          <BudgetFormModal>
            <Button className="h-9">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau budget
            </Button>
          </BudgetFormModal>
        </div>

        <Card className="p-0 overflow-hidden border-slate-200 rounded-lg shadow-sm">
          {isLoading ? (
            <div className="w-full h-[calc(100vh-300px)] flex flex-col">
              <div className="h-[48px] bg-[#fafbfd] border-b border-[#E5EAF1] flex items-center px-4 gap-4">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-32" />
                <div className="flex-1" />
                <Skeleton className="h-4 w-16" />
              </div>
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
              defaultColDef={{ sortable: true, filter: true, resizable: true }}
            />
          )}
        </Card>
      </div>
    </>
  )
}
