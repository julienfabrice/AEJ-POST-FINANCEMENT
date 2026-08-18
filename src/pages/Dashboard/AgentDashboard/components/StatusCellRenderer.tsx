import type { ICellRendererParams } from 'ag-grid-community'
import { Badge } from '@/components/ui/badge'

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  SOUMISSION: { label: 'Soumission', variant: 'secondary' },
  ANALYSE: { label: 'Analyse', variant: 'outline' },
  CERTIFICATION: { label: 'Certification', variant: 'secondary' },
  FINANCEMENT: { label: 'Financement', variant: 'default' },
  DECAISSEMENT: { label: 'Décaissement', variant: 'default' },
  REMBOURSEMENT: { label: 'Remboursement', variant: 'outline' },
}

export const StatusCellRenderer = (params: ICellRendererParams) => {
  if (!params.value) return null
  const s = STATUS_MAP[params.value] || STATUS_MAP.SOUMISSION
  return (
    <div className="flex items-center h-full">
      <Badge variant={s.variant} className="text-xs">
        {s.label}
      </Badge>
    </div>
  )
}
