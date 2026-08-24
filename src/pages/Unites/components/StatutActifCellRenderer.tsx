import type { ICellRendererParams } from 'ag-grid-community'
import { Badge } from '@/components/ui/badge'

export const StatutActifCellRenderer = (params: ICellRendererParams) => {
  const active = !!params.value
  return (
    <div className="flex items-center h-full">
      <Badge className={active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0' : 'bg-slate-100 text-slate-500 hover:bg-slate-100 border-0'}>
        {active ? 'Actif' : 'Inactif'}
      </Badge>
    </div>
  )
}
