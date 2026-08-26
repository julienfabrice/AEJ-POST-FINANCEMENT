import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MicroProjetSelect } from '@/components/generics/MicroProjetSelect'
import { useBudgetForm } from '../hooks/useBudgetForm'
import type { BUDGET_T } from '@/types'

interface Props {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialData?: BUDGET_T | null
}

export function BudgetFormModal({ children, open: controlledOpen, onOpenChange, initialData }: Props) {
  const { form, onSubmit, isPending, isEdit, open, setOpen } = useBudgetForm(
    initialData ?? null,
    controlledOpen,
    onOpenChange,
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{isEdit ? 'Modifier le' : 'Nouveau'} budget</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-2">
            <div className="grid grid-cols-1 gap-4">
              <FormField control={form.control} name="micro_projet_id" render={({ field: { onChange, value } }) => (
                <FormItem>
                  <FormLabel>Micro-projet</FormLabel>
                  <FormControl>
                    <MicroProjetSelect value={value || undefined} onValueChange={(id) => onChange(id ?? 0)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="intitule" render={({ field }) => (
                <FormItem><FormLabel>Intitulé</FormLabel><FormControl><Input placeholder="Ex. Budget AGR 2026" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <Separator />
            <p className="text-sm font-bold text-[#131C29]">Accord & devise</p>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="montant_accorde" render={({ field: { onChange, ...field } }) => (
                <FormItem><FormLabel>Montant accordé</FormLabel><FormControl><Input type="number" step="0.01" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="devise" render={({ field }) => (
                <FormItem><FormLabel>Devise</FormLabel><FormControl><Input placeholder="FCFA" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="source" render={({ field }) => (
                <FormItem><FormLabel>Source</FormLabel><FormControl><Input placeholder="Ex. AFD, BAD..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="date_accord" render={({ field }) => (
                <FormItem><FormLabel>Date d'accord</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <Separator />
            <p className="text-sm font-bold text-[#131C29]">Convention & déblocage</p>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="signature_convention" render={({ field }) => (
                <FormItem>
                  <FormLabel>Signature convention</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="SIGNEE">Signée</SelectItem>
                      <SelectItem value="NON_SIGNEE">Non signée</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="date_signature" render={({ field }) => (
                <FormItem><FormLabel>Date de signature</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="deblocage" render={({ field }) => (
                <FormItem>
                  <FormLabel>Déblocage</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="OUI">Oui</SelectItem>
                      <SelectItem value="NON">Non</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="date_deblocage" render={({ field }) => (
                <FormItem><FormLabel>Date de déblocage</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="reception_acte_credit" render={({ field }) => (
                <FormItem>
                  <FormLabel>Réception acte de crédit</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="OUI">Oui</SelectItem>
                      <SelectItem value="NON">Non</SelectItem>
                      <SelectItem value="PARTIEL">Partiel</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="date_reception" render={({ field }) => (
                <FormItem><FormLabel>Date de réception</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <Separator />
            <p className="text-sm font-bold text-[#131C29]">Validation</p>
            <FormField control={form.control} name="statut" render={({ field }) => (
              <FormItem>
                <FormLabel>Statut</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                    <SelectItem value="APPROUVE">Approuvé</SelectItem>
                    <SelectItem value="NON_APPROUVE">Non approuvé</SelectItem>
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
