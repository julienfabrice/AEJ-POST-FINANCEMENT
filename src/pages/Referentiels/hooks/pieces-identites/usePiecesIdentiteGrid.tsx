import { pieceIdentiteServices } from '@/services/piecesIdentites.services'
import { useMemo } from 'react'
import type { ColDef, ICellRendererParams } from 'ag-grid-community'
import { Badge } from '@/components/ui/badge'
import Fuse from 'fuse.js'
import { ActionsCellRenderer } from '../../components/ActionsCellRenderer'
import { PrimaryTextCellRenderer } from '../../components/PrimaryTextCellRenderer'

export function usePiecesIdentiteGrid(searchQuery: string) {
  const { data: fetchedPieces = [], isLoading } = pieceIdentiteServices.useGetAll()

  const columnDefs = useMemo<ColDef[]>(() => {
    return [
      { field: 'id', headerName: 'ID', width: 80, cellClass: 'font-mono text-slate-500' },
      { field: 'libelle', headerName: 'Pièce d\'identité', flex: 1, cellRenderer: PrimaryTextCellRenderer },
      {
        field: 'actif',
        headerName: 'Statut d\'activité',
        width: 180,
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
    if (!searchQuery.trim() || fetchedPieces.length === 0) return fetchedPieces
    const fuse = new Fuse(fetchedPieces, {
      keys: ['libelle', 'id', 'description'],
      threshold: 0.3,
      ignoreLocation: true
    })
    return fuse.search(searchQuery).map(res => res.item)
  }, [fetchedPieces, searchQuery])

  return { columnDefs, data: filteredData, isLoading }
}
