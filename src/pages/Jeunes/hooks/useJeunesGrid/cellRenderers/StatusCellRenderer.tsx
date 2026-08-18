import type { ICellRendererParams } from 'ag-grid-community'
import { Badge } from '@/components/ui/badge'
import type { JEUNE_T } from '@/types'

export const StatusCellRenderer = (params: ICellRendererParams<JEUNE_T>) => {
  const actif = params.value
  return (
    <div className="flex items-center h-full">
      {actif ? (
        <Badge className="bg-[#E3F6E7] text-[#178A2E] hover:bg-[#E3F6E7] border-0">Actif</Badge>
      ) : (
        <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-0">Inactif</Badge>
      )}
    </div>
  )
}
