import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'

import { AmountCellRenderer } from '../components/AmountCellRenderer'
import { StatusCellRenderer } from '../components/StatusCellRenderer'

export function useTableData() {
  const columnDefs = useMemo<ColDef[]>(() => [
    { 
      field: 'ref', 
      headerName: 'Référence', 
      width: 140,
      cellRenderer: (p: any) => <span className="font-mono text-xs font-semibold text-[#5A6B80]">{p.value}</span>
    },
    { field: 'promoteur', headerName: 'Promoteur', flex: 1, minWidth: 180, cellClass: 'font-medium' },
    { field: 'dispositif', headerName: 'Dispositif', width: 150, cellClass: 'text-sm text-[#5A6B80]' },
    { 
      field: 'montant', 
      headerName: 'Montant (FCFA)', 
      width: 160,
      cellRenderer: AmountCellRenderer,
      headerClass: 'ag-right-aligned-header',
    },
    { 
      field: 'statut', 
      headerName: 'Statut', 
      width: 150,
      cellRenderer: StatusCellRenderer 
    },
    { field: 'date', headerName: 'Date', width: 120, cellClass: 'text-sm text-[#5A6B80]' },
  ], [])

  return { columnDefs }
}
