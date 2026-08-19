import { useMemo, useState } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { ActionsCellRenderer } from '../components/ActionsCellRenderer'
import { PrimaryTextCellRenderer } from '../components/PrimaryTextCellRenderer'
import { useGetSousSecteurs } from '@/api/sous-secteurs/useGetSousSecteurs'
import { useDeleteSousSecteur } from '@/api/sous-secteurs/useDeleteSousSecteur'
import { SousSecteurFormModal } from '../components/SousSecteurFormModal'
import type { SOUS_SECTEUR_T } from '@/types'

export function useSousSecteursGrid(searchQuery: string) {
  const { data: fetchedData = [], isLoading } = useGetSousSecteurs()
  const { mutate: deleteMutation } = useDeleteSousSecteur()
  const [editingItem, setEditingItem] = useState<SOUS_SECTEUR_T | null>(null)

  const columnDefs = useMemo<ColDef[]>(() => {
    return [
      { field: 'id', headerName: 'ID', width: 80, cellClass: 'font-mono text-slate-500' },
      { field: 'libelle', headerName: 'Sous-secteur', flex: 1, cellRenderer: PrimaryTextCellRenderer },
      {
        headerName: 'Actions',
        width: 120,
        minWidth: 120,
        sortable: false,
        filter: false,
        cellRenderer: ActionsCellRenderer,
        cellRendererParams: {
          onEdit: (row: SOUS_SECTEUR_T) => setEditingItem(row),
          onDelete: (id: number) => deleteMutation(id)
        },
      }
    ]
  }, [deleteMutation])

  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || fetchedData.length === 0) return fetchedData
    const fuse = new Fuse(fetchedData, {
      keys: ['libelle', 'id'],
      threshold: 0.3,
      ignoreLocation: true
    })
    return fuse.search(searchQuery).map(res => res.item)
  }, [fetchedData, searchQuery])

  const modalNode = (
    <SousSecteurFormModal 
      open={!!editingItem} 
      onOpenChange={(open) => !open && setEditingItem(null)} 
      initialData={editingItem} 
    />
  )

  return { columnDefs, data: filteredData, isLoading, modalNode }
}
