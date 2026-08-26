import { planRemboursementServices } from '@/services/planRemboursements.services'
import { useMemo } from 'react'
import type { ColDef, ValueFormatterParams } from 'ag-grid-community'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'

const formatMontant = (params: ValueFormatterParams) =>
  typeof params.value === 'number' ? params.value.toLocaleString('fr-FR') : params.value

export function usePlanRemboursementsGrid(microProjetId?: number) {
  const { data: fetchedData = [], isLoading } = planRemboursementServices.useGetAll(microProjetId)
  const { mutate: deleteMutation } = planRemboursementServices.useDelete()

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'micro_projet_id', headerName: 'Micro-projet', width: 130 },
    { field: 'periode', headerName: '#', width: 70 },
    { field: 'echeance_mensuelle', headerName: 'Date échéance', width: 130 },
    { field: 'amortissement_capital', headerName: 'Amortissement', width: 140, valueFormatter: formatMontant },
    { field: 'interets', headerName: 'Intérêts', width: 120, valueFormatter: formatMontant },
    { field: 'montant_echeance', headerName: 'Montant échéance', width: 150, valueFormatter: formatMontant },
    { field: 'capital_rembourse', headerName: 'Capital remboursé', width: 150, valueFormatter: formatMontant },
    { field: 'capital_restant', headerName: 'Capital restant', width: 140, valueFormatter: formatMontant },
    {
      headerName: 'Actions', width: 90, minWidth: 90, sortable: false, filter: false,
      cellRenderer: ActionsCellRenderer,
      cellRendererParams: { onDelete: (id: number) => deleteMutation(id) },
    },
  ], [deleteMutation])

  return { columnDefs, data: fetchedData, isLoading }
}
