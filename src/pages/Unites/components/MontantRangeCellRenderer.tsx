import type { ICellRendererParams } from 'ag-grid-community'
import type { GUICHET_T } from '@/types'

const formatMontant = (n: number) => new Intl.NumberFormat('fr-FR').format(n)

export const MontantRangeCellRenderer = (params: ICellRendererParams<GUICHET_T>) => {
  const row = params.data
  if (!row) return null
  return (
    <div className="flex items-center h-full font-mono text-xs text-slate-500">
      {formatMontant(row.montant_min)} → {formatMontant(row.montant_max)}
      <span className="text-slate-400 ml-1">FCFA</span>
    </div>
  )
}
