import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import type { API_RESPONSE_T, DISPOSITIF_T } from '@/types'

export const dispositifServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['dispositifs'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<DISPOSITIF_T[]>>('/dispositifs')
        return data.data
      }
    })
  },
  
  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: Partial<DISPOSITIF_T>) => {
        const { data } = await axiosInstance.post<API_RESPONSE_T<DISPOSITIF_T>>('/dispositifs', payload)
        return data.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['dispositifs'] })
      }
    })
  },

  useUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, ...payload }: Partial<DISPOSITIF_T> & { id: number }) => {
        const { data } = await axiosInstance.put<API_RESPONSE_T<DISPOSITIF_T>>(`/dispositifs/${id}`, payload)
        return data.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['dispositifs'] })
      }
    })
  },

  useDelete: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (id: number) => {
        await axiosInstance.delete(`/dispositifs/${id}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['dispositifs'] })
      }
    })
  }
}
