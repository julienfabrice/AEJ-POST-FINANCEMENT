import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import type { EtapeDeliverableFormValues } from '@/schema/workflow/etapeDeliverables.schema'
import type { WORKFLOW_ETAPE_DELIVERABLE_T } from '@/types/workflow.types'
import { toast } from 'sonner'

export const workflowDeliverablesKeys = {
  all: ['workflow', 'etape-deliverables'] as const,
  byEtape: (code: string) => [...workflowDeliverablesKeys.all, code] as const,
}

export const etapeDeliverablesServices = {
  useGetEtapeDeliverables: (etapeCode?: string) => {
    return useQuery({
      queryKey: workflowDeliverablesKeys.byEtape(etapeCode || ''),
      queryFn: async () => {
        if (!etapeCode) return []
        const { data } = await axiosInstance.get('/workflow/etape-deliverables', {
          params: { etape_code: etapeCode }
        })
        const result = data.data || (Array.isArray(data) ? data : [])
        return result.filter((d: WORKFLOW_ETAPE_DELIVERABLE_T) => d.etape_code === etapeCode)
      },
      enabled: !!etapeCode
    })
  },

  useCreateEtapeDeliverable: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: EtapeDeliverableFormValues) => {
        const response = await axiosInstance.post('/workflow/etape-deliverables', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: workflowDeliverablesKeys.all })
        toast.success("Document ajouté avec succès !")
      },
      onError: (error: any) => {
        if (error.response?.data?.errors) {
          const errors = error.response.data.errors;
          Object.values(errors).forEach((messages: any) => {
            if (Array.isArray(messages)) {
              messages.forEach(msg => toast.error(msg));
            }
          });
        } else {
          toast.error(error.response?.data?.message || "Erreur lors de l'ajout du document.")
        }
        console.error(error)
      }
    })
  },

  useUpdateEtapeDeliverable: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, ...payload }: EtapeDeliverableFormValues & { id: number }) => {
        const response = await axiosInstance.put(`/workflow/etape-deliverables/${id}`, payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: workflowDeliverablesKeys.all })
        toast.success("Document mis à jour avec succès !")
      },
      onError: (error: any) => {
        if (error.response?.data?.errors) {
          const errors = error.response.data.errors;
          Object.values(errors).forEach((messages: any) => {
            if (Array.isArray(messages)) {
              messages.forEach(msg => toast.error(msg));
            }
          });
        } else {
          toast.error(error.response?.data?.message || "Erreur lors de la modification du document.")
        }
        console.error(error)
      }
    })
  },

  useDeleteEtapeDeliverable: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await axiosInstance.delete(`/workflow/etape-deliverables/${id}`)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: workflowDeliverablesKeys.all })
        toast.success("Document supprimé avec succès !")
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Erreur lors de la suppression du document.")
        console.error(error)
      }
    })
  }
}
