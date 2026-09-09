import { useState } from 'react'
import { workflowServices } from '@/services/workflow'
import type { WORKFLOW_ETAPE_T } from '@/types'

export function useWorkflowCycle(etape: WORKFLOW_ETAPE_T | undefined, code: string) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isSlaModalOpen, setIsSlaModalOpen] = useState(false)
  
  const deleteEtapeMutation = workflowServices.useDeleteEtape()
  const { data: fetchedSlas, isLoading: isSlasLoading } = workflowServices.useGetEtapeSlas(code)

  const displaySlas = fetchedSlas || (etape?.slas || [])

  const handleDelete = () => {
    if (!etape) return
    deleteEtapeMutation.mutate(etape.id)
  }

  return {
    isEditModalOpen,
    setIsEditModalOpen,
    isSlaModalOpen,
    setIsSlaModalOpen,
    displaySlas,
    isSlasLoading,
    handleDelete
  }
}
