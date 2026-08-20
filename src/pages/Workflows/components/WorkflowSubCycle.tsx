import { useState, useEffect } from 'react'
import { Edit2, Trash2, Clock, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { workflowServices } from '@/services/workflow'
import { etapeSlaSchema, type EtapeSlaFormValues } from '@/schema/workflow'
import type { WORKFLOW_ETAPE_SLA_T } from '@/types'
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal'
import { Button } from '@/components/ui/button'
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
    </>
  )
}
