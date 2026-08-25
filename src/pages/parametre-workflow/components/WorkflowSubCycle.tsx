import { Edit2, Trash2, Clock, FileText, Plus, Info, Users } from 'lucide-react'
import type { WORKFLOW_ETAPE_SLA_T, WORKFLOW_ETAPE_DELIVERABLE_T, WORKFLOW_ETAPE_ROLE_T } from '@/types'
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

import { useWorkflowSubCycle } from '../hooks/useWorkflowSubCycle'
import { useSlaDeliverables } from '../hooks/useSlaDeliverables'
import { useSlaRoles } from '../hooks/useSlaRoles'

import { SlaForm } from './forms/SlaForm'
import { DeliverableForm } from './forms/DeliverableForm'
import { RoleForm } from './forms/RoleForm'

interface WorkflowSubCycleProps {
  sla: WORKFLOW_ETAPE_SLA_T
}

export function WorkflowSubCycle({ sla }: WorkflowSubCycleProps) {
  const {
    isEditModalOpen,
    setIsEditModalOpen,
    handleDeleteSla
  } = useWorkflowSubCycle(sla)

  const {
    displayDeliverables,
    isDeliverablesLoading,
    isDeliverableModalOpen,
    setIsDeliverableModalOpen,
    selectedDeliverableInfo,
    setSelectedDeliverableInfo,
    handleDeleteDeliverable
  } = useSlaDeliverables(sla.etape_code)

  const {
    displayRoles,
    isRolesLoading,
    isRoleModalOpen,
    setIsRoleModalOpen,
    isEditRoleModalOpen,
    setIsEditRoleModalOpen,
    selectedRoleForEdit,
    setSelectedRoleForEdit,
    handleDeleteRole
  } = useSlaRoles(sla.etape_code)

  return (
    <>
      <div className="border-l-2 border-[#EEF2F7] pt-3 pb-1 pl-4 mt-3.5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <p className="text-[14px] text-slate-800 font-bold mb-0.5">
              {sla.description || 'SLA sans description'}
            </p>
            {sla.delay_type && (
              <p className="text-[12.5px] text-slate-500 font-medium">
                Type de délai : <span className="font-semibold text-slate-900">{sla.delay_type}</span>
              </p>
            )}
          </div>
          <span className="flex gap-1 flex-none ml-2">
            <button 
              className="flex items-center justify-center w-7 h-7 rounded text-slate-400 hover:text-[#131C29] hover:bg-slate-100 transition-colors" 
              title="Modifier"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <DeleteConfirmModal
              itemLabel={sla.description || `SLA ${sla.id}`}
              description="Cette action supprimera définitivement ce délai (SLA)."
              onConfirm={handleDeleteSla}
              trigger={
                <button className="flex items-center justify-center w-7 h-7 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Supprimer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              }
            />
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          <span className="text-[11.5px] bg-[#f4f6fa] border border-[#EEF2F7] rounded-[7px] px-2.5 py-1 text-[#5A6B80] inline-flex gap-1.5 items-center">
            <Clock className="w-3.5 h-3.5" />
            <b className="text-[#131C29] font-semibold">{sla.duration_value} {sla.duration_unit}</b>
          </span>
        </div>

        {/* Deliverables Section */}
        <div className="mt-4 pt-3 border-t border-[#EEF2F7] mr-4">
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">Documents / Livrables</h5>
          </div>
          
          {isDeliverablesLoading ? (
            <div className="flex gap-2 mb-3">
              <Skeleton className="h-7 w-[120px] rounded-[7px]" />
              <Skeleton className="h-7 w-[150px] rounded-[7px]" />
              <Skeleton className="h-7 w-[100px] rounded-[7px]" />
            </div>
          ) : displayDeliverables.length === 0 ? (
            <div className="text-slate-400 text-xs italic mb-3">Aucun document requis</div>
          ) : (
            <div className="flex overflow-x-auto gap-2 mb-3 pb-1">
              {displayDeliverables.map((d: WORKFLOW_ETAPE_DELIVERABLE_T) => (
                <span key={d.id} className="shrink-0 max-w-[190px] text-[11.5px] bg-[#f4f6fa] border border-[#EEF2F7] rounded-[7px] px-2.5 py-1 text-[#5A6B80] inline-flex gap-1.5 items-center">
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate" title={d.deliverable_code}>{d.deliverable_code}</span>
                  {d.is_required && <span className="text-red-500 shrink-0" title="Obligatoire">*</span>}
                  
                  <div className="flex items-center gap-1 ml-auto shrink-0 pl-1">
                    <button type="button" onClick={() => setSelectedDeliverableInfo(d)} className="text-slate-400 hover:text-[#131C29] transition-colors" title="Plus d'informations">
                      <Info className="w-3.5 h-3.5" />
                    </button>
                    <DeleteConfirmModal
                      itemLabel={d.deliverable_code}
                      description={`Cette action supprimera définitivement le document "${d.deliverable_code}". Vous aurez 5 secondes pour annuler cette action avant qu'elle ne soit définitive.`}
                      onConfirm={() => handleDeleteDeliverable(d.id)}
                      trigger={
                        <button type="button" className="text-slate-400 hover:text-red-600 transition-colors" title="Supprimer">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      }
                    />
                  </div>
                </span>
              ))}
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 text-[11px] font-medium text-slate-500 px-2"
            onClick={() => setIsDeliverableModalOpen(true)}
          >
            <Plus className="w-3 h-3 mr-1" />
            Ajouter un document
          </Button>
        </div>

        {/* Roles Section */}
        <div className="mt-3 pt-3 border-t border-[#EEF2F7] mr-4">
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">Acteurs / Rôles</h5>
          </div>
          
          {isRolesLoading ? (
            <div className="flex gap-2 mb-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="shrink-0 w-[170px] bg-white border border-[#EEF2F7] rounded-md px-2.5 py-2 flex items-center gap-2.5 shadow-sm">
                  <Skeleton className="w-7 h-7 rounded-full shrink-0" />
                  <div className="min-w-0 flex-1">
                    <Skeleton className="h-3 w-full mb-1.5" />
                    <Skeleton className="h-2.5 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayRoles.length === 0 ? (
            <div className="text-slate-400 text-xs italic mb-3">Aucun rôle défini</div>
          ) : (
            <div className="flex overflow-x-auto gap-2 mb-3 pb-1">
              {displayRoles.map((r: WORKFLOW_ETAPE_ROLE_T) => (
                <div key={r.id} className="shrink-0 max-w-[190px] bg-white border border-[#EEF2F7] rounded-md px-2.5 py-2 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <div className="min-w-0 flex flex-col justify-center">
                      <p className="text-[11.5px] font-semibold text-slate-800 truncate leading-tight" title={r.role_code}>{r.role_code}</p>
                      <p className="text-[10.5px] font-medium text-slate-500 truncate leading-tight mt-0.5" title={r.action}>{r.action}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button 
                      type="button" 
                      className="text-slate-400 hover:text-[#131C29] transition-colors" 
                      title="Modifier"
                      onClick={() => {
                        setSelectedRoleForEdit(r)
                        setIsEditRoleModalOpen(true)
                      }}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <DeleteConfirmModal
                      itemLabel={r.role_code}
                      description={`Cette action supprimera définitivement l'attribution de ce rôle. Vous aurez 5 secondes pour annuler.`}
                      onConfirm={() => handleDeleteRole(r.id)}
                      trigger={
                        <button type="button" className="text-slate-400 hover:text-red-600 transition-colors" title="Supprimer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 text-[11px] font-medium text-slate-500 px-2"
            onClick={() => setIsRoleModalOpen(true)}
          >
            <Plus className="w-3 h-3 mr-1" />
            Ajouter un rôle
          </Button>
        </div>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <SlaForm etapeCode={sla.etape_code} initialData={sla} onCancel={() => setIsEditModalOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeliverableModalOpen} onOpenChange={setIsDeliverableModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DeliverableForm etapeCode={sla.etape_code} onCancel={() => setIsDeliverableModalOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedDeliverableInfo} onOpenChange={(open) => !open && setSelectedDeliverableInfo(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-500" />
              Détails du document
            </DialogTitle>
          </DialogHeader>
          {selectedDeliverableInfo && (
            <div className="py-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-1">Code du document</h4>
                <p className="text-sm font-semibold text-slate-900 break-all bg-slate-50 p-2 rounded border border-slate-100">
                  {selectedDeliverableInfo.deliverable_code}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-slate-500">Obligatoire :</h4>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${selectedDeliverableInfo.is_required ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                  {selectedDeliverableInfo.is_required ? 'OUI' : 'NON'}
                </span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedDeliverableInfo(null)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <RoleForm etapeCode={sla.etape_code} onCancel={() => setIsRoleModalOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditRoleModalOpen} onOpenChange={(open) => {
        setIsEditRoleModalOpen(open)
        if (!open) setSelectedRoleForEdit(null)
      }}>
        <DialogContent className="sm:max-w-[425px]">
          {selectedRoleForEdit && (
            <RoleForm etapeCode={sla.etape_code} selectedRole={selectedRoleForEdit} onCancel={() => setIsEditRoleModalOpen(false)} />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
