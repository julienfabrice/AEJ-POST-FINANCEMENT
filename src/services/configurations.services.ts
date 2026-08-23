import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { API_RESPONSE_T } from '@/types'
import type { CONFIGURATION_T, UPDATE_CONFIGURATION_T } from '@/types/configurations.types'

/**
 * `configurations` est une table à ligne unique : pas de liste, pas de
 * suppression. On lit et on met à jour la config active du système.
 */
export const configurationServices = {
  useGet: () => {
    return useQuery({
      queryKey: ['configurations'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<CONFIGURATION_T>>('/configurations')
        return data.data
      },
    })
  },
  useUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: UPDATE_CONFIGURATION_T }) => {
        const response = await axiosInstance.put<API_RESPONSE_T<CONFIGURATION_T>>(
          `/configurations/${id}`,
          data,
        )
        return response.data.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['configurations'] })
        toast.success('Configuration mise à jour avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la mise à jour de la configuration.')
        console.error(error)
      },
    })
  },
}
