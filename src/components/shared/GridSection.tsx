import { Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { DataGrid } from '@/components/ui/DataGrid'
import type { ColDef } from 'ag-grid-community'

interface GridSectionProps {
  columnDefs: ColDef[]
  data: unknown[]
  isLoading: boolean
  searchQuery: string
  onSearchChange: (v: string) => void
  searchPlaceholder: string
  countLabel: string
  newButton: React.ReactNode
}

export function GridSection({
  columnDefs, data, isLoading, searchQuery, onSearchChange, searchPlaceholder, countLabel, newButton,
}: GridSectionProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 my-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder={searchPlaceholder}
            className="pl-9 h-9 bg-white border-slate-200"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <span className="text-[12.5px] text-slate-500 whitespace-nowrap">
          {isLoading ? 'Chargement...' : countLabel}
        </span>
        <div className="flex-1" />
        {newButton}
      </div>

      <Card className="p-0 overflow-hidden border-slate-200 rounded-lg shadow-sm">
        {isLoading ? (
          <div className="w-full h-[calc(100vh-360px)] flex flex-col">
            <div className="h-[48px] bg-[#fafbfd] border-b border-[#E5EAF1] flex items-center px-4 gap-4">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex-1 p-4 space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          </div>
        ) : (
          <DataGrid
            rowData={data}
            columnDefs={columnDefs}
            height="calc(100vh - 360px)"
            rowHeight={55}
            defaultColDef={{ sortable: true, filter: true, resizable: true }}
          />
        )}
      </Card>
    </>
  )
}

export const TAB_TRIGGER_CLASS = "!bg-transparent !shadow-none after:hidden px-4 py-2.5 text-[13.5px] font-semibold text-slate-500 border-t-0 border-l-0 border-r-0 border-b-[2.5px] border-transparent data-[state=active]:text-[#E7722B] data-[state=active]:!border-[#E7722B] hover:text-[#131C29] whitespace-nowrap -mb-[1px] transition-colors rounded-none"

export const SUBTAB_TRIGGER_CLASS = "text-[13px] px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded"
