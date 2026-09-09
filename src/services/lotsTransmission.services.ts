import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { LOT_TRANSMISSION_T, LOT_TRANSMISSION_STATUT_T, API_RESPONSE_T } from '@/types'

export const lotsTransmissionServices = {
  useGetAll: (params?: Record<string, any>) => {
    return useQuery({
      queryKey: ['lots-transmission', params],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<LOT_TRANSMISSION_T[]>>('/lots-transmission', {
          params,
        })
        return data.data
      },
    })
  },
  useGetOne: (id: number | null) => {
    return useQuery({
      queryKey: ['lots-transmission', id],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<LOT_TRANSMISSION_T>>(`/lots-transmission/${id}`)
        return data.data
      },
      enabled: !!id,
    })
  },
  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: Omit<LOT_TRANSMISSION_T, 'id'>) => {
        const response = await axiosInstance.post('/lots-transmission', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['lots-transmission'] })
        toast.success('Lot de transmission créé avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la création du lot.')
        console.error(error)
      },
    })
  },
  useUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: Partial<LOT_TRANSMISSION_T> }) => {
        const response = await axiosInstance.put(`/lots-transmission/${id}`, data)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['lots-transmission'] })
        toast.success('Lot de transmission mis à jour avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la modification du lot.')
        console.error(error)
      },
    })
  },
  useValidate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, statut }: { id: number; statut: LOT_TRANSMISSION_STATUT_T }) => {
        const response = await axiosInstance.patch(`/lots-transmission/${id}`, { statut })
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['lots-transmission'] })
        toast.success('Statut du lot mis à jour !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la mise à jour du statut du lot.')
        console.error(error)
      },
    })
  },
  useDelete: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (id: number) => {
        await axiosInstance.delete(`/lots-transmission/${id}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['lots-transmission'] })
        toast.success('Lot supprimé avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la suppression du lot.')
        console.error(error)
      },
    })
  },
}
