import { Edit2, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Skeleton } from '@/components/ui/skeleton'
import { WorkflowSubCycle } from './WorkflowSubCycle'
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal'
import type { WORKFLOW_ETAPE_T, WORKFLOW_ETAPE_SLA_T } from '@/types'
import { useWorkflowCycle } from '../hooks/useWorkflowCycle'
import { SlaForm } from './forms/SlaForm'
import { EtapeForm } from './forms/EtapeForm'

interface WorkflowCycleProps {
  etape?: WORKFLOW_ETAPE_T
  numero: number
  code: string
  titre: string
  isLast?: boolean
}

export function WorkflowCycle({ etape, numero, code, titre, isLast }: WorkflowCycleProps) {
  const {
    isEditModalOpen,
    setIsEditModalOpen,
    isSlaModalOpen,
    setIsSlaModalOpen,
    displaySlas,
    isSlasLoading,
    handleDelete
  } = useWorkflowCycle(etape, code)

  const openEditModal = () => {
    setIsEditModalOpen(true)
  }


  return (
    <>
      <div className="relative pb-1.5 pl-10 mb-1.5">
        {/* Ligne verticale de connexion */}
        {!isLast && (
          <div className="absolute left-[13px] top-[34px] -bottom-1.5 w-[2px] bg-[#E5EAF1]" />
        )}
        
        {/* Numéro */}
        <div className="absolute left-0 top-0.5 w-7 h-7 rounded-[9px] bg-[#131C29] text-white flex items-center justify-center font-bold text-[13px] z-10">
          {numero}
        </div>
        
        {/* Carte du cycle */}
        <Card className="bg-white border-[#E5EAF1] rounded-[7px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden p-0 gap-0">
          
          {/* Header */}
          <div className="px-4 py-[13px] flex items-center flex-wrap gap-2.5 cursor-default">
            <div className="flex-1 min-w-0">
              <h4 className="text-[14px] font-bold text-[#131C29]">{titre}</h4>
              <div className="text-[11px] text-[#5A6B80] font-mono">{code}</div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                className="flex items-center justify-center w-8 h-8 rounded text-slate-400 hover:text-[#131C29] hover:bg-slate-100 transition-colors" 
                title="Modifier l'étape"
                onClick={openEditModal}
              >
                <Edit2 className="w-4 h-4" />
              </button>
              
              <DeleteConfirmModal
                itemLabel={titre}
                description={`Cette action supprimera définitivement l'étape "${titre}". Vous aurez 5 secondes pour annuler cette action avant qu'elle ne soit définitive.`}
                onConfirm={handleDelete}
                trigger={
                  <button className="flex items-center justify-center w-8 h-8 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Supprimer l'étape">
                    <Trash2 className="w-4 h-4" />
                  </button>
                }
              />
            </div>
          </div>
          
          {/* Body */}
          <CardContent className="px-4 pb-4 border-t border-[#EEF2F7] block pt-4">
            {isSlasLoading ? (
              <div className="space-y-3 py-2">
                {[1, 2].map(i => (
                  <div key={i} className="border-l-2 border-[#EEF2F7] pl-4 pt-2 pb-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2 mb-3" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-[120px] rounded-full" />
                      <Skeleton className="h-6 w-[90px] rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : displaySlas.length === 0 ? (
              <div className="text-slate-500 text-sm py-2">Aucun SLA configuré</div>
            ) : (
              displaySlas.map((sla: WORKFLOW_ETAPE_SLA_T) => (
                <WorkflowSubCycle 
                  key={sla.id}
                  sla={sla}
                />
              ))
            )}
            
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-xs font-medium text-slate-600"
                onClick={() => setIsSlaModalOpen(true)}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Ajouter un SLA
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          {etape && <EtapeForm etape={etape} onCancel={() => setIsEditModalOpen(false)} />}
        </DialogContent>
      </Dialog>

      <Dialog open={isSlaModalOpen} onOpenChange={setIsSlaModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <SlaForm etapeCode={code} onCancel={() => setIsSlaModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
