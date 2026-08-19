import type { ICellRendererParams } from 'ag-grid-community'

export const PrimaryTextCellRenderer = (params: ICellRendererParams) => {
  if (!params.value) return null
  return (
    <div className="flex items-center h-full font-semibold text-[#131C29]">
      {params.value}
    </div>
  )
}
