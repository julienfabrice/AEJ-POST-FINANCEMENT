import { WorkflowCycle } from '../components/WorkflowCycle'

interface WorkflowTimelineProps {
  etapes: any[]
}

export function WorkflowTimeline({ etapes }: WorkflowTimelineProps) {
  return (
    <div className="relative pl-2 max-w-[820px]">
      {etapes.length === 0 ? (
        <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
          Aucune étape configurée pour ce guichet.
        </div>
      ) : (
        etapes.map((etape: any, index: number) => (
          <WorkflowCycle 
            key={index}
            numero={etape.numero}
            code={etape.code}
            titre={etape.titre}
            sousEtapes={etape.sousEtapes}
            isLast={index === etapes.length - 1}
          />
        ))
      )}
    </div>
  )
}
