import { rolesServices } from '@/services/roles.services'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { roleSchema, type RoleFormValues } from '@/schema/roles/roleSchema'
import type { ROLE_T } from '@/services/roles.services'

const DEFAULT_VALUES: RoleFormValues = {
  code: '',
  libelle: '',
  description: '',
}

export function useRoleForm(
  initialData: ROLE_T | null,
  controlledOpen?: boolean,
  onOpenChange?: (open: boolean) => void,
) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const setOpen = (newOpen: boolean) => {
    if (!isControlled) setInternalOpen(newOpen)
    if (onOpenChange) onOpenChange(newOpen)
  }

  const { mutate: createMutation, isPending: isCreating } = rolesServices.useCreate()
  const { mutate: updateMutation, isPending: isUpdating } = rolesServices.useUpdate()

  const isPending = isCreating || isUpdating
  const isEdit = !!initialData

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          code: initialData.code ?? '',
          libelle: initialData.libelle ?? initialData.name ?? '',
          description: initialData.description ?? '',
        })
      } else {
        form.reset(DEFAULT_VALUES)
      }
    }
  }, [open, initialData, form])

  const onSubmit = (values: RoleFormValues) => {
    if (isEdit && initialData) {
      updateMutation({ id: initialData.id, data: values }, { onSuccess: () => setOpen(false) })
    } else {
      createMutation(values, { onSuccess: () => setOpen(false) })
    }
  }

  return { form, onSubmit, isPending, isEdit, open, setOpen }
}
