import { useState } from 'react'
import { Edit2, Trash2, Plus, Clock, FileText, Info, Users, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Skeleton } from '@/components/ui/skeleton'
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal'
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { etapeSchema, type EtapeFormValues } from '@/schema/workflow'
import { workflowServices } from '@/services/workflow'
import type { WORKFLOW_ETAPE_T, WORKFLOW_ETAPE_SLA_T, WORKFLOW_ETAPE_DELIVERABLE_T, WORKFLOW_ETAPE_ROLE_T } from '@/types'

import { useWorkflowCycle } from '../hooks/useWorkflowCycle'
import { useWorkflowSubCycle } from '../hooks/useWorkflowSubCycle' // Still used for SLA actions
import { useEtapeDeliverables } from '../hooks/useEtapeDeliverables'
import { useEtapeRoles } from '../hooks/useEtapeRoles'

import { SlaForm } from './forms/SlaForm'
import { EtapeForm } from './forms/EtapeForm'
import { DeliverableForm } from './forms/DeliverableForm'
import { RoleForm } from './forms/RoleForm'

interface WorkflowCycleProps {
  etape: WORKFLOW_ETAPE_T
  allEtapes: WORKFLOW_ETAPE_T[]
  numero: string | number
  code?: string
  titre?: string
  isLast?: boolean
  isSubEtape?: boolean
}

function CreateSubEtapeForm({ workflowVersion, parentCode, nextOrder, onCancel }: { workflowVersion: string, parentCode: string, nextOrder: number, onCancel: () => void }) {
  const createMutation = workflowServices.useCreateEtape()
  const form = useForm<EtapeFormValues>({
    resolver: zodResolver(etapeSchema),
    defaultValues: { code: '', name: '', order: nextOrder, description: '', parent_etape_code: parentCode }
  })

  const onSubmit = (data: EtapeFormValues) => {
    createMutation.mutate(
      { ...data, workflow_version: workflowVersion, parent_etape_code: parentCode },
      { onSuccess: onCancel }
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <DialogHeader>
          <DialogTitle>Ajouter une sous-étape</DialogTitle>
        </DialogHeader>
        <FormField control={form.control} name="code" render={({ field }) => (
          <FormItem><FormLabel>Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Nom</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="order" render={({ field }) => (
          <FormItem><FormLabel>Ordre</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
        )} />
        <DialogFooter className="mt-6">
          <Button variant="outline" type="button" onClick={onCancel}>Annuler</Button>
          <Button type="submit" disabled={createMutation.isPending} className="bg-[#131C29] text-white">
            {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Ajouter
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

// Composant pour afficher un SLA individuel
function SlaItem({ sla }: { sla: WORKFLOW_ETAPE_SLA_T }) {
  const { isEditModalOpen, setIsEditModalOpen, handleDeleteSla } = useWorkflowSubCycle(sla)
  
  return (
    <>
      <div className="border-l-2 border-[#EEF2F7] pt-3 pb-2 pl-4 mt-2">
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
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <SlaForm etapeCode={sla.etape_code} initialData={sla} onCancel={() => setIsEditModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export function WorkflowCycle({ etape, allEtapes, numero, code, titre, isLast, isSubEtape = false }: WorkflowCycleProps) {
  const currentCode = code || etape.code
  const currentTitre = titre || etape.name
  const [isCreateSubEtapeOpen, setIsCreateSubEtapeOpen] = useState(false)

  // SLA hooks
  const {
    isEditModalOpen, setIsEditModalOpen,
    isSlaModalOpen, setIsSlaModalOpen,
    displaySlas, isSlasLoading,
    handleDelete
  } = useWorkflowCycle(etape, currentCode)

  // Deliverables hooks
  const {
    displayDeliverables, isDeliverablesLoading,
    isDeliverableModalOpen, setIsDeliverableModalOpen,
    selectedDeliverableInfo, setSelectedDeliverableInfo,
    handleDeleteDeliverable
  } = useEtapeDeliverables(currentCode)

  // Roles hooks
  const {
    displayRoles, isRolesLoading,
    isRoleModalOpen, setIsRoleModalOpen,
    isEditRoleModalOpen, setIsEditRoleModalOpen,
    selectedRoleForEdit, setSelectedRoleForEdit,
    handleDeleteRole
  } = useEtapeRoles(currentCode)

  // Sub-étapes
  const subEtapes = (allEtapes || []).filter(e => e.parent_etape_code === currentCode).sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <>
      <div className={`relative ${isSubEtape ? 'pl-6 mt-4' : 'pb-1.5 pl-10 mb-1.5'}`}>
        {!isLast && !isSubEtape && (
          <div className="absolute left-[13px] top-[34px] -bottom-1.5 w-[2px] bg-[#E5EAF1]" />
        )}
        
        {/* Ligne verticale pour relier les sous-étapes au parent si isSubEtape est vrai */}
        {isSubEtape && (
           <div className="absolute left-[-16px] top-[-16px] bottom-0 w-[2px] bg-[#E5EAF1]" />
        )}
        {isSubEtape && (
           <div className="absolute left-[-16px] top-[14px] w-[16px] h-[2px] bg-[#E5EAF1]" />
        )}

        {!isSubEtape && (
          <div className="absolute left-0 top-0.5 w-7 h-7 rounded-[9px] bg-[#131C29] text-white flex items-center justify-center font-bold text-[13px] z-10">
            {numero}
          </div>
        )}
        
        <Card className={`bg-white border-[#E5EAF1] rounded-[7px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden p-0 gap-0 ${isSubEtape ? 'border-l-4 border-l-[#E7722B]' : ''}`}>
          
          <div className="px-4 py-[13px] flex items-center flex-wrap gap-2.5 cursor-default bg-slate-50 border-b border-[#EEF2F7]">
            <div className="flex-1 min-w-0 flex items-center gap-2">
              {isSubEtape && (
                <div className="w-6 h-6 rounded-md bg-[#E7722B] text-white flex items-center justify-center font-bold text-[11px]">
                  {numero}
                </div>
              )}
              <div>
                <h4 className="text-[14px] font-bold text-[#131C29]">{currentTitre}</h4>
                <div className="text-[11px] text-[#5A6B80] font-mono">{currentCode}</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                className="flex items-center justify-center w-8 h-8 rounded text-slate-400 hover:text-[#131C29] hover:bg-slate-100 transition-colors" 
                title="Modifier l'étape"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit2 className="w-4 h-4" />
              </button>
              
              <DeleteConfirmModal
                itemLabel={currentTitre}
                description={`Cette action supprimera définitivement l'étape "${currentTitre}". Vous aurez 5 secondes pour annuler cette action avant qu'elle ne soit définitive.`}
                onConfirm={handleDelete}
                trigger={
                  <button className="flex items-center justify-center w-8 h-8 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Supprimer l'étape">
                    <Trash2 className="w-4 h-4" />
                  </button>
                }
              />
            </div>
          </div>
          
          <CardContent className="px-4 pb-4 block pt-4">
            
            {/* SLA Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">Durée & SLA</h5>
              </div>
              
              {isSlasLoading ? (
                <div className="space-y-3 py-2">
                  <div className="border-l-2 border-[#EEF2F7] pl-4 pt-2 pb-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2 mb-3" />
                  </div>
                </div>
              ) : displaySlas.length === 0 ? (
                <div className="text-slate-500 text-xs italic py-2">Aucun SLA configuré</div>
              ) : (
                displaySlas.map((sla: WORKFLOW_ETAPE_SLA_T) => (
                  <SlaItem key={sla.id} sla={sla} />
                ))
              )}
              
              <div className="mt-3">
                <Button variant="outline" size="sm" className="h-7 text-xs font-medium text-slate-600" onClick={() => setIsSlaModalOpen(true)}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Ajouter un SLA
                </Button>
              </div>
            </div>

            {/* Deliverables Section */}
            <div className="mb-6 pt-3 border-t border-[#EEF2F7]">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">Documents / Livrables</h5>
              </div>
              
              {isDeliverablesLoading ? (
                <div className="flex gap-2 mb-3">
                  <Skeleton className="h-7 w-[120px] rounded-[7px]" />
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
                          description={`Cette action supprimera définitivement le document "${d.deliverable_code}".`}
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
              
              <Button variant="outline" size="sm" className="h-7 text-[11px] font-medium text-slate-500 px-2" onClick={() => setIsDeliverableModalOpen(true)}>
                <Plus className="w-3 h-3 mr-1" /> Ajouter un document
              </Button>
            </div>

            {/* Roles Section */}
            <div className="mb-2 pt-3 border-t border-[#EEF2F7]">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">Acteurs / Rôles</h5>
              </div>
              
              {isRolesLoading ? (
                <div className="flex gap-2 mb-3">
                  <Skeleton className="w-[170px] h-12 rounded-md" />
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
                          onClick={() => { setSelectedRoleForEdit(r); setIsEditRoleModalOpen(true); }}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <DeleteConfirmModal
                          itemLabel={r.role_code}
                          description={`Cette action supprimera définitivement l'attribution de ce rôle.`}
                          onConfirm={() => handleDeleteRole(r.id)}
                          trigger={
                            <button type="button" className="text-slate-400 hover:text-red-600 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <Button variant="outline" size="sm" className="h-7 text-[11px] font-medium text-slate-500 px-2" onClick={() => setIsRoleModalOpen(true)}>
                <Plus className="w-3 h-3 mr-1" /> Ajouter un rôle
              </Button>
            </div>

            {/* Sous-étapes Section */}
            {(!isSubEtape || subEtapes.length > 0) && (
              <div className="mt-6 pt-4 border-t-2 border-dashed border-[#E5EAF1]">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-[12px] font-bold text-slate-800 uppercase tracking-wider">Sous-étapes</h5>
                  {!isSubEtape && (
                    <Button variant="outline" size="sm" className="h-7 text-[11px] font-medium text-slate-500 px-2" onClick={() => setIsCreateSubEtapeOpen(true)}>
                      <Plus className="w-3 h-3 mr-1" /> Ajouter une sous-étape
                    </Button>
                  )}
                </div>
                {subEtapes.length === 0 ? (
                  <div className="text-slate-400 text-xs italic py-2">Aucune sous-étape configurée</div>
                ) : (
                  <div className="relative">
                     {subEtapes.map((subEtape, idx) => (
                       <WorkflowCycle 
                         key={subEtape.id}
                         etape={subEtape}
                         allEtapes={allEtapes}
                         numero={`${numero}.${subEtape.order || idx + 1}`}
                         code={subEtape.code}
                         titre={subEtape.name}
                         isLast={idx === subEtapes.length - 1}
                         isSubEtape={true}
                       />
                     ))}
                  </div>
                )}
              </div>
            )}
            
          </CardContent>
        </Card>
      </div>

      {/* Modals for Etape */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          {etape && <EtapeForm etape={etape} onCancel={() => setIsEditModalOpen(false)} />}
        </DialogContent>
      </Dialog>
      
      {/* Modal for creating a Sub Etape */}
      <Dialog open={isCreateSubEtapeOpen} onOpenChange={setIsCreateSubEtapeOpen}>
        <DialogContent className="sm:max-w-[425px]">
           <CreateSubEtapeForm 
             workflowVersion={etape.workflow_version} 
             parentCode={currentCode} 
             nextOrder={subEtapes.length + 1}
             onCancel={() => setIsCreateSubEtapeOpen(false)} 
           />
        </DialogContent>
      </Dialog>

      <Dialog open={isSlaModalOpen} onOpenChange={setIsSlaModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <SlaForm etapeCode={currentCode} onCancel={() => setIsSlaModalOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Modals for Deliverables */}
      <Dialog open={isDeliverableModalOpen} onOpenChange={setIsDeliverableModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DeliverableForm etapeCode={currentCode} onCancel={() => setIsDeliverableModalOpen(false)} />
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

      {/* Modals for Roles */}
      <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <RoleForm etapeCode={currentCode} onCancel={() => setIsRoleModalOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditRoleModalOpen} onOpenChange={(open) => {
        setIsEditRoleModalOpen(open)
        if (!open) setSelectedRoleForEdit(null)
      }}>
        <DialogContent className="sm:max-w-[425px]">
          {selectedRoleForEdit && (
            <RoleForm etapeCode={currentCode} selectedRole={selectedRoleForEdit} onCancel={() => setIsEditRoleModalOpen(false)} />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
