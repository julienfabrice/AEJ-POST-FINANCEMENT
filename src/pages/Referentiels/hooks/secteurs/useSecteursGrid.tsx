import { secteurServices } from '@/services/secteurs.services'
import { useMemo, useState } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { ActionsCellRenderer } from '../../components/ActionsCellRenderer'
import { PrimaryTextCellRenderer } from '../../components/PrimaryTextCellRenderer'
import { SecteurFormModal } from '../../components/SecteurFormModal'
import type { SECTEUR_T } from '@/types'

export function useSecteursGrid(searchQuery: string) {
  const { data: fetchedData = [], isLoading } = secteurServices.useGetAll()
  const { mutate: deleteMutation } = secteurServices.useDelete()
  const [editingItem, setEditingItem] = useState<SECTEUR_T | null>(null)

  const columnDefs = useMemo<ColDef[]>(() => {
    return [
      { field: 'id', headerName: 'ID', width: 80, cellClass: 'font-mono text-slate-500' },
      { field: 'libelle', headerName: 'Secteur d\'activité', flex: 1, cellRenderer: PrimaryTextCellRenderer },
      {
        headerName: 'Actions',
        width: 120,
        minWidth: 120,
        sortable: false,
        filter: false,
        cellRenderer: ActionsCellRenderer,
        cellRendererParams: {
          onEdit: (row: SECTEUR_T) => setEditingItem(row),
          onDelete: (id: number) => deleteMutation(id),
          readonly: true,
          readonlyMessage: "Les données de cette table proviennent directement du système de l'AEJ."
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
    <SecteurFormModal 
      open={!!editingItem} 
      onOpenChange={(open) => !open && setEditingItem(null)} 
      initialData={editingItem} 
    />
  )

  return { columnDefs, data: filteredData, isLoading, modalNode }
}
