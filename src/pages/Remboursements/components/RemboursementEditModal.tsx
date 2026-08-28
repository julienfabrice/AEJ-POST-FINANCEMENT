import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { remboursementSchema, type RemboursementFormValues } from '@/schema/remboursements/remboursementSchema'
import { remboursementServices } from '@/services/remboursements.services'
import type { REMBOURSEMENT_T } from '@/types'

interface Props {
  remboursement: REMBOURSEMENT_T | null
  onClose: () => void
}

export function RemboursementEditModal({ remboursement, onClose }: Props) {
  const { mutate: updateRemboursement, isPending } = remboursementServices.useUpdate()

  const form = useForm<RemboursementFormValues>({
    resolver: zodResolver(remboursementSchema),
    defaultValues: {
      promoteur_id: 0,
      montant_echu: 0,
      montant_paye: 0,
      montant_impaye: 0,
      penalites: 0,
      date_paiement: '',
      observations: '',
      statut: 'EN_ATTENTE',
    },
  })

  useEffect(() => {
    if (remboursement) {
      form.reset({
        promoteur_id: remboursement.promoteur_id,
        budget_id: remboursement.budget_id ?? undefined,
        montant_echu: remboursement.montant_echu,
        montant_paye: remboursement.montant_paye,
        montant_impaye: remboursement.montant_impaye,
        penalites: remboursement.penalites,
        date_paiement: remboursement.date_paiement ?? '',
        observations: remboursement.observations ?? '',
        statut: remboursement.statut,
      })
    }
  }, [remboursement, form])

  const onSubmit = (values: RemboursementFormValues) => {
    if (!remboursement) return
    updateRemboursement({ id: remboursement.id, data: values }, { onSuccess: onClose })
  }

  return (
    <Dialog open={!!remboursement} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader><DialogTitle>Modifier le remboursement</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
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
              <FormField control={form.control} name="statut" render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                      <SelectItem value="PAYE">Payé</SelectItem>
                      <SelectItem value="PARTIEL">Partiel</SelectItem>
                      <SelectItem value="NON_PAYE">Impayé</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="observations" render={({ field }) => (
              <FormItem><FormLabel>Observation</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
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
