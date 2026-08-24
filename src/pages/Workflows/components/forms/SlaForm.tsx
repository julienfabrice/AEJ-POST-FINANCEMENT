import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
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
import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useSlaForm } from '../../hooks/forms/useSlaForm'
import type { WORKFLOW_ETAPE_SLA_T } from '@/types'

interface SlaFormProps {
  etapeCode: string
  initialData?: WORKFLOW_ETAPE_SLA_T
  onCancel: () => void
  onSuccess?: () => void
}

export function SlaForm({ etapeCode, initialData, onCancel, onSuccess }: SlaFormProps) {
  const { form, onSubmit, isSubmitting, isEditMode } = useSlaForm(etapeCode, initialData, () => {
    onCancel()
    onSuccess?.()
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Modifier le SLA" : "Ajouter un SLA"}</DialogTitle>
        </DialogHeader>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description / Nom du délai</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Délai de traitement du dossier" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-3 gap-3">
          <FormField
            control={form.control}
            name="duration_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valeur</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={1} 
                    {...field} 
                    onChange={e => field.onChange(parseInt(e.target.value) || 1)} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration_unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unité</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Unité" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="HEURES">Heures</SelectItem>
                    <SelectItem value="JOURS">Jours</SelectItem>
                    <SelectItem value="MOIS">Mois</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="delay_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de délai</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MIN">Minimum</SelectItem>
                    <SelectItem value="MAX">Maximum</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" type="button" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting} className={isEditMode ? "bg-[#131C29] hover:bg-[#202d40] text-white" : "bg-[#E7722B] hover:bg-[#C85E18] text-white"}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Enregistrer" : "Ajouter"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
