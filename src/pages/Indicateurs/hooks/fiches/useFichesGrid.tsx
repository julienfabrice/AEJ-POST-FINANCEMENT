import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { formulaires } from '@/mock'
import { Badge } from '@/components/ui/badge'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'

const actionsCol: ColDef = {
  headerName: 'Actions',
  width: 120,
  minWidth: 120,
  sortable: false,
  filter: false,
  cellRenderer: ActionsCellRenderer,
  cellRendererParams: {
    onEdit: () => console.log('Edit action clicked'),
    onDelete: () => console.log('Delete action clicked')
  },
}

export function useFichesGrid(searchQuery: string) {
  const columnDefs = useMemo<ColDef[]>(() => {
    return [
      { field: 'code', headerName: 'Code', flex: 1, cellRenderer: (params: any) => <Badge variant="outline" className="font-mono">{params.data.code}</Badge> },
      { field: 'libelle', headerName: 'Libellé', flex: 2, cellRenderer: (params: any) => <span className="font-semibold">{params.data.libelle}</span> },
      { field: 'public_cible', headerName: 'Public Cible', flex: 1 },
      { field: 'actif', headerName: 'Actif', flex: 1, cellRenderer: (params: any) => (
        <Badge variant={params.data.actif ? 'default' : 'secondary'} className={params.data.actif ? 'bg-green-500 hover:bg-green-600 text-white' : ''}>
          {params.data.actif ? 'Oui' : 'Non'}
        </Badge>
      ) },
      actionsCol
    ]
  }, [])

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return formulaires

    const fuse = new Fuse(formulaires, {
      keys: ['code', 'libelle', 'public_cible'],
      threshold: 0.3,
      ignoreLocation: true
    })
    return fuse.search(searchQuery).map(res => res.item)
  }, [searchQuery])

  return { columnDefs, data: filteredData, isLoading: false }
}
