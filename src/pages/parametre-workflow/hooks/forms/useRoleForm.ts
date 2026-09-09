import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { workflowServices } from '@/services/workflow'
import { rolesServices } from '@/services/roles.services'
import { etapeRoleSchema, type EtapeRoleFormValues } from '@/schema/workflow'
import type { WORKFLOW_ETAPE_ROLE_T } from '@/types'

export function useRoleForm(etapeCode: string, selectedRole: WORKFLOW_ETAPE_ROLE_T | null, onSuccessCallback?: () => void) {
  const createRoleMutation = workflowServices.useCreateEtapeRole()
  const updateRoleMutation = workflowServices.useUpdateEtapeRole()
  
  const { data: availableRoles = [], isLoading: isAvailableRolesLoading } = rolesServices.useGetAll()

  const isEditMode = !!selectedRole

  const form = useForm<EtapeRoleFormValues>({
    resolver: zodResolver(etapeRoleSchema),
    defaultValues: {
      etape_code: etapeCode,
      role_code: '',
      action: ''
    }
  })

  useEffect(() => {
    if (selectedRole) {
      form.reset({
        etape_code: selectedRole.etape_code,
        role_code: selectedRole.role_code,
        action: selectedRole.action,
      })
    } else {
      form.reset({
        etape_code: etapeCode,
        role_code: '',
        action: ''
      })
    }
  }, [selectedRole, form, etapeCode])

  const onSubmit = (data: EtapeRoleFormValues) => {
    if (isEditMode && selectedRole) {
      updateRoleMutation.mutate({ id: selectedRole.id, ...data }, {
        onSuccess: () => {
          onSuccessCallback?.()
        }
      })
    } else {
      createRoleMutation.mutate(data, {
        onSuccess: () => {
          form.reset()
          onSuccessCallback?.()
        }
      })
    }
  }

  return {
    form,
    onSubmit,
    isSubmitting: isEditMode ? updateRoleMutation.isPending : createRoleMutation.isPending,
    isEditMode,
    availableRoles,
    isAvailableRolesLoading
  }
}
