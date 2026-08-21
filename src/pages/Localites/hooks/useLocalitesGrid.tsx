import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { localiteServices } from '@/services/localites.services'
import { PrimaryTextCellRenderer } from '@/pages/Referentiels/components/PrimaryTextCellRenderer'
import { BadgeCellRenderer } from '@/pages/Referentiels/components/BadgeCellRenderer'

export type LocaliteTab = 'divisions' | 'villes' | 'communes' | 'lieux'

// Référentiel en LECTURE SEULE (synchronisé depuis le portail national) :
// pas d'ActionsCellRenderer, pas de modalNode, sur les 4 onglets.
export function useLocalitesGrid(activeTab: LocaliteTab, searchQuery: string) {
  const divisionsQuery = localiteServices.useDivisionsRegionales()
  const villesQuery = localiteServices.useVilles()
  const communesQuery = localiteServices.useCommunes()
  const lieuxQuery = localiteServices.useLieuxHabitation()

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

  const divisionsColumnDefs = useMemo<ColDef[]>(() => [
    { field: 'code', headerName: 'Code', width: 130, valueGetter: (p) => p.data.code, cellRenderer: BadgeCellRenderer },
    { field: 'nom', headerName: 'Division régionale', flex: 1, minWidth: 260, cellRenderer: PrimaryTextCellRenderer },
  ], [])

  const villesColumnDefs = useMemo<ColDef[]>(() => [
    { field: 'id', headerName: 'ID', width: 130, valueGetter: (p) => p.data.id, cellRenderer: BadgeCellRenderer },
    { field: 'nom', headerName: 'Ville', flex: 1, minWidth: 260, cellRenderer: PrimaryTextCellRenderer },
  ], [])

  const communesColumnDefs = useMemo<ColDef[]>(() => [
    { field: 'divisionregionaleaej_id', headerName: 'Code Région', width: 150, valueGetter: (p) => divisionCodeOrId(p.data.divisionregionaleaej_id), tooltipValueGetter: (p) => divisionLabel(p.data.divisionregionaleaej_id), cellRenderer: BadgeCellRenderer },
    { field: 'ville_id', headerName: 'ID Ville', width: 150, valueGetter: (p) => villeCodeOrId(p.data.ville_id), tooltipValueGetter: (p) => villeLabel(p.data.ville_id), cellRenderer: BadgeCellRenderer },
    { field: 'id', headerName: 'ID', width: 130, valueGetter: (p) => p.data.id, cellRenderer: BadgeCellRenderer },
    { field: 'nom', headerName: 'Commune', flex: 1, minWidth: 220, cellRenderer: PrimaryTextCellRenderer },
  ], [villeCodeOrId, divisionCodeOrId, villeLabel, divisionLabel])

  const lieuxColumnDefs = useMemo<ColDef[]>(() => [
    { field: 'ville_id', headerName: 'ID Ville', width: 150, valueGetter: (p) => villeCodeOrId(p.data.ville_id), tooltipValueGetter: (p) => villeLabel(p.data.ville_id), cellRenderer: BadgeCellRenderer },
    { field: 'id', headerName: 'ID', width: 150, valueGetter: (p) => p.data.id, cellRenderer: BadgeCellRenderer },
    { field: 'nom', headerName: "Lieu d'habitation", flex: 1, minWidth: 260, cellRenderer: PrimaryTextCellRenderer },
  ], [villeCodeOrId, villeLabel])

  const byTab = {
    divisions: { columnDefs: divisionsColumnDefs, data: divisions, isLoading: divisionsQuery.isLoading, isError: divisionsQuery.isError, error: divisionsQuery.error },
    villes: { columnDefs: villesColumnDefs, data: villes, isLoading: villesQuery.isLoading, isError: villesQuery.isError, error: villesQuery.error },
    communes: { columnDefs: communesColumnDefs, data: communesQuery.data ?? [], isLoading: communesQuery.isLoading || villesQuery.isLoading || divisionsQuery.isLoading, isError: communesQuery.isError, error: communesQuery.error },
    lieux: { columnDefs: lieuxColumnDefs, data: lieuxQuery.data ?? [], isLoading: lieuxQuery.isLoading || villesQuery.isLoading, isError: lieuxQuery.isError, error: lieuxQuery.error },
  }

  const current = byTab[activeTab]

  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || current.data.length === 0) return current.data
    const fuse = new Fuse(current.data as any[], { keys: ['nom', 'code'], threshold: 0.3, ignoreLocation: true })
    return fuse.search(searchQuery).map((r) => r.item)
  }, [current.data, searchQuery])

  return { columnDefs: current.columnDefs, data: filteredData, isLoading: current.isLoading, isError: current.isError, error: current.error }
}
