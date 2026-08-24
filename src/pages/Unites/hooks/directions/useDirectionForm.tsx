import { directionServices } from '@/services/directions.services'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { directionSchema, type DirectionFormValues } from '@/schema/directions/directionSchema'

export function useDirectionForm(initialData: any | null, controlledOpen?: boolean, onOpenChange?: (open: boolean) => void) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const setOpen = (newOpen: boolean) => {
    if (!isControlled) setInternalOpen(newOpen)
    if (onOpenChange) onOpenChange(newOpen)
  }

  const { mutate: createMutation, isPending: isCreating } = directionServices.useCreate()
  const { mutate: updateMutation, isPending: isUpdating } = directionServices.useUpdate()

  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<DirectionFormValues>({
    resolver: zodResolver(directionSchema),
    defaultValues: { code: '', nom: '', description: '' },
  })

  useEffect(() => {
    if (open) {
      if (initialData) form.reset({ code: initialData.code || '', nom: initialData.nom || '', description: initialData.description || '' })
      else form.reset({ code: '', nom: '', description: '' })
    }
  }, [open, initialData, form])

  const onSubmit = (values: DirectionFormValues) => {
    if (isEdit && initialData) {
      updateMutation({ id: initialData.id, data: values }, { onSuccess: () => setOpen(false) })
    } else {
      createMutation(values, { onSuccess: () => setOpen(false) })
    }
  }

  return { form, onSubmit, isPending, isEdit, open, setOpen }
}
