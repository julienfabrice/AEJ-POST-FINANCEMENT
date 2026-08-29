import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { budgetSchema, type BudgetFormValues } from '@/schema/budgets/budgetSchema'
import { budgetServices } from '@/services/budgets.services'
import type { BUDGET_T } from '@/types'

interface Props {
  budget: BUDGET_T | null
  onClose: () => void
}

export function BudgetEditModal({ budget, onClose }: Props) {
  const { mutate: updateBudget, isPending } = budgetServices.useUpdate()

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      micro_projet_id: 0,
      intitule: '',
      montant_accorde: 0,
      date_accord: '',
      source: '',
      statut: 'EN_ATTENTE',
      devise: 'FCFA',
      deblocage: false,
      signature_convention: 'NON_SIGNEE',
      reception_acte_credit: 'NON',
      observations: '',
    },
  })

  useEffect(() => {
    if (budget) {
      form.reset({
        micro_projet_id: budget.micro_projet_id,
        intitule: budget.intitule,
        montant_accorde: Number(budget.montant_accorde),
        date_accord: budget.date_accord ?? '',
        source: budget.source ?? '',
        statut: budget.statut,
        devise: budget.devise,
        deblocage: budget.deblocage,
        date_deblocage: budget.date_deblocage ?? '',
        signature_convention: budget.signature_convention,
        date_signature: budget.date_signature ?? '',
        reception_acte_credit: budget.reception_acte_credit,
        date_reception: budget.date_reception ?? '',
        observations: budget.observations ?? '',
      })
    }
  }, [budget, form])

  const onSubmit = (values: BudgetFormValues) => {
    if (!budget) return
    updateBudget({ id: budget.id, data: values }, { onSuccess: onClose })
  }

  return (
    <Dialog open={!!budget} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader><DialogTitle>Modifier le budget</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="montant_accorde" render={({ field: { onChange, ...field } }) => (
                <FormItem><FormLabel>Montant accordé</FormLabel><FormControl><Input type="number" step="0.01" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="source" render={({ field }) => (
                <FormItem><FormLabel>Source</FormLabel><FormControl><Input placeholder="Ex. AFD, BAD..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="date_accord" render={({ field }) => (
                <FormItem><FormLabel>Date d'accord</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="statut" render={({ field }) => (
                <FormItem>
                  <FormLabel>Approbation</FormLabel>
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
              <FormField control={form.control} name="signature_convention" render={({ field }) => (
                <FormItem>
                  <FormLabel>Convention</FormLabel>
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
              <FormField control={form.control} name="deblocage" render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3 col-span-2">
                  <FormLabel className="mb-0">Déblocage</FormLabel>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="observations" render={({ field }) => (
              <FormItem><FormLabel>Observations</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <DialogFooter className="mt-4">
              <Button type="button" variant="ghost" onClick={onClose}>Annuler</Button>
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
