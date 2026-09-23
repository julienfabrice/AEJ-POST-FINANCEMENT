import { TabsContent } from '@/components/ui/tabs'

import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import { Loader2 } from 'lucide-react'

import { useWorkflowTab } from './useWorkflowTab'
import { WorkflowTabItem } from './WorkflowTabItem'

interface WorkflowTabProps {
  projet: MICRO_PROJET_T
}

export function WorkflowTab({ projet }: WorkflowTabProps) {
  const { mainSteps, currentIndex, isAcheve, isLoading, allEtapeRoles } = useWorkflowTab(projet)

  return (
    <TabsContent value="workflow" className="mt-0 focus-visible:outline-none">
      <h3 className="text-[12px] font-bold text-aej-ink-2 mb-6 uppercase tracking-wider">
        Progression dans les cycles (Workflow)
      </h3>
      
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="w-5 h-5 text-aej-orange animate-spin" />
        </div>
      ) : mainSteps.length > 0 ? (
        <div className="relative">
          {/* Ligne verticale globale */}
          <div className="absolute left-[5px] top-[8px] bottom-[24px] w-[2px] bg-aej-line" />
          
          {mainSteps.map((step, i, arr) => (
            <WorkflowTabItem
              key={step.id || i}
              step={step}
              index={i}
              currentIndex={currentIndex}
              isAcheve={isAcheve}
              allEtapeRoles={allEtapeRoles}
              isLast={i === arr.length - 1}
            />
          ))}
        </div>
      ) : (
        <div className="text-[13px] text-aej-slate italic py-2">
          Aucune donnée de workflow disponible pour ce projet.
        </div>
      )}
    </TabsContent>
  )
}
