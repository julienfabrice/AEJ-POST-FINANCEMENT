import { WorkflowCycle } from '../components/WorkflowCycle'
import type { WORKFLOW_ETAPE_T } from '@/types'

interface WorkflowTimelineProps {
  etapes: WORKFLOW_ETAPE_T[]
}

export function WorkflowTimeline({ etapes }: WorkflowTimelineProps) {
  // Trier par ordre et récupérer uniquement les étapes principales (sans parent)
  const rootEtapes = (etapes || [])
    .filter(e => !e.parent_etape_code)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <div className="relative pl-2 max-w-[820px]">
      {rootEtapes.length === 0 ? (
        <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
          Aucune étape configurée pour ce workflow.
        </div>
      ) : (
        rootEtapes.map((etape, index: number) => (
          <WorkflowCycle 
            key={etape.id || index}
            etape={etape}
            allEtapes={etapes}
            numero={etape.order || index + 1}
            isLast={index === rootEtapes.length - 1}
          />
        ))
      )}
    </div>
  )
}
