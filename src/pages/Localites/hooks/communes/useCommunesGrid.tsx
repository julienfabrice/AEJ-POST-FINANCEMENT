import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { localiteServices } from '@/services/localites.services'
import { PrimaryTextCellRenderer } from '@/pages/Referentiels/components/PrimaryTextCellRenderer'
import { BadgeCellRenderer } from '@/pages/Referentiels/components/BadgeCellRenderer'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'

export function useCommunesGrid(searchQuery: string) {
  const query = localiteServices.useCommunes()
  const divisionsQuery = localiteServices.useDivisionsRegionales()
  const villesQuery = localiteServices.useVilles()

  const data = query.data ?? []
  const villes = villesQuery.data ?? []
  const divisions = divisionsQuery.data ?? []

  const villeCodeOrId = useMemo(() => {
    const map = new Map(villes.map((v) => [v.id, v.id]))
    return (id: number | null) => (id !== null ? (map.get(id) ?? '—') : '—')
  }, [villes])

  const divisionCodeOrId = useMemo(() => {
    const map = new Map(divisions.map((d) => [d.id, d.code || d.id]))
    return (id: number | null) => (id !== null ? (map.get(id) ?? '—') : '—')
  }, [divisions])

  const villeLabel = useMemo(() => {
    const map = new Map(villes.map((v) => [v.id, v.nom]))
    return (id: number | null) => (id !== null ? (map.get(id) ?? '') : '')
  }, [villes])

  const divisionLabel = useMemo(() => {
    const map = new Map(divisions.map((d) => [d.id, d.nom]))
    return (id: number | null) => (id !== null ? (map.get(id) ?? '') : '')
  }, [divisions])

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'divisionregionaleaej_id', headerName: 'Code Région', width: 150, valueGetter: (p) => divisionCodeOrId(p.data.divisionregionaleaej_id), tooltipValueGetter: (p) => divisionLabel(p.data.divisionregionaleaej_id), cellRenderer: BadgeCellRenderer },
    { field: 'ville_id', headerName: 'ID Ville', width: 150, valueGetter: (p) => villeCodeOrId(p.data.ville_id), tooltipValueGetter: (p) => villeLabel(p.data.ville_id), cellRenderer: BadgeCellRenderer },
    { field: 'id', headerName: 'ID', width: 130, valueGetter: (p) => p.data.id, cellRenderer: BadgeCellRenderer },
    { field: 'nom', headerName: 'Commune', flex: 1, minWidth: 220, cellRenderer: PrimaryTextCellRenderer },
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
  ], [villeCodeOrId, divisionCodeOrId, villeLabel, divisionLabel])

  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || data.length === 0) return data
    const fuse = new Fuse(data, { keys: ['nom', 'id'], threshold: 0.3, ignoreLocation: true })
    return fuse.search(searchQuery).map((r) => r.item)
  }, [data, searchQuery])

  const isLoading = query.isLoading || divisionsQuery.isLoading || villesQuery.isLoading

  return { columnDefs, data: filteredData, isLoading, isError: query.isError, error: query.error }
}
