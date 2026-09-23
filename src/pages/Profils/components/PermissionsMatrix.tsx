import { useMemo } from 'react'
import { DataGrid } from '@/components/ui/DataGrid'
import { usePermissionsMatrix, type MatrixRow } from '../hooks/usePermissionsMatrix'
import type { ICellRendererParams, ColDef } from 'ag-grid-community'

export function PermissionsMatrix() {
  const { roles, rows, isLoading, isSaving, toggle } = usePermissionsMatrix()

  const columnDefs = useMemo<ColDef[]>(() => {
    const cols: ColDef[] = [
      {
        field: 'module',
        headerName: 'Module',
        flex: 1,
        minWidth: 200,
        pinned: 'left',
        cellClass: 'font-mono text-[12.5px] text-slate-700',
      }
    ]

    roles.forEach((r) => {
      cols.push({
        headerName: r.code || 'INCONNU',
        headerTooltip: r.libelle || r.code,
        headerClass: 'text-center border-l border-slate-200',
        cellClass: 'border-l border-slate-200',
        width: 110,
        sortable: false,
        suppressMovable: true,
        cellRenderer: (params: ICellRendererParams<MatrixRow>) => {
          if (!params.data) return null
          const row = params.data
          const cell = row.rolesData[r.id]
          if (!cell) return null

          const isReadOnly = r.code === 'ADMIN'
          const baseClass = "w-6 h-6 rounded flex items-center justify-center text-[11px] font-bold select-none transition-all"
          const cursorClass = isSaving || isReadOnly ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-sm"

          const getStyle = (isActive: boolean) =>
            isActive
              ? "bg-[#E7722B] text-white shadow-sm ring-1 ring-[#E7722B] ring-offset-1"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"

          return (
            <div className="flex items-center justify-center space-x-1.5 w-full h-full">
              <span
                title={isReadOnly ? "Non modifiable" : "Voir (accès)"}
                className={`${baseClass} ${getStyle(cell.acces)} ${cursorClass}`}
                onClick={() => {
                  if (isSaving || isReadOnly) return
                  toggle(r.id, row.module, 'acces', !cell.acces)
                }}
              >
                V
              </span>
              <span
                title={isReadOnly ? "Non modifiable" : "Tout (accès complet)"}
                className={`${baseClass} ${getStyle(cell.fullAccess)} ${cursorClass}`}
                onClick={() => {
                  if (isSaving || isReadOnly) return
                  toggle(r.id, row.module, 'fullAccess', !cell.fullAccess)
                }}
              >
                T
              </span>
            </div>
          )
        }
      })
    })

    return cols
  }, [roles, isSaving, toggle])

  return (
    <div className="w-full">
      <DataGrid
        columnDefs={columnDefs}
        rowData={rows}
        loading={isLoading}
        height="64vh"
        pagination={false}
        rowHeight={46}
        headerHeight={46}
      />
    </div>
  )
}
