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
import {
  compteFinancementSchema,
  type CompteFinancementFormValues,
} from '@/schema/compte-financements/compteFinancementSchema'
import { compteFinancementServices } from '@/services/compteFinancements.services'
import type { COMPTE_FINANCEMENT_T } from '@/types'

interface Props {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialData?: COMPTE_FINANCEMENT_T | null
}

const DEFAULT_VALUES: CompteFinancementFormValues = {
  organisme_id: 0,
  micro_projet_id: 0,
  etat_ouverture: 'NON_OUVERT',
  localite_ouverture: '',
  date_ouverture: '',
  avis_partenaire: 'EN_ATTENTE',
  observations: '',
}

export function CompteFinancementFormModal({ children, open: controlledOpen, onOpenChange, initialData }: Props) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const setOpen = (newOpen: boolean) => {
    if (!isControlled) setInternalOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  const { mutate: createCompte, isPending: isCreating } = compteFinancementServices.useCreate()
  const { mutate: updateCompte, isPending: isUpdating } = compteFinancementServices.useUpdate()
  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<CompteFinancementFormValues>({
    resolver: zodResolver(compteFinancementSchema),
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          organisme_id: initialData.organisme_id,
          micro_projet_id: initialData.micro_projet_id,
          etat_ouverture: initialData.etat_ouverture,
          localite_ouverture: initialData.localite_ouverture ?? '',
          date_ouverture: initialData.date_ouverture ?? '',
          avis_partenaire: initialData.avis_partenaire,
          observations: initialData.observations ?? '',
        })
      } else {
        form.reset(DEFAULT_VALUES)
      }
    }
  }, [open, initialData, form])

  const onSubmit = (values: CompteFinancementFormValues) => {
    if (isEdit && initialData) {
      updateCompte({ id: initialData.id, data: values }, { onSuccess: () => setOpen(false) })
    } else {
      createCompte(values, { onSuccess: () => setOpen(false) })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader><DialogTitle>{isEdit ? 'Modifier le' : 'Nouveau'} compte de financement</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="micro_projet_id" render={({ field: { onChange, ...field } }) => (
                <FormItem><FormLabel>ID Micro-projet</FormLabel><FormControl><Input type="number" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="organisme_id" render={({ field: { onChange, ...field } }) => (
                <FormItem><FormLabel>ID Partenaire (organisme)</FormLabel><FormControl><Input type="number" onChange={(e) => onChange(e.target.valueAsNumber || 0)} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="etat_ouverture" render={({ field }) => (
                <FormItem>
                  <FormLabel>État d'ouverture</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="NON_OUVERT">Non ouvert</SelectItem>
                      <SelectItem value="OUVERT">Ouvert</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="avis_partenaire" render={({ field }) => (
                <FormItem>
                  <FormLabel>Avis du partenaire</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                      <SelectItem value="ACCORDE">Accordé</SelectItem>
                      <SelectItem value="REFUSE">Refusé</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="localite_ouverture" render={({ field }) => (
                <FormItem><FormLabel>Localité d'ouverture</FormLabel><FormControl><Input placeholder="Ex. Dakar" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="date_ouverture" render={({ field }) => (
                <FormItem><FormLabel>Date d'ouverture</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
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
