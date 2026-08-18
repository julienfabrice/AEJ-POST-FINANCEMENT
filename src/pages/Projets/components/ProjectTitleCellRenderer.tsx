import type { ICellRendererParams } from 'ag-grid-community'
import type { PROJET_T } from '@/types'

export const ProjectTitleCellRenderer = (params: ICellRendererParams<PROJET_T>) => {
  if (!params.data) return null
  return (
    <div className="flex flex-col justify-center h-full">
      <span className="font-semibold text-[#131C29] truncate">{params.data.titre}</span>
      <span className="text-[11px] text-slate-500 font-medium leading-none">{params.data.dispositif}</span>
    </div>
  )
}
