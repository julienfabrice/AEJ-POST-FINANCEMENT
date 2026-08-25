import { decaissementServices } from '@/services/decaissements.services'
import { useMemo, useState } from 'react'
import type { ColDef, ValueFormatterParams } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'
import { DecaissementStatutCellRenderer } from '../components/DecaissementStatutCellRenderer'
import { DecaissementFormModal } from '../components/DecaissementFormModal'
import type { DECAISSEMENT_T } from '@/types'

const formatMontant = (params: ValueFormatterParams) =>
  typeof params.value === 'number' ? params.value.toLocaleString('fr-FR') : params.value

export function useDecaissementsGrid(searchQuery: string) {
  const { data: fetchedData = [], isLoading } = decaissementServices.useGetAll()
  const { mutate: deleteMutation } = decaissementServices.useDelete()
  const [editingItem, setEditingItem] = useState<DECAISSEMENT_T | null>(null)

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'plan_decaissement_id', headerName: 'Plan', width: 100 },
    { field: 'agence_id', headerName: 'Agence', width: 100 },
    { field: 'montant_decaisse', headerName: 'Montant décaissé', width: 160, valueFormatter: formatMontant },
    { field: 'date_decaissement', headerName: 'Date', width: 130 },
    { field: 'reference_banque', headerName: 'Référence bancaire', width: 160 },
    { field: 'statut', headerName: 'Statut', width: 200, cellRenderer: DecaissementStatutCellRenderer },
    {
      headerName: 'Actions', width: 100, minWidth: 100, sortable: false, filter: false,
      cellRenderer: ActionsCellRenderer,
      cellRendererParams: { onEdit: (row: DECAISSEMENT_T) => setEditingItem(row), onDelete: (id: number) => deleteMutation(id) },
    },
  ], [deleteMutation])

  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || fetchedData.length === 0) return fetchedData
    const fuse = new Fuse(fetchedData, { keys: ['reference_banque'], threshold: 0.3, ignoreLocation: true })
    return fuse.search(searchQuery).map((r) => r.item)
  }, [fetchedData, searchQuery])

  const modalNode = (
    <DecaissementFormModal open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)} initialData={editingItem} />
  )

  return { columnDefs, data: filteredData, isLoading, modalNode }
}
