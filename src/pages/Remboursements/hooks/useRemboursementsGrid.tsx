import { remboursementServices } from '@/services/remboursements.services'
import { useMemo, useState } from 'react'
import type { ColDef, ValueFormatterParams } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'
import { RemboursementStatutCellRenderer } from '../components/RemboursementStatutCellRenderer'
import { RemboursementFormModal } from '../components/RemboursementFormModal'
import type { REMBOURSEMENT_T } from '@/types'

const formatMontant = (params: ValueFormatterParams) =>
  typeof params.value === 'number' ? params.value.toLocaleString('fr-FR') : params.value

export function useRemboursementsGrid(searchQuery: string) {
  const { data: fetchedData = [], isLoading } = remboursementServices.useGetAll()
  const { mutate: deleteMutation } = remboursementServices.useDelete()
  const [editingItem, setEditingItem] = useState<REMBOURSEMENT_T | null>(null)

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'promoteur_id', headerName: 'Promoteur', width: 110 },
    { field: 'budget_id', headerName: 'Budget', width: 100 },
    { field: 'montant_echu', headerName: 'Montant échu', width: 140, valueFormatter: formatMontant },
    { field: 'montant_paye', headerName: 'Montant payé', width: 140, valueFormatter: formatMontant },
    { field: 'montant_impaye', headerName: 'Montant impayé', width: 140, valueFormatter: formatMontant },
    { field: 'penalites', headerName: 'Pénalités', width: 120, valueFormatter: formatMontant },
    { field: 'date_paiement', headerName: 'Date paiement', width: 130 },
    { field: 'statut', headerName: 'Statut', width: 170, cellRenderer: RemboursementStatutCellRenderer },
    {
      headerName: 'Actions', width: 100, minWidth: 100, sortable: false, filter: false,
      cellRenderer: ActionsCellRenderer,
      cellRendererParams: { onEdit: (row: REMBOURSEMENT_T) => setEditingItem(row), onDelete: (id: number) => deleteMutation(id) },
    },
  ], [deleteMutation])

  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || fetchedData.length === 0) return fetchedData
    const fuse = new Fuse(fetchedData, { keys: ['observations'], threshold: 0.3, ignoreLocation: true })
    return fuse.search(searchQuery).map((r) => r.item)
  }, [fetchedData, searchQuery])

  const modalNode = (
    <RemboursementFormModal open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)} initialData={editingItem} />
  )

  return { columnDefs, data: filteredData, isLoading, modalNode }
}
