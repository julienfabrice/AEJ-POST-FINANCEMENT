import { guichetServices } from '@/services/guichets.services'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { guichetSchema, type GuichetFormValues } from '@/schema/guichets/guichetSchema'

export function useGuichetForm(initialData: any | null, controlledOpen?: boolean, onOpenChange?: (open: boolean) => void) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const setOpen = (newOpen: boolean) => {
    if (!isControlled) setInternalOpen(newOpen)
    if (onOpenChange) onOpenChange(newOpen)
  }

  const { mutate: createMutation, isPending: isCreating } = guichetServices.useCreate()
  const { mutate: updateMutation, isPending: isUpdating } = guichetServices.useUpdate()

  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<GuichetFormValues>({
    resolver: zodResolver(guichetSchema),
    defaultValues: { code: '', libelle: '', description: '', couleur: '#E7722B', montant_min: 0, montant_max: 0, is_active: true },
  })

  useEffect(() => {
    if (open) {
      if (initialData) form.reset({
        code: initialData.code || '',
        libelle: initialData.libelle || '',
        description: initialData.description || '',
        couleur: initialData.couleur || '#E7722B',
        montant_min: initialData.montant_min ?? 0,
        montant_max: initialData.montant_max ?? 0,
        is_active: initialData.is_active ?? true,
      })
      else form.reset({ code: '', libelle: '', description: '', couleur: '#E7722B', montant_min: 0, montant_max: 0, is_active: true })
    }
  }, [open, initialData, form])

  const onSubmit = (values: GuichetFormValues) => {
    if (isEdit && initialData) {
      updateMutation({ id: initialData.id, data: values }, { onSuccess: () => setOpen(false) })
    } else {
      createMutation(values, { onSuccess: () => setOpen(false) })
    }
  }

  return { form, onSubmit, isPending, isEdit, open, setOpen }
}
