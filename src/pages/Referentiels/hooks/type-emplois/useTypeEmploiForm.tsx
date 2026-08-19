import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateTypeEmploi } from '@/api/type-emplois/useCreateTypeEmploi'
import { useUpdateTypeEmploi } from '@/api/type-emplois/useUpdateTypeEmploi'
import { TypeEmploiSchema, type TypeEmploiFormValues } from '@/schema/type-emplois/TypeEmploiSchema'

export function useTypeEmploiForm(initialData: any | null, controlledOpen?: boolean, onOpenChange?: (open: boolean) => void) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  
  const setOpen = (newOpen: boolean) => {
    if (!isControlled) setInternalOpen(newOpen)
    if (onOpenChange) onOpenChange(newOpen)
  }

  const { mutate: createMutation, isPending: isCreating } = useCreateTypeEmploi()
  const { mutate: updateMutation, isPending: isUpdating } = useUpdateTypeEmploi()
  
  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<TypeEmploiFormValues>({
    resolver: zodResolver(TypeEmploiSchema),
    defaultValues: { code: '', libelle: '' },
  })

  useEffect(() => {
    if (open) {
      if (initialData) form.reset({ code: initialData.code || '', libelle: initialData.libelle || '' })
      else form.reset({ code: '', libelle: '' })
    }
  }, [open, initialData, form])

  const onSubmit = (values: TypeEmploiFormValues) => {
    if (isEdit && initialData) {
      updateMutation({ id: initialData.id, data: values }, { onSuccess: () => setOpen(false) })
    } else {
      createMutation(values, { onSuccess: () => setOpen(false) })
    }
  }

  return { form, onSubmit, isPending, isEdit, open, setOpen }
}
