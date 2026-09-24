import type { ICellRendererParams } from 'ag-grid-community'
import type { GUICHET_T } from '@/types'
import { money } from '@/helpers/money'
export const MontantRangeCellRenderer = (params: ICellRendererParams<GUICHET_T>) => {
  const row = params.data
  if (!row) return null
  return (
    <div className="flex items-center h-full font-mono text-xs text-slate-500">
      {money(row.montant_min)} → {money(row.montant_max)}
    </div>
  )
}
