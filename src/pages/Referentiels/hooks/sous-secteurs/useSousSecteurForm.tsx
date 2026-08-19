import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateSousSecteur } from '@/api/sous-secteurs/useCreateSousSecteur'
import { useUpdateSousSecteur } from '@/api/sous-secteurs/useUpdateSousSecteur'
import { SousSecteurSchema, type SousSecteurFormValues } from '@/schema/sous-secteurs/SousSecteurSchema'

export function useSousSecteurForm(initialData: any | null, controlledOpen?: boolean, onOpenChange?: (open: boolean) => void) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  
  const setOpen = (newOpen: boolean) => {
    if (!isControlled) setInternalOpen(newOpen)
    if (onOpenChange) onOpenChange(newOpen)
  }

  const { mutate: createMutation, isPending: isCreating } = useCreateSousSecteur()
  const { mutate: updateMutation, isPending: isUpdating } = useUpdateSousSecteur()
  
  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<SousSecteurFormValues>({
    resolver: zodResolver(SousSecteurSchema),
    defaultValues: { libelle: '' },
  })

  useEffect(() => {
    if (open) {
      if (initialData) form.reset({ libelle: initialData.libelle || '' })
      else form.reset({ libelle: '' })
    }
  }, [open, initialData, form])

  const onSubmit = (values: SousSecteurFormValues) => {
    if (isEdit && initialData) {
      updateMutation({ id: initialData.id, data: values }, { onSuccess: () => setOpen(false) })
    } else {
      createMutation(values, { onSuccess: () => setOpen(false) })
    }
  }

  return { form, onSubmit, isPending, isEdit, open, setOpen }
}
