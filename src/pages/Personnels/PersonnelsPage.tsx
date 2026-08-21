import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { DataGrid } from '@/components/ui/DataGrid'
import { usePersonnelsGrid } from './hooks/usePersonnelsGrid'
import { PersonnelsFilters, type PersonnelsFilterState } from './components/PersonnelsFilters'
import { PersonnelFormModal } from './components/PersonnelFormModal'

export function PersonnelsPage() {
  const [filters, setFilters] = useState<PersonnelsFilterState>({ search: '' })
  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState<any>(null)
  
  const handleEdit = (data: any) => {
    setEditData(data)
    setModalOpen(true)
  }

  const { columnDefs, data, isLoading, isError, error, availableRoles, availableFonctions } = usePersonnelsGrid(filters, handleEdit)

  return (
    <div className="space-y-4">
      <PersonnelsFilters 
        filters={filters} 
        setFilters={setFilters} 
        availableRoles={availableRoles} 
        availableFonctions={availableFonctions} 
        onAddClick={() => setModalOpen(true)}
      />

      <Card className="p-0 overflow-hidden border-slate-200 rounded-lg shadow-sm">
        {isLoading ? (
          <div className="w-full h-[calc(100vh-160px)] flex flex-col">
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
          <div className="relative">
            <DataGrid
              rowData={data}
              columnDefs={columnDefs}
              height="calc(100vh - 160px)"
              rowHeight={55}
              defaultColDef={{ sortable: true, filter: true, resizable: true }}
            />
          </div>
        )}
      </Card>
      <PersonnelFormModal 
        open={modalOpen} 
        onOpenChange={(open) => {
          setModalOpen(open)
          if (!open) setEditData(null)
        }} 
        editData={editData} 
      />
    </div>
  )
}
