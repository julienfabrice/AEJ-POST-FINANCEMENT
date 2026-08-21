import { secteurServices } from '@/services/secteurs.services'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SecteurSchema, type SecteurFormValues } from '@/schema/secteurs/SecteurSchema'

export function useSecteurForm(initialData: any | null, controlledOpen?: boolean, onOpenChange?: (open: boolean) => void) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  
  const setOpen = (newOpen: boolean) => {
    if (!isControlled) setInternalOpen(newOpen)
    if (onOpenChange) onOpenChange(newOpen)
  }

  const { mutate: createMutation, isPending: isCreating } = secteurServices.useCreate()
  const { mutate: updateMutation, isPending: isUpdating } = secteurServices.useUpdate()
  
  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<SecteurFormValues>({
    resolver: zodResolver(SecteurSchema),
    defaultValues: { libelle: '' },
  })

  useEffect(() => {
    if (open) {
      if (initialData) form.reset({ libelle: initialData.libelle || '' })
      else form.reset({ libelle: '' })
    }
  }, [open, initialData, form])

  const onSubmit = (values: SecteurFormValues) => {
    if (isEdit && initialData) {
      updateMutation({ id: initialData.id, data: values }, { onSuccess: () => setOpen(false) })
    } else {
      createMutation(values, { onSuccess: () => setOpen(false) })
    }
  }

  return { form, onSubmit, isPending, isEdit, open, setOpen }
}
