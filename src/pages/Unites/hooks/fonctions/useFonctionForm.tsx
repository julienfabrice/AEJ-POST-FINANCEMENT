import { fonctionServices } from '@/services/fonctions.services'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { fonctionSchema, type FonctionFormValues } from '@/schema/fonctions/fonctionSchema'

export function useFonctionForm(initialData: any | null, controlledOpen?: boolean, onOpenChange?: (open: boolean) => void) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const setOpen = (newOpen: boolean) => {
    if (!isControlled) setInternalOpen(newOpen)
    if (onOpenChange) onOpenChange(newOpen)
  }

  const { mutate: createMutation, isPending: isCreating } = fonctionServices.useCreate()
  const { mutate: updateMutation, isPending: isUpdating } = fonctionServices.useUpdate()

  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<FonctionFormValues>({
    resolver: zodResolver(fonctionSchema),
    defaultValues: { code: '', nom: '', description: '', service_id: 0 },
  })

  useEffect(() => {
    if (open) {
      if (initialData) form.reset({ code: initialData.code || '', nom: initialData.nom || '', description: initialData.description || '', service_id: initialData.service_id })
      else form.reset({ code: '', nom: '', description: '', service_id: 0 })
    }
  }, [open, initialData, form])

  const onSubmit = (values: FonctionFormValues) => {
    if (isEdit && initialData) {
      updateMutation({ id: initialData.id, data: values }, { onSuccess: () => setOpen(false) })
    } else {
      createMutation(values, { onSuccess: () => setOpen(false) })
    }
  }

  return { form, onSubmit, isPending, isEdit, open, setOpen }
}
