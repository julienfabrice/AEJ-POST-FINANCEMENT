import { planDecaissementServices } from '@/services/planDecaissements.services'
import { useMemo, useState } from 'react'
import type { ColDef, ValueFormatterParams } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'
import { PlanDecaissementFormModal } from '../components/PlanDecaissementFormModal'
import type { PLAN_DECAISSEMENT_T } from '@/types'

const formatMontant = (params: ValueFormatterParams) =>
  typeof params.value === 'number' ? params.value.toLocaleString('fr-FR') : params.value

export function usePlanDecaissementsGrid(searchQuery: string) {
  const { data: fetchedData = [], isLoading } = planDecaissementServices.useGetAll()
  const { mutate: deleteMutation } = planDecaissementServices.useDelete()
  const [editingItem, setEditingItem] = useState<PLAN_DECAISSEMENT_T | null>(null)

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'micro_projet_id', headerName: 'Micro-projet', width: 130 },
    { field: 'budget_id', headerName: 'Budget', width: 110 },
    { field: 'montant_planifie', headerName: 'Montant planifié', width: 160, valueFormatter: formatMontant },
    { field: 'date_prevue', headerName: 'Date prévue', width: 130 },
    {
      field: 'lignes', headerName: 'Lignes', width: 100,
      valueGetter: (p) => (p.data?.lignes?.length ?? 0),
    },
    {
      headerName: 'Actions', width: 100, minWidth: 100, sortable: false, filter: false,
      cellRenderer: ActionsCellRenderer,
      cellRendererParams: { onEdit: (row: PLAN_DECAISSEMENT_T) => setEditingItem(row), onDelete: (id: number) => deleteMutation(id) },
    },
  ], [deleteMutation])

  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || fetchedData.length === 0) return fetchedData
    const fuse = new Fuse(fetchedData, { keys: ['micro_projet_id', 'budget_id'], threshold: 0.3, ignoreLocation: true })
    return fuse.search(searchQuery).map((r) => r.item)
  }, [fetchedData, searchQuery])

  const modalNode = (
    <PlanDecaissementFormModal open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)} initialData={editingItem} />
  )

  return { columnDefs, data: filteredData, isLoading, modalNode }
}
