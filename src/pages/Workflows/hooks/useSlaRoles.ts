import { useState } from 'react'
import { workflowServices } from '@/services/workflow'
import type { WORKFLOW_ETAPE_ROLE_T } from '@/types'

export function useSlaRoles(etape_code: string) {
  const { data: fetchedRoles, isLoading: isRolesLoading } = workflowServices.useGetEtapeRoles(etape_code)
  const deleteRoleMutation = workflowServices.useDeleteEtapeRole()

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false)
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<WORKFLOW_ETAPE_ROLE_T | null>(null)
  
  const displayRoles = fetchedRoles || []

  const handleDeleteRole = (id: number) => {
    deleteRoleMutation.mutate(id)
  }

  return {
    displayRoles,
    isRolesLoading,
    
    isRoleModalOpen,
    setIsRoleModalOpen,
    isEditRoleModalOpen,
    setIsEditRoleModalOpen,
    selectedRoleForEdit,
    setSelectedRoleForEdit,
    
    handleDeleteRole
  }
}
