import { situationMatrimonialeServices } from '@/services/situationsMatrimoniales.services'
import { useMemo, useState } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { ActionsCellRenderer } from '../../components/ActionsCellRenderer'
import { PrimaryTextCellRenderer } from '../../components/PrimaryTextCellRenderer'
import { SituationMatrimonialeFormModal } from '../../components/SituationMatrimonialeFormModal'
import type { SITUATION_MATRIMONIALE_T } from '@/types'

export function useSituationsMatrimonialesGrid(searchQuery: string) {
  const { data: fetchedData = [], isLoading } = situationMatrimonialeServices.useGetAll()
  const { mutate: deleteMutation } = situationMatrimonialeServices.useDelete()
  const [editingItem, setEditingItem] = useState<SITUATION_MATRIMONIALE_T | null>(null)

  const columnDefs = useMemo<ColDef[]>(() => {
    return [
      { field: 'id', headerName: 'ID', width: 80, cellClass: 'font-mono text-slate-500' },
      { field: 'libelle', headerName: 'Situation matrimoniale', flex: 1, cellRenderer: PrimaryTextCellRenderer },
      {
        headerName: 'Actions',
        width: 120,
        minWidth: 120,
        sortable: false,
        filter: false,
        cellRenderer: ActionsCellRenderer,
        cellRendererParams: {
          onEdit: (row: SITUATION_MATRIMONIALE_T) => setEditingItem(row),
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
    <SituationMatrimonialeFormModal 
      open={!!editingItem} 
      onOpenChange={(open) => !open && setEditingItem(null)} 
      initialData={editingItem} 
    />
  )

  return { columnDefs, data: filteredData, isLoading, modalNode }
}
