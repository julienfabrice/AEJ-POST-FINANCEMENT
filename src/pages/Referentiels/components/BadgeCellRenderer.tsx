import type { ICellRendererParams } from 'ag-grid-community'
import { Badge } from '@/components/ui/badge'

export const BadgeCellRenderer = (params: ICellRendererParams) => {
  if (!params.value) return null
  return (
    <div className="flex items-center h-full">
      <Badge variant="secondary" className="font-medium text-slate-600 bg-slate-100 border-0 hover:bg-slate-100">
        {params.value}
      </Badge>
    </div>
  )
}
