import { useState } from 'react'
import { workflowServices } from '@/services/workflow'
import type { WORKFLOW_ETAPE_DELIVERABLE_T } from '@/types'

export function useSlaDeliverables(etape_code: string) {
  const { data: fetchedDeliverables, isLoading: isDeliverablesLoading } = workflowServices.useGetEtapeDeliverables(etape_code)
  const deleteDeliverableMutation = workflowServices.useDeleteEtapeDeliverable()

  const [isDeliverableModalOpen, setIsDeliverableModalOpen] = useState(false)
  const [selectedDeliverableInfo, setSelectedDeliverableInfo] = useState<WORKFLOW_ETAPE_DELIVERABLE_T | null>(null)

  const displayDeliverables = fetchedDeliverables || []

  const handleDeleteDeliverable = (id: number) => {
    deleteDeliverableMutation.mutate(id)
  }

  return {
    displayDeliverables,
    isDeliverablesLoading,
    
    isDeliverableModalOpen,
    setIsDeliverableModalOpen,
    selectedDeliverableInfo,
    setSelectedDeliverableInfo,
    
    handleDeleteDeliverable
  }
}
