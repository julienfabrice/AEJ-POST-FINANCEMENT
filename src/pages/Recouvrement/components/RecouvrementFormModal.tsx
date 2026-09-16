import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRecouvrementForm } from '../hooks/useRecouvrementForm'
import type { RECOUVREMENT_T } from '@/types'
import type { RecouvrementFormValues } from '@/schema/recouvrements/recouvrementSchema'

interface Props {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialData?: RECOUVREMENT_T | null
  /** Pré-remplissage (ex. depuis la carte Portefeuille : micro_projet_id, plan_remboursement_id déjà connus). */
  prefill?: Partial<RecouvrementFormValues>
}

const TYPE_ACTION_LABELS: Record<RecouvrementFormValues['type_action'], string> = {
  APPEL: 'Appel téléphonique',
  COURRIER: 'Courrier',
  DECHARGE: 'Décharge',
  MISE_EN_DEMEURE: 'Mise en demeure',
  CONTENTIEUX: 'Contentieux',
}

export function RecouvrementFormModal({ children, open: controlledOpen, onOpenChange, initialData, prefill }: Props) {
  const { form, onSubmit, isPending, isEdit, open, setOpen } = useRecouvrementForm(
    initialData ?? null,
    controlledOpen,
    onOpenChange,
    prefill,
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{isEdit ? "Modifier l'" : 'Nouvelle '}action de recouvrement</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="micro_projet_id" render={({ field: { onChange, ...field } }) => (
                <FormItem><FormLabel>ID Micro-projet</FormLabel><FormControl><Input type="number" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="plan_remboursement_id" render={({ field: { onChange, ...field } }) => (
                <FormItem><FormLabel>ID Plan de remboursement</FormLabel><FormControl><Input type="number" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="agent_id" render={({ field: { onChange, ...field } }) => (
                <FormItem><FormLabel>ID Agent</FormLabel><FormControl><Input type="number" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="montant_recouvre" render={({ field: { onChange, ...field } }) => (
                <FormItem><FormLabel>Montant recouvré</FormLabel><FormControl><Input type="number" step="0.01" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="date_recouvrement" render={({ field }) => (
                <FormItem><FormLabel>Date de l'action</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="justificatif_path" render={({ field }) => (
                <FormItem><FormLabel>Justificatif (chemin)</FormLabel><FormControl><Input placeholder="Optionnel" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="type_action" render={({ field }) => (
              <FormItem>
                <FormLabel>Type d'action</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    {Object.entries(TYPE_ACTION_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="observations" render={({ field }) => (
              <FormItem><FormLabel>Observations</FormLabel><FormControl><Textarea placeholder="Optionnel" {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <DialogFooter className="mt-4">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
              <Button type="submit" className="bg-[#E7722B] text-white hover:bg-[#d6621a]" disabled={isPending}>
                {isPending ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
