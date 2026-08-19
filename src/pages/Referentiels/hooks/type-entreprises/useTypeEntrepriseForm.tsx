import { typeEntrepriseServices } from '@/services/typeEntreprises.services'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { typeEntrepriseSchema, type TypeEntrepriseFormValues } from '@/schema/type-entreprises/typeEntrepriseSchema'

export function useTypeEntrepriseForm(initialData: any | null, controlledOpen?: boolean, onOpenChange?: (open: boolean) => void) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  
  const setOpen = (newOpen: boolean) => {
    if (!isControlled) setInternalOpen(newOpen)
    if (onOpenChange) onOpenChange(newOpen)
  }

  const { mutate: createMutation, isPending: isCreating } = typeEntrepriseServices.useCreate()
  const { mutate: updateMutation, isPending: isUpdating } = typeEntrepriseServices.useUpdate()
  
  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<TypeEntrepriseFormValues>({
    resolver: zodResolver(typeEntrepriseSchema),
    defaultValues: { code: '', libelle: '' },
  })

  useEffect(() => {
    if (open) {
      if (initialData) form.reset({ code: initialData.code || '', libelle: initialData.libelle || '' })
      else form.reset({ code: '', libelle: '' })
    }
  }, [open, initialData, form])

  const onSubmit = (values: TypeEntrepriseFormValues) => {
    if (isEdit && initialData) {
      updateMutation({ id: initialData.id, data: values }, { onSuccess: () => setOpen(false) })
    } else {
      createMutation(values, { onSuccess: () => setOpen(false) })
    }
  }

  return { form, onSubmit, isPending, isEdit, open, setOpen }
}
