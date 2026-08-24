import { directionServices } from '@/services/directions.services'
import { useMemo, useState } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'
import { PrimaryTextCellRenderer } from '@/pages/Referentiels/components/PrimaryTextCellRenderer'
import { BadgeCellRenderer } from '@/pages/Referentiels/components/BadgeCellRenderer'
import { DirectionFormModal } from '../../components/DirectionFormModal'
import type { DIRECTION_T } from '@/types'

export function useDirectionsGrid(searchQuery: string) {
  const { data: fetchedData = [], isLoading } = directionServices.useGetAll()
  const { mutate: deleteMutation } = directionServices.useDelete()
  const [editingItem, setEditingItem] = useState<DIRECTION_T | null>(null)

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'code', headerName: 'Code', width: 120, cellRenderer: BadgeCellRenderer },
    { field: 'nom', headerName: 'Direction', flex: 1, cellRenderer: PrimaryTextCellRenderer },
    { field: 'description', headerName: 'Description', flex: 1 },
    {
      headerName: 'Actions', width: 120, minWidth: 120, sortable: false, filter: false,
      cellRenderer: ActionsCellRenderer,
      cellRendererParams: { onEdit: (row: DIRECTION_T) => setEditingItem(row), onDelete: (id: number) => deleteMutation(id) },
    },
  ], [deleteMutation])

  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || fetchedData.length === 0) return fetchedData
    const fuse = new Fuse(fetchedData, { keys: ['nom', 'code'], threshold: 0.3, ignoreLocation: true })
    return fuse.search(searchQuery).map((r) => r.item)
  }, [fetchedData, searchQuery])

  const modalNode = (
    <DirectionFormModal open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)} initialData={editingItem} />
  )

  return { columnDefs, data: filteredData, isLoading, modalNode }
}
