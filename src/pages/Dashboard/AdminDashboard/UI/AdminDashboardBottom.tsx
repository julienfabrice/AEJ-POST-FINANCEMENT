import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'
import { MOCK_ANNEE_REGION } from '@/mock'
import { projetsServices } from '@/services/projets.services'
import { DataGrid } from '@/components/ui/DataGrid'
import { DashboardProjectsGrid } from '../../shared/components/DashboardProjectsGrid'
import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'

export function AdminDashboardBottom() {
  const regionColumnDefs = useMemo<ColDef[]>(() => [
    { field: 'annee', headerName: 'Année', flex: 1, cellClass: 'font-mono text-[#5A6B80]' },
    { field: 'region', headerName: 'Région', flex: 2, cellClass: 'font-bold text-[#E7722B]' },
    { field: 'montant', headerName: 'Montant financé', flex: 2, cellClass: 'font-mono text-[#131C29]' },
  ], [])

  const { data, isLoading } = projetsServices.useGetAll(1, 5)
  const projects = data?.data ?? []

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-[#E5EAF1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-[7px] overflow-hidden">
        <CardHeader className="border-b border-[#EEF2F7] px-4">
          <CardTitle className="text-[14px] font-bold text-[#131C29]">Montant financé par année et par région</CardTitle>
        </CardHeader>
        <CardContent>
          <DataGrid
            rowData={MOCK_ANNEE_REGION}
            columnDefs={regionColumnDefs}
            height="200px"
            rowHeight={45}
            pagination={false}
            defaultColDef={{ sortable: true, filter: false, resizable: true }}
          />
        </CardContent>
      </Card>

      <Card className="border-[#E5EAF1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-[7px] overflow-hidden">
        <CardHeader className="border-b border-[#EEF2F7] py-3 px-4 flex flex-row items-center justify-between">
          <CardTitle className="text-[14px] font-bold text-[#131C29]">Dossiers récents</CardTitle>
          <a href="#" className="flex items-center text-xs font-semibold text-[#5A6B80] hover:text-[#131C29] transition-colors">
            Tout voir
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </a>
        </CardHeader>
        <CardContent className="p-0 border-t border-slate-100">
          <DashboardProjectsGrid projects={projects} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  )
}
