import { useState } from 'react'
import { workflowServices } from '@/services/workflow'
import type { WORKFLOW_ETAPE_SLA_T } from '@/types'

export function useWorkflowSubCycle(sla: WORKFLOW_ETAPE_SLA_T) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  const deleteSlaMutation = workflowServices.useDeleteEtapeSla()

  const handleDeleteSla = () => {
    deleteSlaMutation.mutate(sla.id)
  }

  return {
    isEditModalOpen,
    setIsEditModalOpen,
    handleDeleteSla
  }
}
