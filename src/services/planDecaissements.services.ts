import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { PLAN_DECAISSEMENT_T, API_RESPONSE_T } from '@/types'

export const planDecaissementServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['plan-decaissements'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<PLAN_DECAISSEMENT_T[]>>('/plan-decaissements')
        return data.data
      },
    })
  },
  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: Omit<PLAN_DECAISSEMENT_T, 'id'>) => {
        const response = await axiosInstance.post('/plan-decaissements', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['plan-decaissements'] })
        toast.success('Plan de décaissement créé avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la création du plan de décaissement.')
        console.error(error)
      },
    })
  },
  useUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: Omit<PLAN_DECAISSEMENT_T, 'id'> }) => {
        const response = await axiosInstance.put(`/plan-decaissements/${id}`, data)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['plan-decaissements'] })
        toast.success('Plan de décaissement modifié avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la modification du plan de décaissement.')
        console.error(error)
      },
    })
  },
  useDelete: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (id: number) => {
        await axiosInstance.delete(`/plan-decaissements/${id}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['plan-decaissements'] })
        toast.success('Plan de décaissement supprimé avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la suppression du plan de décaissement.')
        console.error(error)
      },
    })
  },
}
