import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { ActionsCellRenderer } from '../../components/ActionsCellRenderer'
import { PrimaryTextCellRenderer } from '../../components/PrimaryTextCellRenderer'
import { BadgeCellRenderer } from '../../components/BadgeCellRenderer'
import { useState } from 'react'
import { useGetTypeEntreprises } from '@/api/type-entreprises/useGetTypeEntreprises'
import { TypeEntrepriseFormModal } from '../../components/TypeEntrepriseFormModal'
import type { TYPE_ENTREPRISE_T } from '@/types'
import { useDeleteTypeEntreprise } from '@/api/type-entreprises/useDeleteTypeEntreprise'

export function useTypeEntreprisesGrid(searchQuery: string) {
  const { data: fetchedData = [], isLoading } = useGetTypeEntreprises()
  const { mutate: deleteTypeEntreprise } = useDeleteTypeEntreprise()
  const [editingItem, setEditingItem] = useState<TYPE_ENTREPRISE_T | null>(null)

  const columnDefs = useMemo<ColDef[]>(() => {
    return [
      { field: 'id', headerName: 'ID', width: 80, cellClass: 'font-mono text-slate-500' },
      { field: 'code', headerName: 'Code', width: 120, cellRenderer: BadgeCellRenderer },
      { field: 'libelle', headerName: 'Type d\'entreprise', flex: 1, cellRenderer: PrimaryTextCellRenderer },
      {
        headerName: 'Actions',
        width: 120,
        minWidth: 120,
        sortable: false,
        filter: false,
        cellRenderer: ActionsCellRenderer,
        cellRendererParams: {
          onEdit: (row: TYPE_ENTREPRISE_T) => setEditingItem(row),
          onDelete: (id: number) => {
            deleteTypeEntreprise(id)
          }
        },
      }
    ]
  }, [deleteTypeEntreprise])

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
    <TypeEntrepriseFormModal 
      open={!!editingItem} 
      onOpenChange={(open) => !open && setEditingItem(null)} 
      initialData={editingItem} 
    />
  )

  return { columnDefs, data: filteredData, isLoading, modalNode }
}
