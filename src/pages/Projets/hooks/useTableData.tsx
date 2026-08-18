import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'
import type { PROJET_T } from '@/types'

import { ProjectTitleCellRenderer } from '../components/ProjectTitleCellRenderer'
import { AmountCellRenderer } from '../components/AmountCellRenderer'
import { StatusCellRenderer } from '../components/StatusCellRenderer'
import { ActionsCellRenderer } from '../components/ActionsCellRenderer'

export function useTableData() {
  const columnDefs = useMemo<ColDef<PROJET_T>[]>(() => [
    {
      field: 'ref',
      headerName: 'Référence',
      width: 130,
      cellRenderer: (p: any) => <span className="font-mono text-xs text-slate-500">{p.value}</span>
    },
    {
      field: 'titre',
      headerName: 'Titre du projet',
      flex: 1,
      minWidth: 200,
      cellRenderer: ProjectTitleCellRenderer
    },
    { field: 'promoteur', headerName: 'Promoteur', width: 180 },
    { field: 'agence', headerName: 'Agence', width: 130 },
    {
      field: 'montant',
      headerName: 'Montant',
      width: 140,
      cellRenderer: AmountCellRenderer,
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: 'statut',
      headerName: 'Statut',
      width: 140,
      cellRenderer: StatusCellRenderer
    },
    { field: 'date', headerName: 'Date', width: 110 },
    {
      headerName: 'Actions',
      width: 80,
      sortable: false,
      filter: false,
      cellRenderer: ActionsCellRenderer,
    }
  ], [])

  return { columnDefs }
}
