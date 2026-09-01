import { DataGrid } from '@/components/ui/DataGrid'
import { useTableData } from '../hooks/useTableData'
import type { ColDef } from 'ag-grid-community'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

interface Props {
  projects: MICRO_PROJET_T[]
  isLoading?: boolean
  height?: string
  rowHeight?: number
  extraColDefs?: ColDef[]
}

/**
 * Mappe un tableau de MICRO_PROJET_T vers le format attendu par useTableData()
 * puis affiche un DataGrid avec overlay de chargement.
 * Composant standard pour toutes les listes de dossiers dans les dashboards.
 */
export function DashboardProjectsGrid({
  projects,
  isLoading = false,
  height = '320px',
  rowHeight = 55,
}: Props) {
  const { columnDefs } = useTableData()

  const rowData = projects.map(p => ({
    ref: p.code,
    promoteur: p.promoteur ? `${p.promoteur.nom} ${p.promoteur.prenom}` : 'Inconnu',
    dispositif: p.dispositif?.libelle || p.type_projet,
    montant: Number(p.montant_total || 0),
    statut: p.statut,
    date: p.created_at?.split('T')[0] || '',
  }))

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
          <span className="text-sm text-gray-500">Chargement...</span>
        </div>
      )}
      <DataGrid
        rowData={rowData}
        columnDefs={columnDefs}
        height={height}
        rowHeight={rowHeight}
        pagination={false}
        defaultColDef={{ sortable: true, filter: false, resizable: true }}
      />
    </div>
  )
}
