import { remboursementDeclarationServices } from '@/services/remboursementsDeclarations.services'
import { useMemo, useState } from 'react'
import type { ColDef, ValueFormatterParams } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'
import { RemboursementDeclarationStatutCellRenderer } from '../components/RemboursementDeclarationStatutCellRenderer'
import { RemboursementDeclarationFormModal } from '../components/RemboursementDeclarationFormModal'
import type { REMBOURSEMENT_DECLARATION_T } from '@/types'

const formatMontant = (params: ValueFormatterParams) =>
  typeof params.value === 'number' ? params.value.toLocaleString('fr-FR') : params.value

export function useRemboursementsDeclarationsGrid(searchQuery: string) {
  const { data: fetchedData = [], isLoading } = remboursementDeclarationServices.useGetAll()
  const { mutate: deleteMutation } = remboursementDeclarationServices.useDelete()
  const [editingItem, setEditingItem] = useState<REMBOURSEMENT_DECLARATION_T | null>(null)

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'promoteur_id', headerName: 'Promoteur', width: 110 },
    { field: 'budget_id', headerName: 'Budget', width: 100 },
    { field: 'montant_declare', headerName: 'Montant déclaré', width: 160, valueFormatter: formatMontant },
    { field: 'date_declaree', headerName: 'Date déclarée', width: 130 },
    { field: 'reference_banque', headerName: 'Référence bancaire', width: 160 },
    { field: 'statut', headerName: 'Statut', width: 220, cellRenderer: RemboursementDeclarationStatutCellRenderer },
    {
      headerName: 'Actions', width: 100, minWidth: 100, sortable: false, filter: false,
      cellRenderer: ActionsCellRenderer,
      cellRendererParams: { onEdit: (row: REMBOURSEMENT_DECLARATION_T) => setEditingItem(row), onDelete: (id: number) => deleteMutation(id) },
    },
  ], [deleteMutation])

  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || fetchedData.length === 0) return fetchedData
    const fuse = new Fuse(fetchedData, { keys: ['reference_banque'], threshold: 0.3, ignoreLocation: true })
    return fuse.search(searchQuery).map((r) => r.item)
  }, [fetchedData, searchQuery])

  const modalNode = (
    <RemboursementDeclarationFormModal open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)} initialData={editingItem} />
  )

  return { columnDefs, data: filteredData, isLoading, modalNode }
}
