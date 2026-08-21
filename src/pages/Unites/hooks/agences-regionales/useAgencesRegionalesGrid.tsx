import { agenceRegionaleServices } from '@/services/agences-regionales.services'
import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { PrimaryTextCellRenderer } from '@/pages/Referentiels/components/PrimaryTextCellRenderer'
import { BadgeCellRenderer } from '@/pages/Referentiels/components/BadgeCellRenderer'
import type { AGENCE_REGIONALE_T } from '@/types'

// Référentiel en lecture seule (synchronisé depuis le portail national) :
// pas d'ActionsCellRenderer ni de modalNode ici, volontairement.
export function useAgencesRegionalesGrid(searchQuery: string) {
  const { data: fetchedData = [], isLoading } = agenceRegionaleServices.useGetAll()

  const columnDefs = useMemo<ColDef<AGENCE_REGIONALE_T>[]>(() => [
    { field: 'code', headerName: 'Code', width: 110, cellRenderer: BadgeCellRenderer },
    { field: 'nom', headerName: 'Agence', flex: 1, minWidth: 220, cellRenderer: PrimaryTextCellRenderer },
    { field: 'localisation', headerName: 'Localisation', width: 160 },
    { field: 'telephone', headerName: 'Téléphone', width: 160, cellRenderer: (p: any) => <span className="font-mono text-xs text-slate-500">{p.value ?? '—'}</span> },
    { field: 'email', headerName: 'Email', width: 200 },
  ], [])

  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || fetchedData.length === 0) return fetchedData
    const fuse = new Fuse(fetchedData, { keys: ['nom', 'code', 'localisation'], threshold: 0.3, ignoreLocation: true })
    return fuse.search(searchQuery).map((r) => r.item)
  }, [fetchedData, searchQuery])

  return { columnDefs, data: filteredData, isLoading, modalNode: null }
}
