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
import { useRemboursementForm } from '../hooks/useRemboursementForm'
import type { REMBOURSEMENT_T } from '@/types'

interface Props {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialData?: REMBOURSEMENT_T | null
}

export function RemboursementFormModal({ children, open: controlledOpen, onOpenChange, initialData }: Props) {
  const { form, onSubmit, isPending, isEdit, open, setOpen } = useRemboursementForm(
    initialData ?? null,
    controlledOpen,
    onOpenChange,
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{isEdit ? 'Modifier le' : 'Nouveau'} remboursement</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="promoteur_id" render={({ field: { onChange, ...field } }) => (
                <FormItem><FormLabel>ID Promoteur</FormLabel><FormControl><Input type="number" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="budget_id" render={({ field: { onChange, ...field } }) => (
                <FormItem><FormLabel>ID Budget</FormLabel><FormControl><Input type="number" onChange={(e) => onChange(e.target.valueAsNumber || undefined)} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="montant_echu" render={({ field: { onChange, ...field } }) => (
                <FormItem><FormLabel>Montant échu</FormLabel><FormControl><Input type="number" step="0.01" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="montant_paye" render={({ field: { onChange, ...field } }) => (
                <FormItem><FormLabel>Montant payé</FormLabel><FormControl><Input type="number" step="0.01" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="montant_impaye" render={({ field: { onChange, ...field } }) => (
                <FormItem><FormLabel>Montant impayé</FormLabel><FormControl><Input type="number" step="0.01" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="penalites" render={({ field: { onChange, ...field } }) => (
                <FormItem><FormLabel>Pénalités</FormLabel><FormControl><Input type="number" step="0.01" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="date_paiement" render={({ field }) => (
                <FormItem><FormLabel>Date de paiement</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="statut" render={({ field }) => (
              <FormItem>
                <FormLabel>Statut</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                    <SelectItem value="PAYE">Payé</SelectItem>
                    <SelectItem value="PARTIEL">Partiel</SelectItem>
                    <SelectItem value="NON_PAYE">Non payé</SelectItem>
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
