import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateSituationMatrimoniale } from '@/api/situations-matrimoniales/useCreateSituationMatrimoniale'
import { useUpdateSituationMatrimoniale } from '@/api/situations-matrimoniales/useUpdateSituationMatrimoniale'
import { SituationMatrimonialeSchema, type SituationMatrimonialeFormValues } from '@/schema/situations-matrimoniales/SituationMatrimonialeSchema'

interface Props {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialData?: any | null
}

export function SituationMatrimonialeFormModal({ children, open: controlledOpen, onOpenChange, initialData }: Props) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  
  const setOpen = (newOpen: boolean) => {
    if (!isControlled) setInternalOpen(newOpen)
    if (onOpenChange) onOpenChange(newOpen)
  }

  const { mutate: createMutation, isPending: isCreating } = useCreateSituationMatrimoniale()
  const { mutate: updateMutation, isPending: isUpdating } = useUpdateSituationMatrimoniale()
  
  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<SituationMatrimonialeFormValues>({
    resolver: zodResolver(SituationMatrimonialeSchema),
    defaultValues: { libelle: '' },
  })

  useEffect(() => {
    if (open) {
      if (initialData) form.reset({ libelle: initialData.libelle || '' })
      else form.reset({ libelle: '' })
    }
  }, [open, initialData, form])

  const onSubmit = (values: SituationMatrimonialeFormValues) => {
    if (isEdit && initialData) {
      updateMutation({ id: initialData.id, data: values }, { onSuccess: () => setOpen(false) })
    } else {
      createMutation(values, { onSuccess: () => setOpen(false) })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader><DialogTitle>{isEdit ? "Modifier" : "Nouveau"} Situation matrimoniale</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField control={form.control} name="libelle" render={({ field }) => (
              <FormItem><FormLabel>Libellé</FormLabel><FormControl><Input placeholder="Ex. Situation matrimoniale" {...field} /></FormControl><FormMessage /></FormItem>
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
