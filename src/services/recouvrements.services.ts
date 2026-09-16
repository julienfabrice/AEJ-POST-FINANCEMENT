import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { RECOUVREMENT_T, API_RESPONSE_T } from '@/types'

export const recouvrementServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['recouvrements'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<RECOUVREMENT_T[]>>('/recouvrements')
        return data.data
      },
    })
  },
  useGetOne: (id: number | null) => {
    return useQuery({
      queryKey: ['recouvrements', id],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<RECOUVREMENT_T>>(`/recouvrements/${id}`)
        return data.data
      },
      enabled: !!id,
    })
  },
  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: Omit<RECOUVREMENT_T, 'id'>) => {
        const response = await axiosInstance.post('/recouvrements', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['recouvrements'] })
        toast.success('Action de recouvrement enregistrée avec succès !')
      },
      onError: (error) => {
        toast.error("Erreur lors de la création de l'action de recouvrement.")
        console.error(error)
      },
    })
  },
  useUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: Omit<RECOUVREMENT_T, 'id'> }) => {
        const response = await axiosInstance.put(`/recouvrements/${id}`, data)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['recouvrements'] })
        toast.success('Action de recouvrement modifiée avec succès !')
      },
      onError: (error) => {
        toast.error("Erreur lors de la modification de l'action de recouvrement.")
        console.error(error)
      },
    })
  },
  useDelete: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (id: number) => {
        await axiosInstance.delete(`/recouvrements/${id}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['recouvrements'] })
        toast.success('Action de recouvrement supprimée avec succès !')
      },
      onError: (error) => {
        toast.error("Erreur lors de la suppression de l'action de recouvrement.")
        console.error(error)
      },
    })
  },
}
