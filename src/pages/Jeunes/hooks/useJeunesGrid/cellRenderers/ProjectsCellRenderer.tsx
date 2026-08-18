import type { ICellRendererParams } from 'ag-grid-community'
import { Badge } from '@/components/ui/badge'
import type { JEUNE_T } from '@/types'

export const ProjectsCellRenderer = (params: ICellRendererParams<JEUNE_T>) => (
  <div className="flex items-center justify-center h-full">
    <Badge variant="secondary" className="font-mono">
      {params.value}
    </Badge>
  </div>
)
