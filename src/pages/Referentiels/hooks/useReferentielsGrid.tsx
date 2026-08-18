import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'

import { ActionsCellRenderer } from '../components/ActionsCellRenderer'
import { BadgeCellRenderer } from '../components/BadgeCellRenderer'
import { PrimaryTextCellRenderer } from '../components/PrimaryTextCellRenderer'

export type ReferentielTab = 'secteurs' | 'sous_secteurs' | 'type_entreprises' | 'pieces_identite' | 'situation_matrimoniale' | 'type_emplois' | 'indicateurs'

export function useReferentielsGrid(activeTab: ReferentielTab) {
  const columnDefs = useMemo<ColDef[]>(() => {
    const commonAction: ColDef = {
      headerName: 'Actions',
      width: 120,
      minWidth : 120,
      sortable: false,
      filter: false,
      cellRenderer: ActionsCellRenderer,
    }

    switch (activeTab) {
      case 'secteurs':
        return [
          { field: 'id', headerName: 'ID', width: 80, cellClass: 'font-mono text-slate-500' },
          { field: 'libelle', headerName: 'Secteur', flex: 1, cellRenderer: PrimaryTextCellRenderer },
          commonAction
        ]
      case 'sous_secteurs':
        return [
          { field: 'id', headerName: 'ID', width: 80, cellClass: 'font-mono text-slate-500' },
          { field: 'libelle', headerName: 'Sous-secteur', flex: 1, cellRenderer: PrimaryTextCellRenderer },
          { field: 'secteur', headerName: 'Secteur parent', flex: 1, cellRenderer: BadgeCellRenderer },
          commonAction
        ]
      case 'type_entreprises':
        return [
          { field: 'id', headerName: 'ID', width: 80, cellClass: 'font-mono text-slate-500' },
          { field: 'libelle', headerName: 'Type d\'entreprise', flex: 1, cellRenderer: PrimaryTextCellRenderer },
          commonAction
        ]
      case 'pieces_identite':
        return [
          { field: 'id', headerName: 'ID', width: 80, cellClass: 'font-mono text-slate-500' },
          { field: 'libelle', headerName: 'Pièce d\'identité', flex: 1, cellRenderer: PrimaryTextCellRenderer },
          commonAction
        ]
      case 'situation_matrimoniale':
        return [
          { field: 'id', headerName: 'ID', width: 80, cellClass: 'font-mono text-slate-500' },
          { field: 'libelle', headerName: 'Situation matrimoniale', flex: 1, cellRenderer: PrimaryTextCellRenderer },
          commonAction
        ]
      case 'type_emplois':
        return [
          { field: 'id', headerName: 'ID', width: 80, cellClass: 'font-mono text-slate-500' },
          { field: 'libelle', headerName: 'Type d\'emploi', flex: 1, cellRenderer: PrimaryTextCellRenderer },
          commonAction
        ]
      case 'indicateurs':
        return [
          { field: 'id', headerName: 'ID', width: 80, cellClass: 'font-mono text-slate-500' },
          { field: 'libelle', headerName: 'Indicateur', flex: 1, cellRenderer: PrimaryTextCellRenderer },
          { field: 'unite', headerName: 'Unité', width: 150, cellRenderer: BadgeCellRenderer },
          { field: 'type_valeur', headerName: 'Type de valeur', width: 150 },
          commonAction
        ]
      default:
        return []
    }
  }, [activeTab])

  return { columnDefs }
}
