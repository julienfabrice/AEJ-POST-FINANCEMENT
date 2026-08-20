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

  const villeLabel = useMemo(() => {
    const map = new Map(villes.map((v) => [v.id, v.nom]))
    return (id: number | null) => (id !== null ? map.get(id) ?? '—' : '—')
  }, [villes])

  const divisionLabel = useMemo(() => {
    const map = new Map(divisions.map((d) => [d.id, d.nom]))
    return (id: number | null) => (id !== null ? map.get(id) ?? '—' : '—')
  }, [divisions])

  const divisionsColumnDefs = useMemo<ColDef[]>(() => [
    { field: 'code', headerName: 'Code', width: 130, cellRenderer: (p: any) => (p.value ? <BadgeCellRenderer {...p} /> : <span className="text-slate-400">—</span>) },
    { field: 'nom', headerName: 'Division régionale', flex: 1, minWidth: 260, cellRenderer: PrimaryTextCellRenderer },
  ], [])

  const villesColumnDefs = useMemo<ColDef[]>(() => [
    { field: 'nom', headerName: 'Ville', flex: 1, minWidth: 260, cellRenderer: PrimaryTextCellRenderer },
  ], [])

  const communesColumnDefs = useMemo<ColDef[]>(() => [
    { field: 'nom', headerName: 'Commune', flex: 1, minWidth: 220, cellRenderer: PrimaryTextCellRenderer },
    { field: 'ville_id', headerName: 'Ville', width: 200, cellRenderer: (p: any) => <BadgeCellRenderer {...p} value={villeLabel(p.value)} /> },
    { field: 'divisionregionaleaej_id', headerName: 'Division régionale', width: 220, cellRenderer: (p: any) => <BadgeCellRenderer {...p} value={divisionLabel(p.value)} /> },
  ], [villeLabel, divisionLabel])

  const lieuxColumnDefs = useMemo<ColDef[]>(() => [
    { field: 'nom', headerName: "Lieu d'habitation", flex: 1, minWidth: 260, cellRenderer: PrimaryTextCellRenderer },
    { field: 'ville_id', headerName: 'Ville', width: 220, cellRenderer: (p: any) => <BadgeCellRenderer {...p} value={villeLabel(p.value)} /> },
  ], [villeLabel])

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
