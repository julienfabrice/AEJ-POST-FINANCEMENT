import { useState, useEffect } from 'react'
import { Edit2, Trash2, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { WorkflowSubCycle } from './WorkflowSubCycle'
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal'
import type { WORKFLOW_ETAPE_T, WORKFLOW_ETAPE_SLA_T } from '@/types'
import { workflowServices } from '@/services/workflow'
import { 
  etapeSchema, type EtapeFormValues,
  etapeSlaSchema, type EtapeSlaFormValues
} from '@/schema/workflow'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface WorkflowCycleProps {
  etape?: WORKFLOW_ETAPE_T
  numero: number
  code: string
  titre: string
  isLast?: boolean
}

export function WorkflowCycle({ etape, numero, code, titre, isLast }: WorkflowCycleProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  const updateEtapeMutation = workflowServices.useUpdateEtape()
  const deleteEtapeMutation = workflowServices.useDeleteEtape()
  const createSlaMutation = workflowServices.useCreateEtapeSla()
  const { data: fetchedSlas, isLoading: isSlasLoading } = workflowServices.useGetEtapeSlas(code)

  const [isSlaModalOpen, setIsSlaModalOpen] = useState(false)

  const addSlaForm = useForm<EtapeSlaFormValues>({
    resolver: zodResolver(etapeSlaSchema),
    defaultValues: {
      etape_code: code,
      description: '',
      duration_value: 1,
      duration_unit: 'JOURS',
      delay_type: 'MAX' // Valeur temporaire
    }
  })

  const onAddSla = (data: EtapeSlaFormValues) => {
    createSlaMutation.mutate(
      {
        ...data,
        etape_code: code
      },
      {
        onSuccess: () => {
          setIsSlaModalOpen(false)
          addSlaForm.reset()
        }
      }
    )
  }

  const editForm = useForm<EtapeFormValues>({
    resolver: zodResolver(etapeSchema),
    defaultValues: {
      code: '',
      name: '',
      order: 1,
      description: ''
    }
  })

  useEffect(() => {
    if (etape) {
      editForm.reset({
        code: etape.code,
        name: etape.name,
        order: etape.order,
        description: etape.description || ''
      })
    }
  }, [etape, editForm])

  const onSubmit = (data: EtapeFormValues) => {
    if (!etape) return

    updateEtapeMutation.mutate(
      {
        id: etape.id,
        code: data.code,
        name: data.name,
        order: data.order,
        description: data.description || undefined
      },
      {
        onSuccess: () => {
          setIsEditModalOpen(false)
        }
      }
    )
  }

  const handleDelete = () => {
    if (!etape) return
    deleteEtapeMutation.mutate(etape.id)
  }

  const openEditModal = () => {
    setIsEditModalOpen(true)
  }

  const displaySlas = (etape?.slas && etape.slas.length > 0) ? etape.slas : (fetchedSlas || [])

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
               <div className="flex justify-center py-4 text-slate-400">
                 <Loader2 className="w-5 h-5 animate-spin" />
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
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Modifier l'étape</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-6">
                <FormField
                  control={editForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code de l'étape</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l'étape</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ordre d'exécution</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={updateEtapeMutation.isPending} className="bg-[#E7722B] hover:bg-[#C85E18] text-white">
                  {updateEtapeMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enregistrer
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isSlaModalOpen} onOpenChange={setIsSlaModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un SLA pour l'étape {titre}</DialogTitle>
          </DialogHeader>
          <Form {...addSlaForm}>
            <form onSubmit={addSlaForm.handleSubmit(onAddSla)} className="space-y-4">
              <FormField
                control={addSlaForm.control}
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
                  control={addSlaForm.control}
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
                  control={addSlaForm.control}
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
                  control={addSlaForm.control}
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
                <Button variant="outline" type="button" onClick={() => setIsSlaModalOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={createSlaMutation.isPending} className="bg-[#E7722B] hover:bg-[#C85E18] text-white">
                  {createSlaMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Ajouter
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
