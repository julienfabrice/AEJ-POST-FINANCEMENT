import type { ICellRendererParams } from 'ag-grid-community'
import type { PROMOTEUR_T } from '@/types/promoteurs.types'

export const ContactCellRenderer = (params: ICellRendererParams<PROMOTEUR_T>) => {
  if (!params.data) return null
  const { email, telephone } = params.data

  if (!email && !telephone) {
    return <span className="text-sm text-slate-400">—</span>
  }

  return (
    <div className="flex flex-col justify-center h-full py-1 min-w-0">
      <span className="text-sm text-slate-700 leading-tight truncate" title={email || undefined}>
        {email || '—'}
      </span>
      <span className="font-mono text-xs text-slate-500 leading-tight truncate" title={telephone || undefined}>
        {telephone || '—'}
      </span>
    </div>
  )
}
