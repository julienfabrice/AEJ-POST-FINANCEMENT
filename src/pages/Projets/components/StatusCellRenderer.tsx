import type { ICellRendererParams } from 'ag-grid-community'
import { Badge } from '@/components/ui/badge'
import type { PROJET_T } from '@/types'

const STATUS_STYLES: Record<string, string> = {
  SOUMISSION: 'bg-slate-100 text-slate-700 hover:bg-slate-100 border-0',
  ANALYSE: 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-0',
  CERTIFICATION: 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-0',
  FINANCEMENT: 'bg-[#FBEADE] text-[#C85E18] hover:bg-[#FBEADE] border-0',
  DECAISSEMENT: 'bg-[#E3F6E7] text-[#178A2E] hover:bg-[#E3F6E7] border-0',
  SUIVI: 'bg-blue-50 text-blue-600 hover:bg-blue-50 border-0',
  REMBOURSEMENT: 'bg-green-50 text-green-700 hover:bg-green-50 border-0',
}

export const StatusCellRenderer = (params: ICellRendererParams<PROJET_T>) => {
  if (!params.value) return null
  const badgeClass = STATUS_STYLES[params.value] || STATUS_STYLES.SOUMISSION
  return (
    <div className="flex items-center h-full">
      <Badge className={badgeClass}>{params.value}</Badge>
    </div>
  )
}
