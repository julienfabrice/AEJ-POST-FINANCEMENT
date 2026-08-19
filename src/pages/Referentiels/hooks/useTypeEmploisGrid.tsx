import { useMemo, useState } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { ActionsCellRenderer } from '../components/ActionsCellRenderer'
import { PrimaryTextCellRenderer } from '../components/PrimaryTextCellRenderer'
import { BadgeCellRenderer } from '../components/BadgeCellRenderer'
import { useGetTypeEmplois } from '@/api/type-emplois/useGetTypeEmplois'
import { useDeleteTypeEmploi } from '@/api/type-emplois/useDeleteTypeEmploi'
import { TypeEmploiFormModal } from '../components/TypeEmploiFormModal'
import type { TYPE_EMPLOI_T } from '@/types'

export function useTypeEmploisGrid(searchQuery: string) {
  const { data: fetchedData = [], isLoading } = useGetTypeEmplois()
  const { mutate: deleteMutation } = useDeleteTypeEmploi()
  const [editingItem, setEditingItem] = useState<TYPE_EMPLOI_T | null>(null)

  const columnDefs = useMemo<ColDef[]>(() => {
    return [
      { field: 'id', headerName: 'ID', width: 80, cellClass: 'font-mono text-slate-500' },
      { field: 'code', headerName: 'Code', width: 120, cellRenderer: BadgeCellRenderer },
      { field: 'libelle', headerName: 'Type d\'emploi', flex: 1, cellRenderer: PrimaryTextCellRenderer },
      {
        headerName: 'Actions',
        width: 120,
        minWidth: 120,
        sortable: false,
        filter: false,
        cellRenderer: ActionsCellRenderer,
        cellRendererParams: {
          onEdit: (row: TYPE_EMPLOI_T) => setEditingItem(row),
          onDelete: (id: number) => deleteMutation(id)
        },
      }
    ]
  }, [deleteMutation])

  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || fetchedData.length === 0) return fetchedData
    const fuse = new Fuse(fetchedData, {
      keys: ['libelle', 'id', 'code'],
      threshold: 0.3,
      ignoreLocation: true
    })
    return fuse.search(searchQuery).map(res => res.item)
  }, [fetchedData, searchQuery])

  const modalNode = (
    <TypeEmploiFormModal 
      open={!!editingItem} 
      onOpenChange={(open) => !open && setEditingItem(null)} 
      initialData={editingItem} 
    />
  )

  return { columnDefs, data: filteredData, isLoading, modalNode }
}
