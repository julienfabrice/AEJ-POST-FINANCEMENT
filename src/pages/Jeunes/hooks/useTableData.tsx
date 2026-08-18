import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'
import type { JEUNE_T } from '@/types'

import { ProfileCellRenderer } from '../components/ProfileCellRenderer'
import { ProjectsCellRenderer } from '../components/ProjectsCellRenderer'
import { StatusCellRenderer } from '../components/StatusCellRenderer'
import { ActionsCellRenderer } from '../components/ActionsCellRenderer'

export function useTableData() {
  const columnDefs = useMemo<ColDef<JEUNE_T>[]>(() => [
    {
      field: 'matricule',
      headerName: 'Matricule',
      width: 130,
      cellRenderer: (p: any) => <span className="font-mono text-xs text-slate-500 font-medium">{p.value}</span>
    },
    {
      headerName: 'Nom complet',
      flex: 1,
      minWidth: 200,
      valueGetter: p => `${p.data?.prenoms} ${p.data?.nom}`,
      cellRenderer: ProfileCellRenderer
    },
    {
      field: 'telephone',
      headerName: 'Téléphone',
      width: 150,
      cellRenderer: (p: any) => <span className="font-mono text-sm text-slate-600">{p.value}</span>
    },
    { field: 'ville', headerName: 'Localité', width: 130 },
    { field: 'secteur', headerName: "Secteur d'activité", width: 150 },
    {
      field: 'nb_projets',
      headerName: 'Projets',
      width: 100,
      cellRenderer: ProjectsCellRenderer,
      headerClass: 'ag-right-aligned-header',
      cellClass: 'text-center'
    },
    {
      field: 'actif',
      headerName: 'Statut',
      width: 120,
      cellRenderer: StatusCellRenderer
    },
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
