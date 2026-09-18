import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { WORKFLOW_INSTANCE_HISTORY_T, WORKFLOW_INSTANCE_DELIVERABLE_T } from '@/types/workflow.types'
import type { WorkflowInstancePatchValues, WorkflowHistoryValues } from '@/schema/workflow'

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const workflowInstancesServices = {
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
   * PATCH /workflow-instances/instances/{id}
   * Met à jour l'instance : étape courante, statut, completed_at.
   */
  usePatchInstance: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({
        instanceId,
        patch,
      }: {
        instanceId: number
        patch: WorkflowInstancePatchValues
      }) => {
        const { data } = await axiosInstance.patch(`/workflow-instances/instances/${instanceId}`, patch)
        return data.data ?? data
      },
      onSuccess: () => {
        // Rafraîchit la liste des projets pour refléter la nouvelle étape
        queryClient.invalidateQueries({ queryKey: ['projets'] })
      },
      onError: (error) => {
        console.error("Erreur lors de la mise à jour de l'instance workflow", error)
        toast.error("Erreur lors de la mise à jour du workflow.")
      },
    })
  },

  /**
   * GET /workflow-instances/deliverables
   * Récupère les livrables d'une instance de workflow.
   */
  useGetDeliverables: (workflow_instance_id?: number) => {
    return useQuery({
      queryKey: ['workflow-deliverables', workflow_instance_id],
      queryFn: async (): Promise<WORKFLOW_INSTANCE_DELIVERABLE_T[]> => {
        const { data } = await axiosInstance.get('/workflow-instances/deliverables', {
          params: { workflow_instance_id },
        })
        return data.data ?? data
      },
      enabled: !!workflow_instance_id,
    })
  },
}
