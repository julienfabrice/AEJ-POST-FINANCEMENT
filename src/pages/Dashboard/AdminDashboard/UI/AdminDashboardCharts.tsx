import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'
import { DashboardCard } from '../../shared/components/DashboardCard'
import { DashboardBarChart } from '../../shared/components/DashboardBarChart'
import { DashboardHBarChart } from '../../shared/components/DashboardHBarChart'
import { DashboardStatCard } from '../../shared/components/DashboardStatCard'
import { DataGrid } from '@/components/ui/DataGrid'
import { useAdminCharts } from '../hooks/useAdminCharts'

export function AdminDashboardCharts() {
  const { etapeItems, agenceItems, regionItems, financementRows, suiviStats, isLoading } = useAdminCharts()

  const financementColDefs = useMemo<ColDef[]>(() => [
    { field: 'annee', headerName: 'Année', flex: 1, cellClass: 'font-mono text-[#5A6B80]' },
    { field: 'region', headerName: 'Région / Agence', flex: 2, cellClass: 'font-bold text-[#E7722B]' },
    { field: 'montant', headerName: 'Montant financé', flex: 2, cellClass: 'font-mono text-[#131C29]' },
  ], [])

  const loadingBlock = (h: string) => (
    <div className={`flex items-center justify-center text-sm text-gray-500`} style={{ height: h }}>
      Chargement...
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Ligne 1 : Étapes + Régions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Micro-projets par étape du parcours">
          {isLoading ? loadingBlock('170px') : <DashboardBarChart items={etapeItems} />}
        </DashboardCard>

        <DashboardCard title="Projets financés par région">
          {isLoading ? loadingBlock('160px') : <DashboardHBarChart items={regionItems} />}
        </DashboardCard>
      </div>

      {/* Ligne 2 : Agences + Suivi terrain */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Projets par agence">
          {isLoading ? loadingBlock('160px') : (
            agenceItems.length > 0
              ? <DashboardHBarChart items={agenceItems} />
              : <p className="text-sm text-gray-400 py-4">Aucune donnée disponible</p>
          )}
        </DashboardCard>

        <DashboardCard title="Situation du suivi terrain">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px]">
            {suiviStats.map((s, i) => (
              <DashboardStatCard key={i} label={s.label} value={s.value} color={s.color} />
            ))}
          </div>
        </DashboardCard>
      </div>

      {/* Ligne 3 : Financement par agence (tableau API) */}
      <DashboardCard title="Financement par agence">
        {isLoading ? loadingBlock('200px') : (
          financementRows.length > 0 ? (
            <DataGrid
              rowData={financementRows}
              columnDefs={financementColDefs}
              height="220px"
              rowHeight={45}
              pagination={false}
              defaultColDef={{ sortable: true, filter: false, resizable: true }}
            />
          ) : (
            <p className="text-sm text-gray-400 py-4">Aucune donnée disponible</p>
          )
        )}
      </DashboardCard>
    </div>
  )
}
