import { useState, useEffect } from 'react'
import { Edit2, Trash2, Clock, Loader2, FileText, Plus, Info, Users } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { workflowServices } from '@/services/workflow'
import { 
  etapeSlaSchema, type EtapeSlaFormValues, 
  etapeDeliverableSchema, type EtapeDeliverableFormValues,
  etapeRoleSchema, type EtapeRoleFormValues
} from '@/schema/workflow'
import type { WORKFLOW_ETAPE_SLA_T, WORKFLOW_ETAPE_DELIVERABLE_T, WORKFLOW_ETAPE_ROLE_T } from '@/types'
import { Checkbox } from "@/components/ui/checkbox"
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal'
import { Button } from '@/components/ui/button'
import { rolesServices } from '@/services/roles.services'
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface WorkflowSubCycleProps {
  sla: WORKFLOW_ETAPE_SLA_T
}

export function WorkflowSubCycle({ sla }: WorkflowSubCycleProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  const updateSlaMutation = workflowServices.useUpdateEtapeSla()
  const deleteSlaMutation = workflowServices.useDeleteEtapeSla()

  // Deliverables
  const { data: fetchedDeliverables, isLoading: isDeliverablesLoading } = workflowServices.useGetEtapeDeliverables(sla.etape_code)
  const createDeliverableMutation = workflowServices.useCreateEtapeDeliverable()
  const deleteDeliverableMutation = workflowServices.useDeleteEtapeDeliverable()

  const [isDeliverableModalOpen, setIsDeliverableModalOpen] = useState(false)
  const [selectedDeliverableInfo, setSelectedDeliverableInfo] = useState<WORKFLOW_ETAPE_DELIVERABLE_T | null>(null)

  const displayDeliverables = fetchedDeliverables || []

  const deliverableForm = useForm<EtapeDeliverableFormValues>({
    resolver: zodResolver(etapeDeliverableSchema),
    defaultValues: {
      etape_code: sla.etape_code,
      deliverable_code: '',
      is_required: true
    }
  })

  useEffect(() => {
    if (!isDeliverableModalOpen) deliverableForm.reset()
  }, [isDeliverableModalOpen, deliverableForm])

  const onAddDeliverable = (data: EtapeDeliverableFormValues) => {
    createDeliverableMutation.mutate(data, {
      onSuccess: () => {
        setIsDeliverableModalOpen(false)
        deliverableForm.reset()
      }
    })
  }

  const handleDeleteDeliverable = (id: number) => {
    deleteDeliverableMutation.mutate(id)
  }

  // Roles
  const { data: fetchedRoles, isLoading: isRolesLoading } = workflowServices.useGetEtapeRoles(sla.etape_code)
  const createRoleMutation = workflowServices.useCreateEtapeRole()
  const updateRoleMutation = workflowServices.useUpdateEtapeRole()
  const deleteRoleMutation = workflowServices.useDeleteEtapeRole()

  const { data: availableRoles = [], isLoading: isAvailableRolesLoading } = rolesServices.useGetAll()

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false)
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<WORKFLOW_ETAPE_ROLE_T | null>(null)
  
  const displayRoles = fetchedRoles || []

  const roleForm = useForm<EtapeRoleFormValues>({
    resolver: zodResolver(etapeRoleSchema),
    defaultValues: {
      etape_code: sla.etape_code,
      role_code: '',
      action: ''
    }
  })

  useEffect(() => {
    if (!isRoleModalOpen) roleForm.reset()
  }, [isRoleModalOpen, roleForm])

  const editRoleForm = useForm<EtapeRoleFormValues>({
    resolver: zodResolver(etapeRoleSchema),
    defaultValues: {
      etape_code: sla.etape_code,
      role_code: '',
      action: ''
    }
  })

  useEffect(() => {
    if (selectedRoleForEdit) {
      editRoleForm.reset({
        etape_code: selectedRoleForEdit.etape_code,
        role_code: selectedRoleForEdit.role_code,
        action: selectedRoleForEdit.action,
      })
    }
  }, [selectedRoleForEdit, editRoleForm])

  const onAddRole = (data: EtapeRoleFormValues) => {
    createRoleMutation.mutate(data, {
      onSuccess: () => {
        setIsRoleModalOpen(false)
        roleForm.reset()
      }
    })
  }

  const onUpdateRole = (data: EtapeRoleFormValues) => {
    if (!selectedRoleForEdit) return
    updateRoleMutation.mutate({ id: selectedRoleForEdit.id, ...data }, {
      onSuccess: () => {
        setIsEditRoleModalOpen(false)
        setSelectedRoleForEdit(null)
      }
    })
  }

  const handleDeleteRole = (id: number) => {
    deleteRoleMutation.mutate(id)
  }

  const editForm = useForm<EtapeSlaFormValues>({
    resolver: zodResolver(etapeSlaSchema),
    defaultValues: {
      etape_code: sla.etape_code,
      description: sla.description || '',
      duration_value: sla.duration_value,
      duration_unit: sla.duration_unit,
      delay_type: sla.delay_type || 'MAX',
    }
  })

  useEffect(() => {
    if (sla) {
      editForm.reset({
        etape_code: sla.etape_code,
        description: sla.description || '',
        duration_value: sla.duration_value,
        duration_unit: sla.duration_unit,
        delay_type: sla.delay_type || 'MAX',
      })
    }
  }, [sla, editForm])

  const onSubmit = (data: EtapeSlaFormValues) => {
    updateSlaMutation.mutate(
      {
        id: sla.id,
        ...data
      },
      {
        onSuccess: () => {
          setIsEditModalOpen(false)
        }
      }
    )
  }

  const handleDelete = () => {
    deleteSlaMutation.mutate(sla.id)
  }

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
              itemLabel={`SLA (${sla.duration_value} ${sla.duration_unit})`}
              description={`Cette action supprimera définitivement le SLA sélectionné. Vous aurez 5 secondes pour annuler cette action avant qu'elle ne soit définitive.`}
              onConfirm={handleDelete}
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
            <div className="flex justify-center py-2 text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin" />
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
            <div className="flex justify-center py-2 text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin" />
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le SLA</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description du délai</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Délai de traitement du dossier" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4 w-full">
                <FormField
                  control={editForm.control}
                  name="duration_value"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Valeur</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Ex: 5" 
                          {...field} 
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="duration_unit"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Unité</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="HEURES">Heures</SelectItem>
                          <SelectItem value="JOURS">Jours</SelectItem>
                          <SelectItem value="SEMAINES">Semaines</SelectItem>
                          <SelectItem value="MOIS">Mois</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="delay_type"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Type de délai</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MAX">Maximum</SelectItem>
                          <SelectItem value="MIN">Minimum</SelectItem>
                          <SelectItem value="WARNING">Alerte</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={updateSlaMutation.isPending} className="bg-[#E7722B] hover:bg-[#C85E18] text-white">
                  {updateSlaMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Enregistrer
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeliverableModalOpen} onOpenChange={setIsDeliverableModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...deliverableForm}>
            <form onSubmit={deliverableForm.handleSubmit(onAddDeliverable)} className="space-y-4">
              <DialogHeader>
                <DialogTitle>Ajouter un document (Livrable)</DialogTitle>
              </DialogHeader>
              
              <FormField
                control={deliverableForm.control}
                name="deliverable_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code du document</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: PLAN_AFFAIRES" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={deliverableForm.control}
                name="is_required"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-[#EEF2F7] p-4 bg-[#f4f6fa]/30">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Document obligatoire
                      </FormLabel>
                      <p className="text-sm text-slate-500">
                        Cochez cette case si le document est indispensable pour passer à l'étape suivante.
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button variant="outline" type="button" onClick={() => setIsDeliverableModalOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={createDeliverableMutation.isPending} className="bg-[#E7722B] hover:bg-[#C85E18] text-white">
                  {createDeliverableMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Ajouter
                </Button>
              </DialogFooter>
            </form>
          </Form>
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
          <Form {...roleForm}>
            <form onSubmit={roleForm.handleSubmit(onAddRole)} className="space-y-4">
              <DialogHeader>
                <DialogTitle>Ajouter un acteur (Rôle)</DialogTitle>
              </DialogHeader>
              
              <FormField
                control={roleForm.control}
                name="role_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rôle / Acteur</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={isAvailableRolesLoading ? "Chargement..." : "Sélectionnez un rôle"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableRoles.map((role) => (
                          <SelectItem key={role.code} value={role.code}>
                            {role.name || role.libelle || role.code}
                          </SelectItem>
                        ))}
                        {availableRoles.length === 0 && !isAvailableRolesLoading && (
                          <SelectItem value="" disabled>Aucun rôle disponible</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={roleForm.control}
                name="action"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Action</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionnez une action" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AJOUT_PLAN_AFFAIRES">Ajout Plan d'Affaires</SelectItem>
                        <SelectItem value="SOUMISSION">Soumission</SelectItem>
                        <SelectItem value="VALIDATION">Validation</SelectItem>
                        <SelectItem value="REJET">Rejet</SelectItem>
                        <SelectItem value="REVISION">Révision / Modification</SelectItem>
                        <SelectItem value="CONSULTATION">Consultation (Lecture seule)</SelectItem>
                        <SelectItem value="APPROBATION_FINALE">Approbation Finale</SelectItem>
                        <SelectItem value="DECISION">Décision</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button variant="outline" type="button" onClick={() => setIsRoleModalOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={createRoleMutation.isPending} className="bg-[#E7722B] hover:bg-[#C85E18] text-white">
                  {createRoleMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Ajouter
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditRoleModalOpen} onOpenChange={(open) => {
        setIsEditRoleModalOpen(open)
        if (!open) setSelectedRoleForEdit(null)
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...editRoleForm}>
            <form onSubmit={editRoleForm.handleSubmit(onUpdateRole)} className="space-y-4">
              <DialogHeader>
                <DialogTitle>Modifier un acteur (Rôle)</DialogTitle>
              </DialogHeader>
              
              <FormField
                control={editRoleForm.control}
                name="role_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rôle / Acteur</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={isAvailableRolesLoading ? "Chargement..." : "Sélectionnez un rôle"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableRoles.map((role) => (
                          <SelectItem key={role.code} value={role.code}>
                            {role.name || role.libelle || role.code}
                          </SelectItem>
                        ))}
                        {availableRoles.length === 0 && !isAvailableRolesLoading && (
                          <SelectItem value="" disabled>Aucun rôle disponible</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editRoleForm.control}
                name="action"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Action</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionnez une action" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AJOUT_PLAN_AFFAIRES">Ajout Plan d'Affaires</SelectItem>
                        <SelectItem value="SOUMISSION">Soumission</SelectItem>
                        <SelectItem value="VALIDATION">Validation</SelectItem>
                        <SelectItem value="REJET">Rejet</SelectItem>
                        <SelectItem value="REVISION">Révision / Modification</SelectItem>
                        <SelectItem value="CONSULTATION">Consultation (Lecture seule)</SelectItem>
                        <SelectItem value="APPROBATION_FINALE">Approbation Finale</SelectItem>
                        <SelectItem value="DECISION">Décision</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button variant="outline" type="button" onClick={() => setIsEditRoleModalOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={updateRoleMutation.isPending} className="bg-[#E7722B] hover:bg-[#C85E18] text-white">
                  {updateRoleMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enregistrer
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
