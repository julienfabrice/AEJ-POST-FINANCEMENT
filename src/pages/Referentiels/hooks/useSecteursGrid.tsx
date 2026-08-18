import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { ActionsCellRenderer } from '../components/ActionsCellRenderer'
import { PrimaryTextCellRenderer } from '../components/PrimaryTextCellRenderer'
import { useGetSecteurs } from '@/api/secteurs/useGetSecteurs'

export function useSecteursGrid(searchQuery: string) {
  const { data: fetchedSecteurs = [], isLoading } = useGetSecteurs()

  const columnDefs = useMemo<ColDef[]>(() => {
    return [
      { field: 'id', headerName: 'ID', width: 80, cellClass: 'font-mono text-slate-500' },
      { field: 'libelle', headerName: 'Secteur', flex: 1, cellRenderer: PrimaryTextCellRenderer },
      {
        headerName: 'Actions',
        width: 120,
        minWidth: 120,
        sortable: false,
        filter: false,
        cellRenderer: ActionsCellRenderer,
      }
    ]
  }, [])

  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || fetchedSecteurs.length === 0) return fetchedSecteurs
    const fuse = new Fuse(fetchedSecteurs, {
      keys: ['libelle', 'nom', 'id'],
      threshold: 0.3,
      ignoreLocation: true
    })
    return fuse.search(searchQuery).map(res => res.item)
  }, [fetchedSecteurs, searchQuery])

  return { columnDefs, data: filteredData, isLoading }
}
