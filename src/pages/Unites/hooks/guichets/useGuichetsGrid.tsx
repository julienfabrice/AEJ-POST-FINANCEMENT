import { guichetServices } from '@/services/guichets.services'
import { useMemo, useState } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'
import { PrimaryTextCellRenderer } from '@/pages/Referentiels/components/PrimaryTextCellRenderer'
import { BadgeCellRenderer } from '@/pages/Referentiels/components/BadgeCellRenderer'
import { MontantRangeCellRenderer } from '../../components/MontantRangeCellRenderer'
import { StatutActifCellRenderer } from '../../components/StatutActifCellRenderer'
import { GuichetFormModal } from '../../components/GuichetFormModal'
import type { GUICHET_T } from '@/types'

export function useGuichetsGrid(searchQuery: string) {
  const { data: fetchedData = [], isLoading } = guichetServices.useGetAll()
  const { mutate: deleteMutation } = guichetServices.useDelete()
  const [editingItem, setEditingItem] = useState<GUICHET_T | null>(null)

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'code', headerName: 'Code', width: 100, cellRenderer: BadgeCellRenderer },
    { field: 'libelle', headerName: 'Guichet', flex: 1, minWidth: 220, cellRenderer: PrimaryTextCellRenderer },
    { headerName: 'Fourchette', width: 240, sortable: false, filter: false, cellRenderer: MontantRangeCellRenderer },
    { field: 'is_active', headerName: 'Statut', width: 110, cellRenderer: StatutActifCellRenderer },
    {
      headerName: 'Actions', width: 120, minWidth: 120, sortable: false, filter: false,
      cellRenderer: ActionsCellRenderer,
      cellRendererParams: { onEdit: (row: GUICHET_T) => setEditingItem(row), onDelete: (id: number) => deleteMutation(id) },
    },
  ], [deleteMutation])

  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || fetchedData.length === 0) return fetchedData
    const fuse = new Fuse(fetchedData, { keys: ['libelle', 'code'], threshold: 0.3, ignoreLocation: true })
    return fuse.search(searchQuery).map((r) => r.item)
  }, [fetchedData, searchQuery])

  const modalNode = (
    <GuichetFormModal open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)} initialData={editingItem} />
  )

  return { columnDefs, data: filteredData, isLoading, modalNode }
}
