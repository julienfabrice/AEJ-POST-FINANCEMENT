import type { ICellRendererParams } from 'ag-grid-community'
import type { PROJET_T } from '@/types'

export const AmountCellRenderer = (params: ICellRendererParams<PROJET_T>) => (
  <div className="flex items-center justify-end h-full font-mono font-semibold">
    {params.value} <span className="text-slate-400 font-normal ml-1 text-[11px]">FCFA</span>
  </div>
)
