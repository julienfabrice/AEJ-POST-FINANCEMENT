import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { localiteServices } from '@/services/localites.services'
import { PrimaryTextCellRenderer } from '@/pages/Referentiels/components/PrimaryTextCellRenderer'
import { BadgeCellRenderer } from '@/pages/Referentiels/components/BadgeCellRenderer'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'

export function useLieuxGrid(searchQuery: string) {
  const query = localiteServices.useLieuxHabitation()
  const villesQuery = localiteServices.useVilles()

  const data = query.data ?? []
  const villes = villesQuery.data ?? []

  const villeCodeOrId = useMemo(() => {
    const map = new Map(villes.map((v) => [v.id, v.id]))
    return (id: number | null) => (id !== null ? (map.get(id) ?? '—') : '—')
  }, [villes])

  const villeLabel = useMemo(() => {
    const map = new Map(villes.map((v) => [v.id, v.nom]))
    return (id: number | null) => (id !== null ? (map.get(id) ?? '') : '')
  }, [villes])

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'ville_id', headerName: 'ID Ville', width: 150, valueGetter: (p) => villeCodeOrId(p.data.ville_id), tooltipValueGetter: (p) => villeLabel(p.data.ville_id), cellRenderer: BadgeCellRenderer },
    { field: 'id', headerName: 'ID', width: 150, valueGetter: (p) => p.data.id, cellRenderer: BadgeCellRenderer },
    { field: 'nom', headerName: "Lieu d'habitation", flex: 1, minWidth: 260, cellRenderer: PrimaryTextCellRenderer },
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
  ], [villeCodeOrId, villeLabel])

  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || data.length === 0) return data
    const fuse = new Fuse(data, { keys: ['nom', 'id'], threshold: 0.3, ignoreLocation: true })
    return fuse.search(searchQuery).map((r) => r.item)
  }, [data, searchQuery])

  const isLoading = query.isLoading || villesQuery.isLoading

  return { columnDefs, data: filteredData, isLoading, isError: query.isError, error: query.error }
}
