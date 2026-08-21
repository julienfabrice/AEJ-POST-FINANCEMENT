import { organismeServices } from '@/services/organismes.services'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { organismeSchema, type OrganismeFormValues } from '@/schema/organismes/organismeSchema'

export function useOrganismeForm(initialData: any | null, controlledOpen?: boolean, onOpenChange?: (open: boolean) => void) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const setOpen = (newOpen: boolean) => {
    if (!isControlled) setInternalOpen(newOpen)
    if (onOpenChange) onOpenChange(newOpen)
  }

  const { mutate: createMutation, isPending: isCreating } = organismeServices.useCreate()
  const { mutate: updateMutation, isPending: isUpdating } = organismeServices.useUpdate()

  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<OrganismeFormValues>({
    resolver: zodResolver(organismeSchema),
    defaultValues: { nom: '', sigle: '', type: 0, site_web: '', description: '', adresse: '', telephone: '', email: '' },
  })

  useEffect(() => {
    if (open) {
      if (initialData) form.reset({
        nom: initialData.nom || '',
        sigle: initialData.sigle || '',
        type: initialData.type,
        site_web: initialData.site_web || '',
        description: initialData.description || '',
        adresse: initialData.adresse || '',
        telephone: initialData.telephone || '',
        email: initialData.email || '',
      })
      else form.reset({ nom: '', sigle: '', type: 0, site_web: '', description: '', adresse: '', telephone: '', email: '' })
    }
  }, [open, initialData, form])

  const onSubmit = (values: OrganismeFormValues) => {
    if (isEdit && initialData) {
      updateMutation({ id: initialData.id, data: values }, { onSuccess: () => setOpen(false) })
    } else {
      createMutation(values, { onSuccess: () => setOpen(false) })
    }
  }

  return { form, onSubmit, isPending, isEdit, open, setOpen }
}
