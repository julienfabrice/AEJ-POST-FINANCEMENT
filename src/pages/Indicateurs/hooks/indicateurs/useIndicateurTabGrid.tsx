import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { indicateurs } from '@/mock'
import { Badge } from '@/components/ui/badge'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'

const fmt = (num: number) => new Intl.NumberFormat('fr-FR').format(num)

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

export function useIndicateurTabGrid(searchQuery: string) {
  const columnDefs = useMemo<ColDef[]>(() => {
    return [
      { field: 'code', headerName: 'Code', flex: 1, cellRenderer: (params: any) => <Badge variant="outline" className="font-mono">{params.data.code}</Badge> },
      { field: 'nom', headerName: 'Nom', flex: 2, cellRenderer: (params: any) => <span className="font-semibold">{params.data.nom}</span> },
      { field: 'unite', headerName: 'Unité', flex: 1 },
      { field: 'type_valeur', headerName: 'Type de valeur', flex: 1 },
      { field: 'valeur_cible', headerName: 'Cible', flex: 1, cellRenderer: (params: any) => fmt(params.data.valeur_cible) },
      actionsCol
    ]
  }, [])

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return indicateurs

    const fuse = new Fuse(indicateurs, {
      keys: ['code', 'nom'],
      threshold: 0.3,
      ignoreLocation: true
    })
    return fuse.search(searchQuery).map(res => res.item)
  }, [searchQuery])

  return { columnDefs, data: filteredData, isLoading: false }
}
