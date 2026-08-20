import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { WORKFLOW_VERSION_T, API_RESPONSE_T } from '@/types'
import type { 
  CreateVersionFormValues, 
  UpdateVersionFormValues 
} from '@/schema/workflow'

export const versionServices = {
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

  useDeleteVersion: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await axiosInstance.delete(`/workflow/versions/${id}`)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['workflow', 'versions'] })
        toast.success("Version supprimée avec succès !")
      },
      onError: (error) => {
        toast.error("Erreur lors de la suppression de la version.")
        console.error(error)
      }
    })
  }
}
