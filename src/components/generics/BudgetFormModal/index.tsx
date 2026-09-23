import { useState } from 'react'
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
import { MicroProjetCombobox } from '@/components/generics/MicroProjetCombobox'
import type { BUDGET_T } from '@/types'
import { useBudgetForm } from './useBudgetForm'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: BUDGET_T | null
  lockedMicroProjetId?: number
}

export function BudgetFormModal({ open, onOpenChange, initialData, lockedMicroProjetId }: Props) {
  const [portal, setPortal] = useState<HTMLElement | null>(null)
  const { form, onSubmit, isPending, isEdit } = useBudgetForm(open, onOpenChange, initialData, lockedMicroProjetId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent ref={setPortal} className="sm:max-w-[480px]">
        <DialogHeader><DialogTitle>{isEdit ? 'Modifier le' : 'Créer un'} budget</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="micro_projet_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Micro-projet</FormLabel>
                    <FormControl>
                      <MicroProjetCombobox
                        value={field.value}
                        onChange={field.onChange}
                        projetInitial={initialData?.micro_projet ?? null}
                        disabled={!!lockedMicroProjetId}
                        container={portal}
                        placeholder="Rechercher..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="intitule" render={({ field }) => (
                <FormItem><FormLabel>Intitulé du budget</FormLabel><FormControl><Input placeholder="Ex: Matériel agricole" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
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
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button>
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
