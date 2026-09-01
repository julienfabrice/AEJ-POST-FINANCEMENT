import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'

import { DashboardCard } from '../../shared/components/DashboardCard'
import { DashboardStatCard } from '../../shared/components/DashboardStatCard'
import { DashboardHBarChart } from '../../shared/components/DashboardHBarChart'
import { DataGrid } from '@/components/ui/DataGrid'
import { useAdminEntreprises } from '../hooks/useAdminEntreprises'

export function AdminDashboardEntreprises() {
  const { kpis, emploisItems, typesItems, topRows, isLoading } = useAdminEntreprises()

  const topColDefs = useMemo<ColDef[]>(() => [
    { field: 'rang', headerName: '#', width: 50, cellClass: 'font-mono text-[#5A6B80]' },
    { field: 'entreprise', headerName: 'Entreprise', flex: 2, cellClass: 'font-bold text-[#131C29]' },
    { field: 'secteur', headerName: 'Secteur', flex: 2, cellClass: 'text-[#5A6B80]' },
    { field: 'emplois', headerName: 'Emplois créés', flex: 1, type: 'numericColumn', cellClass: 'font-mono font-bold text-[#20A83A]' },
  ], [])

  const loading = (h: string) => (
    <div className="flex items-center justify-center text-sm text-gray-500" style={{ height: h }}>Chargement...</div>
  )

  const kpiStats = [
    { label: "Entreprises créées", value: kpis?.nombre_entreprises ?? '–', color: '#E7722B' },
    { label: "Emplois créés", value: kpis?.emplois_crees ?? '–', color: '#20A83A' },
    { label: "Emplois femmes", value: kpis?.emplois_femmes ?? '–', color: '#2D6BD4' },
    { label: "Emplois jeunes", value: kpis?.emplois_jeunes ?? '–', color: '#8a6503' },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* KPIs emplois */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <DashboardStatCard key={i} label="–" value="…" />)
          : kpiStats.map((s, i) => <DashboardStatCard key={i} label={s.label} value={s.value ?? '–'} color={s.color} />)}
      </div>

      {/* Charts emplois */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Emplois par secteur d'activité">
          {isLoading ? loading('160px') : (
            emploisItems.length > 0
              ? <DashboardHBarChart items={emploisItems} />
              : <p className="text-sm text-gray-400 py-4">Aucune donnée</p>
          )}
        </DashboardCard>

        <DashboardCard title="Types d'emplois">
          {isLoading ? loading('160px') : (
            typesItems.length > 0
              ? <DashboardHBarChart items={typesItems} />
              : <p className="text-sm text-gray-400 py-4">Aucune donnée</p>
          )}
        </DashboardCard>
      </div>

      {/* Top recruteuses */}
      <DashboardCard title="Top entreprises recruteuses">
        {isLoading ? loading('200px') : (
          topRows.length > 0 ? (
            <DataGrid
              rowData={topRows}
              columnDefs={topColDefs}
              height="240px"
              rowHeight={45}
              pagination={false}
              defaultColDef={{ sortable: true, filter: false, resizable: true }}
            />
          ) : (
            <p className="text-sm text-gray-400 py-4">Aucune donnée</p>
          )
        )}
      </DashboardCard>
    </div>
  )
}
