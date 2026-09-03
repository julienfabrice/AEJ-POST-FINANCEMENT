import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
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
import { transactionSchema, type TransactionFormValues } from '@/schema/transactions/transactionSchema'
import { transactionServices } from '@/services/transactions.services'
import type { TRANSACTION_T } from '@/types'

interface Props {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialData?: TRANSACTION_T | null
}

const DEFAULT_VALUES: TransactionFormValues = {
  micro_projet_id: 0,
  categorie_id: undefined,
  libelle: '',
  type: 'DEPENSE',
  montant: 0,
  statut: 'VALIDE',
  mode_paiement: '',
  reference: '',
  observations: '',
  date: '',
}

export function TransactionFormModal({ children, open: controlledOpen, onOpenChange, initialData }: Props) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const setOpen = (newOpen: boolean) => {
    if (!isControlled) setInternalOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  const { mutate: createTransaction, isPending: isCreating } = transactionServices.useCreate()
  const { mutate: updateTransaction, isPending: isUpdating } = transactionServices.useUpdate()
  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          micro_projet_id: initialData.micro_projet_id,
          categorie_id: initialData.categorie_id ?? undefined,
          libelle: initialData.libelle,
          type: initialData.type,
          montant: Number(initialData.montant),
          statut: initialData.statut,
          mode_paiement: initialData.mode_paiement ?? '',
          reference: initialData.reference ?? '',
          observations: initialData.observations ?? '',
          date: initialData.date ?? '',
        })
      } else {
        form.reset(DEFAULT_VALUES)
      }
    }
  }, [open, initialData, form])

  const onSubmit = (values: TransactionFormValues) => {
    if (isEdit && initialData) {
      updateTransaction({ id: initialData.id, data: values }, { onSuccess: () => setOpen(false) })
    } else {
      createTransaction(values, { onSuccess: () => setOpen(false) })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader><DialogTitle>{isEdit ? 'Modifier la' : 'Nouvelle'} dépense</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="micro_projet_id" render={({ field: { onChange, ...field } }) => (
                <FormItem><FormLabel>ID Micro-projet</FormLabel><FormControl><Input type="number" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="categorie_id" render={({ field: { onChange, ...field } }) => (
                <FormItem><FormLabel>ID Catégorie</FormLabel><FormControl><Input type="number" onChange={(e) => onChange(e.target.valueAsNumber || undefined)} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="libelle" render={({ field }) => (
                <FormItem className="col-span-2"><FormLabel>Intitulé</FormLabel><FormControl><Input placeholder="Ex. Frais de transport" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="montant" render={({ field: { onChange, ...field } }) => (
                <FormItem><FormLabel>Montant</FormLabel><FormControl><Input type="number" step="0.01" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="date" render={({ field }) => (
                <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="mode_paiement" render={({ field }) => (
                <FormItem><FormLabel>Mode de paiement</FormLabel><FormControl><Input placeholder="Ex. BANQUE" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="reference" render={({ field }) => (
                <FormItem><FormLabel>Référence</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="statut" render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Statut</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="BROUILLON">Brouillon</SelectItem>
                      <SelectItem value="SOUMIS">Soumis</SelectItem>
                      <SelectItem value="VALIDE">Validé</SelectItem>
                      <SelectItem value="REJETE">Rejeté</SelectItem>
                      <SelectItem value="ANNULE">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="observations" render={({ field }) => (
              <FormItem><FormLabel>Observations</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
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
