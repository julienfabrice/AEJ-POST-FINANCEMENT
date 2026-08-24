import { serviceOrgServices } from '@/services/services-org.services'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { serviceOrgSchema, type ServiceOrgFormValues } from '@/schema/services-org/serviceOrgSchema'

export function useServiceOrgForm(initialData: any | null, controlledOpen?: boolean, onOpenChange?: (open: boolean) => void) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const setOpen = (newOpen: boolean) => {
    if (!isControlled) setInternalOpen(newOpen)
    if (onOpenChange) onOpenChange(newOpen)
  }

  const { mutate: createMutation, isPending: isCreating } = serviceOrgServices.useCreate()
  const { mutate: updateMutation, isPending: isUpdating } = serviceOrgServices.useUpdate()

  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<ServiceOrgFormValues>({
    resolver: zodResolver(serviceOrgSchema),
    defaultValues: { code: '', nom: '', description: '', direction_id: 0 },
  })

  useEffect(() => {
    if (open) {
      if (initialData) form.reset({ code: initialData.code || '', nom: initialData.nom || '', description: initialData.description || '', direction_id: initialData.direction_id })
      else form.reset({ code: '', nom: '', description: '', direction_id: 0 })
    }
  }, [open, initialData, form])

  const onSubmit = (values: ServiceOrgFormValues) => {
    if (isEdit && initialData) {
      updateMutation({ id: initialData.id, data: values }, { onSuccess: () => setOpen(false) })
    } else {
      createMutation(values, { onSuccess: () => setOpen(false) })
    }
  }

  return { form, onSubmit, isPending, isEdit, open, setOpen }
}
