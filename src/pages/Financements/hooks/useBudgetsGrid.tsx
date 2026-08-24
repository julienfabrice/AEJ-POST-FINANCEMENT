import { budgetServices } from '@/services/budgets.services'
import { useMemo, useState } from 'react'
import type { ColDef, ValueFormatterParams } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'
import { PrimaryTextCellRenderer } from '@/pages/Referentiels/components/PrimaryTextCellRenderer'
import { BudgetStatutCellRenderer } from '../components/BudgetStatutCellRenderer'
import { BudgetFormModal } from '../components/BudgetFormModal'
import type { BUDGET_T } from '@/types'

const formatMontant = (params: ValueFormatterParams) =>
  typeof params.value === 'number' ? params.value.toLocaleString('fr-FR') : params.value

export function useBudgetsGrid(searchQuery: string) {
  const { data: fetchedData = [], isLoading } = budgetServices.useGetAll()
  const { mutate: deleteMutation } = budgetServices.useDelete()
  const [editingItem, setEditingItem] = useState<BUDGET_T | null>(null)

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'intitule', headerName: 'Intitulé', flex: 1, minWidth: 160, cellRenderer: PrimaryTextCellRenderer },
    { field: 'micro_projet_id', headerName: 'Micro-projet', width: 130 },
    { field: 'montant_accorde', headerName: 'Montant accordé', width: 160, valueFormatter: formatMontant },
    { field: 'devise', headerName: 'Devise', width: 100 },
    { field: 'source', headerName: 'Source', width: 130 },
    { field: 'date_accord', headerName: "Date d'accord", width: 130 },
    { field: 'signature_convention', headerName: 'Convention', width: 130 },
    { field: 'deblocage', headerName: 'Déblocage', width: 110 },
    { field: 'statut', headerName: 'Statut', width: 200, cellRenderer: BudgetStatutCellRenderer },
    {
      headerName: 'Actions', width: 100, minWidth: 100, sortable: false, filter: false,
      cellRenderer: ActionsCellRenderer,
      cellRendererParams: { onEdit: (row: BUDGET_T) => setEditingItem(row), onDelete: (id: number) => deleteMutation(id) },
    },
  ], [deleteMutation])

  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || fetchedData.length === 0) return fetchedData
    const fuse = new Fuse(fetchedData, { keys: ['intitule', 'source'], threshold: 0.3, ignoreLocation: true })
    return fuse.search(searchQuery).map((r) => r.item)
  }, [fetchedData, searchQuery])

  const modalNode = (
    <BudgetFormModal open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)} initialData={editingItem} />
  )

  return { columnDefs, data: filteredData, isLoading, modalNode }
}
