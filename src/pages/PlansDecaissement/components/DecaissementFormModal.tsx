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
import { useDecaissementForm } from '../hooks/useDecaissementForm'
import type { DECAISSEMENT_T } from '@/types'

interface Props {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialData?: DECAISSEMENT_T | null
}

export function DecaissementFormModal({ children, open: controlledOpen, onOpenChange, initialData }: Props) {
  const { form, onSubmit, isPending, isEdit, open, setOpen } = useDecaissementForm(
    initialData ?? null,
    controlledOpen,
    onOpenChange,
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{isEdit ? 'Modifier le' : 'Nouveau'} décaissement</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="plan_decaissement_id" render={({ field: { onChange, ...field } }) => (
                <FormItem><FormLabel>ID Plan de décaissement</FormLabel><FormControl><Input type="number" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="ligne_decaissement_id" render={({ field: { onChange, ...field } }) => (
                <FormItem><FormLabel>ID Ligne (optionnel)</FormLabel><FormControl><Input type="number" onChange={(e) => onChange(e.target.valueAsNumber || undefined)} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="agence_id" render={({ field: { onChange, ...field } }) => (
                <FormItem><FormLabel>ID Agence</FormLabel><FormControl><Input type="number" onChange={(e) => onChange(e.target.valueAsNumber || undefined)} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="montant_decaisse" render={({ field: { onChange, ...field } }) => (
                <FormItem><FormLabel>Montant décaissé</FormLabel><FormControl><Input type="number" step="0.01" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="date_decaissement" render={({ field }) => (
                <FormItem><FormLabel>Date de décaissement</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="reference_banque" render={({ field }) => (
                <FormItem><FormLabel>Référence bancaire</FormLabel><FormControl><Input placeholder="Ex. REF-001" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="statut" render={({ field }) => (
              <FormItem>
                <FormLabel>Statut</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                    <SelectItem value="VALIDE">Validé</SelectItem>
                    <SelectItem value="NON_VALIDE">Non validé</SelectItem>
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
