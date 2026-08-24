import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { localiteServices } from '@/services/localites.services'
import { PrimaryTextCellRenderer } from '@/pages/Referentiels/components/PrimaryTextCellRenderer'
import { BadgeCellRenderer } from '@/pages/Referentiels/components/BadgeCellRenderer'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'

export function useVillesGrid(searchQuery: string) {
  const query = localiteServices.useVilles()
  const data = query.data ?? []

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'id', headerName: 'ID', width: 130, valueGetter: (p) => p.data.id, cellRenderer: BadgeCellRenderer },
    { field: 'nom', headerName: 'Ville', flex: 1, minWidth: 260, cellRenderer: PrimaryTextCellRenderer },
    {
      headerName: 'Actions',
      width: 120,
      minWidth: 120,
      sortable: false,
      filter: false,
      cellRenderer: ActionsCellRenderer,
      cellRendererParams: {
        readonly: true,
        readonlyMessage: "Les données de cette table proviennent directement du système de l'AEJ."
      },
    }
  ], [])

  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || data.length === 0) return data
    const fuse = new Fuse(data, { keys: ['nom', 'id'], threshold: 0.3, ignoreLocation: true })
    return fuse.search(searchQuery).map((r) => r.item)
  }, [data, searchQuery])

  return { columnDefs, data: filteredData, isLoading: query.isLoading, isError: query.isError, error: query.error }
}
