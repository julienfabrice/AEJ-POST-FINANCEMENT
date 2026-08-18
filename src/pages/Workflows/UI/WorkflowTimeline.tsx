import { WorkflowCycle } from '../components/WorkflowCycle'

interface WorkflowTimelineProps {
  cycles: any[]
}

export function WorkflowTimeline({ cycles }: WorkflowTimelineProps) {
  return (
    <div className="relative pl-2 max-w-[820px]">
      {cycles.length === 0 ? (
        <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
          Aucune étape configurée pour ce guichet.
        </div>
      ) : (
        cycles.map((c: any, ci: number) => (
          <WorkflowCycle 
            key={ci}
            n={c.n}
            code={c.code}
            t={c.t}
            subs={c.subs}
            isLast={ci === cycles.length - 1}
          />
        ))
      )}
    </div>
  )
}
