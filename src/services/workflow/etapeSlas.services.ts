import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { EtapeSlaFormValues } from '@/schema/workflow'
import type { WORKFLOW_ETAPE_SLA_T, API_RESPONSE_T } from '@/types'

export const etapeSlasServices = {
  useGetEtapeSlas: (etapeCode: string) => {
    return useQuery({
      queryKey: ['workflow', 'etape-slas', etapeCode],
      queryFn: async () => {
        // En supposant que le filtrage par etape_code se fait via un paramètre de requête ou que l'API renvoie tous les slas
        // On va passer l'etape_code en paramètre
        const { data } = await axiosInstance.get<API_RESPONSE_T<WORKFLOW_ETAPE_SLA_T[]>>('/workflow/etape-slas', {
          params: { etape_code: etapeCode }
        })
        
        // Si l'API retourne directement un tableau, ou data.data
        const result = data.data || (Array.isArray(data) ? data : [])
        return result.filter((sla: WORKFLOW_ETAPE_SLA_T) => sla.etape_code === etapeCode)
      },
      enabled: !!etapeCode
    })
  },
  useCreateEtapeSla: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: EtapeSlaFormValues) => {
        const dataToSend = { ...payload, name: payload.description };
        const response = await axiosInstance.post('/workflow/etape-slas', dataToSend)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['workflow', 'versions'] })
        queryClient.invalidateQueries({ queryKey: ['workflow', 'etape-slas'] })
        toast.success("SLA d'étape ajouté avec succès !")
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
          toast.error(error.response?.data?.message || "Erreur lors de l'ajout du SLA.")
        }
        console.error(error)
      }
    })
  },

  useUpdateEtapeSla: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, ...payload }: EtapeSlaFormValues & { id: number }) => {
        const dataToSend = { ...payload, name: payload.description };
        const response = await axiosInstance.put(`/workflow/etape-slas/${id}`, dataToSend)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['workflow', 'versions'] })
        queryClient.invalidateQueries({ queryKey: ['workflow', 'etape-slas'] })
        toast.success("SLA d'étape mis à jour avec succès !")
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
          toast.error(error.response?.data?.message || "Erreur lors de la modification du SLA.")
        }
        console.error(error)
      }
    })
  },

  useDeleteEtapeSla: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await axiosInstance.delete(`/workflow/etape-slas/${id}`)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['workflow', 'versions'] })
        queryClient.invalidateQueries({ queryKey: ['workflow', 'etape-slas'] })
        toast.success("SLA supprimé avec succès !")
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Erreur lors de la suppression du SLA.")
        console.error(error)
      }
    })
  }
}
