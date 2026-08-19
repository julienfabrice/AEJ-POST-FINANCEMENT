import { useMemo } from 'react'
import type { ColDef, ICellRendererParams } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { Badge } from '@/components/ui/badge'
import { ActionsCellRenderer } from '../components/ActionsCellRenderer'
import { PrimaryTextCellRenderer } from '../components/PrimaryTextCellRenderer'
import { BadgeCellRenderer } from '../components/BadgeCellRenderer'
import { useGetIndicateurs } from '@/api/indicateurs/useGetIndicateurs'

export function useIndicateursGrid(searchQuery: string) {
  const { data: fetchedData = [], isLoading } = useGetIndicateurs()

  const columnDefs = useMemo<ColDef[]>(() => {
    return [
      { field: 'id', headerName: 'ID', width: 80, cellClass: 'font-mono text-slate-500' },
      { field: 'nom', headerName: 'Indicateur', flex: 1, cellRenderer: PrimaryTextCellRenderer },
      { field: 'unite', headerName: 'Unité', width: 150, cellRenderer: BadgeCellRenderer },
      { field: 'type_valeur', headerName: 'Type de valeur', width: 150 },
      {
        field: 'statut',
        headerName: 'Statut',
        width: 150,
        cellRenderer: (params: ICellRendererParams) => {
          const isActif = params.value === true
          return (
            <div className="flex items-center h-full">
              <Badge className={isActif ? 'bg-[#E3F6E7] text-[#178A2E] hover:bg-[#E3F6E7] border-0' : 'bg-slate-100 text-slate-700 hover:bg-slate-100 border-0'}>
                {isActif ? 'Actif' : 'Inactif'}
              </Badge>
            </div>
          )
        }
      },
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
    if (!searchQuery.trim() || fetchedData.length === 0) return fetchedData
    const fuse = new Fuse(fetchedData, {
      keys: ['nom', 'id', 'description', 'type_valeur', 'unite'],
      threshold: 0.3,
      ignoreLocation: true
    })
    return fuse.search(searchQuery).map(res => res.item)
  }, [fetchedData, searchQuery])

  return { columnDefs, data: filteredData, isLoading }
}
