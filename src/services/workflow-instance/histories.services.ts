import { useMutation, useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { WORKFLOW_INSTANCE_HISTORY_T } from '@/types/workflow.types'
import type { WorkflowHistoryValues } from '@/schema/workflow'

export const workflowHistoriesServices = {
  /**
   * POST /workflow-instances/histories
   * Enregistre l'action effectuée sur une étape (audit trail).
   */
  useCreateHistory: () => {
    return useMutation({
      mutationFn: async (payload: WorkflowHistoryValues): Promise<WORKFLOW_INSTANCE_HISTORY_T> => {
        const { data } = await axiosInstance.post('/workflow-instances/histories', payload)
        return data.data ?? data
      },
      onError: (error) => {
        console.error("Erreur lors de l'enregistrement de l'historique workflow", error)
        toast.error("Erreur lors de l'enregistrement de l'historique.")
      },
    })
  },

  /**
   * GET /workflow-instances/histories
   * Récupère l'historique d'une instance de workflow.
   */
  useGetHistories: (workflow_instance_id?: number) => {
    return useQuery({
      queryKey: ['workflow-histories', workflow_instance_id],
      queryFn: async (): Promise<WORKFLOW_INSTANCE_HISTORY_T[]> => {
        const { data } = await axiosInstance.get('/workflow-instances/histories', {
          params: { workflow_instance_id },
        })
        return data.data ?? data
      },
      enabled: !!workflow_instance_id,
    })
  },
}
