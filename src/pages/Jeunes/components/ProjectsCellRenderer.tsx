import type { ICellRendererParams } from 'ag-grid-community'
import { Badge } from '@/components/ui/badge'
import type { PROMOTEUR_T } from '@/types/promoteurs.types'

export const ProjectsCellRenderer = (params: ICellRendererParams<PROMOTEUR_T>) => (
  <div className="flex items-center justify-center h-full">
    <Badge variant="secondary" className="font-mono">
      {params.value}
    </Badge>
  </div>
)
