import { useMemo, useState } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { ActionsCellRenderer } from '../../components/ActionsCellRenderer'
import { PrimaryTextCellRenderer } from '../../components/PrimaryTextCellRenderer'
import { useGetSecteurs } from '@/api/secteurs/useGetSecteurs'
import { useDeleteSecteur } from '@/api/secteurs/useDeleteSecteur'
import { SecteurFormModal } from '../../components/SecteurFormModal'
import type { SECTEUR_T } from '@/types'

export function useSecteursGrid(searchQuery: string) {
  const { data: fetchedData = [], isLoading } = useGetSecteurs()
  const { mutate: deleteMutation } = useDeleteSecteur()
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
    <SecteurFormModal 
      open={!!editingItem} 
      onOpenChange={(open) => !open && setEditingItem(null)} 
      initialData={editingItem} 
    />
  )

  return { columnDefs, data: filteredData, isLoading, modalNode }
}
