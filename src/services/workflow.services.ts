import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { WORKFLOW_VERSION_T, API_RESPONSE_T } from '@/types'

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
      mutationFn: async (payload: { workflow_code: string; name: string; version: string }) => {
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
  }
}
