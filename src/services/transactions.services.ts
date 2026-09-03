import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { TRANSACTION_T, API_RESPONSE_T } from '@/types'

export const transactionServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['transactions'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<TRANSACTION_T[]>>('/transactions')
        return data.data
      },
    })
  },
  useGetOne: (id: number | null) => {
    return useQuery({
      queryKey: ['transactions', id],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<TRANSACTION_T>>(`/transactions/${id}`)
        return data.data
      },
      enabled: !!id,
    })
  },
  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: Omit<TRANSACTION_T, 'id'>) => {
        const response = await axiosInstance.post('/transactions', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] })
        toast.success('Dépense enregistrée avec succès !')
      },
      onError: (error) => {
        toast.error("Erreur lors de la création de la dépense.")
        console.error(error)
      },
    })
  },
  useUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: Omit<TRANSACTION_T, 'id'> }) => {
        const response = await axiosInstance.put(`/transactions/${id}`, data)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] })
        toast.success('Dépense modifiée avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la modification de la dépense.')
        console.error(error)
      },
    })
  },
  useDelete: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (id: number) => {
        await axiosInstance.delete(`/transactions/${id}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] })
        toast.success('Dépense supprimée avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la suppression de la dépense.')
        console.error(error)
      },
    })
  },
}
