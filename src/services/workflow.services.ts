import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { WORKFLOW_VERSION_T, API_RESPONSE_T } from '@/types'
import type { 
  CreateVersionFormValues, 
  UpdateVersionFormValues, 
  EtapeFormValues 
} from '@/schema/workflows.schema'

export const workflowServices = {
  useGetVersions: () => {
    return useQuery({
      queryKey: ['workflow', 'versions'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<WORKFLOW_VERSION_T[]>>('/workflow/versions')
        return data.data
      },
    })
  },

  useCreateVersion: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: CreateVersionFormValues & { workflow_code: string }) => {
        const response = await axiosInstance.post('/workflow/versions', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['workflow', 'versions'] })
        toast.success("Version de workflow ajoutée avec succès !")
      },
      onError: (error) => {
        toast.error("Erreur lors de l'ajout de la version.")
        console.error(error)
      }
    })
  },

  useCreateEtape: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: EtapeFormValues & { workflow_version: string }) => {
        const response = await axiosInstance.post('/workflow/etapes', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['workflow', 'versions'] })
        toast.success("Étape ajoutée avec succès !")
      },
      onError: (error) => {
        toast.error("Erreur lors de l'ajout de l'étape.")
        console.error(error)
      }
    })
  },

  useUpdateVersion: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, ...payload }: UpdateVersionFormValues & { id: number }) => {
        const response = await axiosInstance.put(`/workflow/versions/${id}`, payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['workflow', 'versions'] })
        toast.success("Version mise à jour avec succès !")
      },
      onError: (error) => {
        toast.error("Erreur lors de la modification de la version.")
        console.error(error)
      }
    })
  },

  useUpdateEtape: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, ...payload }: EtapeFormValues & { id: number }) => {
        const response = await axiosInstance.put(`/workflow/etapes/${id}`, payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['workflow', 'versions'] })
        toast.success("Étape mise à jour avec succès !")
      },
      onError: (error) => {
        toast.error("Erreur lors de la modification de l'étape.")
        console.error(error)
      }
    })
  }
}
