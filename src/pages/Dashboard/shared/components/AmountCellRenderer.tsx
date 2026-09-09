import type { ICellRendererParams } from 'ag-grid-community'

export const AmountCellRenderer = (params: ICellRendererParams) => {
  const value = params.value ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Number(params.value)) : '-'
  return (
    <div className="flex items-center justify-end h-full font-mono font-semibold">
      {value} <span className="text-slate-400 font-normal ml-1 text-[11px]">FCFA</span>
    </div>
  )
}
