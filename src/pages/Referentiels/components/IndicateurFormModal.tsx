import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useCreateIndicateur } from '@/api/indicateurs/useCreateIndicateur'
import { useUpdateIndicateur } from '@/api/indicateurs/useUpdateIndicateur'
import { indicateurSchema, type IndicateurFormValues } from '@/schema/indicateurs/indicateurSchema'

interface Props {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialData?: any | null
}

export function IndicateurFormModal({ children, open: controlledOpen, onOpenChange, initialData }: Props) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  
  const setOpen = (newOpen: boolean) => {
    if (!isControlled) setInternalOpen(newOpen)
    if (onOpenChange) onOpenChange(newOpen)
  }

  const { mutate: createMutation, isPending: isCreating } = useCreateIndicateur()
  const { mutate: updateMutation, isPending: isUpdating } = useUpdateIndicateur()
  
  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<IndicateurFormValues>({
    resolver: zodResolver(indicateurSchema) as any,
    defaultValues: { nom: '', description: '', type_valeur: '', unite: '', statut: true },
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          nom: initialData.nom || '',
          description: initialData.description || '',
          type_valeur: initialData.type_valeur || '',
          unite: initialData.unite || '',
          statut: initialData.statut !== false
        })
      }
      else form.reset({ nom: '', description: '', type_valeur: '', unite: '', statut: true })
    }
  }, [open, initialData, form])

  const onSubmit = (values: IndicateurFormValues) => {
    if (isEdit && initialData) {
      updateMutation({ id: initialData.id, data: values }, { onSuccess: () => setOpen(false) })
    } else {
      createMutation(values, { onSuccess: () => setOpen(false) })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader><DialogTitle>{isEdit ? "Modifier l'indicateur" : "Nouvel indicateur"}</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="grid gap-4 py-4">
            
            <FormField control={form.control as any} name="nom" render={({ field }) => (
              <FormItem><FormLabel>Nom de l'indicateur</FormLabel><FormControl><Input placeholder="Ex. Taux d'insertion" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            
            <FormField control={form.control as any} name="description" render={({ field }) => (
              <FormItem><FormLabel>Description (optionnel)</FormLabel><FormControl><Textarea placeholder="Brève description..." {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control as any} name="type_valeur" render={({ field }) => (
                <FormItem><FormLabel>Type de valeur</FormLabel><FormControl><Input placeholder="Ex. pourcentage, monétaire..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control as any} name="unite" render={({ field }) => (
                <FormItem><FormLabel>Unité</FormLabel><FormControl><Input placeholder="Ex. %, FCFA" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <FormField control={form.control as any} name="statut" render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 mt-2 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Indicateur actif</FormLabel>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
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
