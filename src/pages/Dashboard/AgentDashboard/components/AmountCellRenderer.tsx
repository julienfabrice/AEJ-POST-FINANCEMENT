import type { ICellRendererParams } from 'ag-grid-community'

export const AmountCellRenderer = (params: ICellRendererParams) => (
  <div className="flex items-center justify-end h-full font-mono font-semibold">
    {params.value} <span className="text-slate-400 font-normal ml-1 text-[11px]">FCFA</span>
  </div>
)
