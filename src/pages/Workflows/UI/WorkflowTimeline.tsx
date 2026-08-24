import { WorkflowCycle } from '../components/WorkflowCycle'
import type { WORKFLOW_ETAPE_T } from '@/types'

interface WorkflowTimelineProps {
  etapes: WORKFLOW_ETAPE_T[]
}

export function WorkflowTimeline({ etapes }: WorkflowTimelineProps) {
  return (
    <div className="relative pl-2 max-w-[820px]">
      {(!etapes || etapes.length === 0) ? (
        <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
          Aucune étape configurée pour ce guichet.
        </div>
      ) : (
        etapes.map((etape, index: number) => (
          <WorkflowCycle 
            key={etape.id || index}
            etape={etape}
            numero={etape.order || index + 1}
            code={etape.code}
            titre={etape.name}
            isLast={index === etapes.length - 1}
          />
        ))
      )}
    </div>
  )
}
