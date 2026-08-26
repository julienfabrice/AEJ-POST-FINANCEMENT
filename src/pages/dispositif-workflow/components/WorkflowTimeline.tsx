import { Flag } from 'lucide-react'
import { WorkflowCycle } from './WorkflowCycle'

interface WorkflowTimelineProps {
  wf: any
  filteredCycles: any[]
  searchQuery: string
  startN: number
  projects: any[]
}

export function WorkflowTimeline({ wf, filteredCycles, searchQuery, startN, projects }: WorkflowTimelineProps) {
  return (
    <div className="lg:h-full lg:overflow-y-auto lg:pr-[10px] lg:pb-[40px] lg:-mr-[10px]">
      <h2 className="text-[14px] font-bold text-[#5A6B80] uppercase tracking-wider mb-6 lg:sticky lg:top-0 bg-[#F3F5F8] py-2 z-10">
        Progression dans les {wf?.cycles?.length || 0} cycles
      </h2>
      
      <div className="relative">
        {filteredCycles.length === 0 ? (
          <div className="text-center py-10 text-[#5A6B80] bg-white border border-[#E5EAF1] rounded-[11px] border-dashed">
            Aucune étape ne correspond à votre recherche.
          </div>
        ) : (
          filteredCycles.map((cycle) => {
            const projectsInCycle = projects.filter(p => p.etape === cycle.n).length
            const isDone = projects.some(p => p.etape > cycle.n)
            
            return (
              <div key={cycle.n}>
                {cycle.n === startN && (
                  <div className="relative ml-[40px] mt-[4px] mb-[14px] pt-[10px] border-t-2 border-dashed border-[#E7722B] flex">
                    <span className="text-[11.5px] font-bold text-[#C85E18] bg-[#FBEADE] rounded-[20px] px-[12px] py-[4px] -mt-[25px]">
                      <Flag className="w-[13px] h-[13px] inline mr-1 align-[-2px]" /> 
                      Démarrage de l'exécution dans le système
                    </span>
                  </div>
                )}
                <WorkflowCycle 
                  cycle={cycle} 
                  projectsInCycle={projectsInCycle} 
                  startN={startN}
                  isDone={isDone}
                  forceExpand={searchQuery.length > 0}
                />
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
