import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type {
  CATEGORIE_TRANSACTION_T,
  CATEGORIES_TRANSACTIONS_API_RESPONSE_T,
  API_RESPONSE_T,
} from '@/types'

export const categoriesTransactionsServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['categories-transactions'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<CATEGORIES_TRANSACTIONS_API_RESPONSE_T>(
          '/categories-transactions',
        )
        return data.data
      },
    })
  },

  useGetOne: (id: number | null) => {
    return useQuery({
      queryKey: ['categories-transactions', id],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<CATEGORIE_TRANSACTION_T>>(
          `/categories-transactions/${id}`,
        )
        return data.data
      },
      enabled: !!id,
    })
  },

  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: Omit<CATEGORIE_TRANSACTION_T, 'id' | 'created_at' | 'updated_at'>) => {
        const response = await axiosInstance.post('/categories-transactions', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['categories-transactions'] })
        toast.success('Catégorie ajoutée avec succès !')
      },
      onError: (error) => {
        toast.error("Erreur lors de l'ajout de la catégorie.")
        console.error(error)
      },
    })
  },

  useUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({
        id,
        data,
      }: {
        id: number
        data: Partial<Omit<CATEGORIE_TRANSACTION_T, 'id' | 'created_at' | 'updated_at'>>
      }) => {
        const response = await axiosInstance.put(`/categories-transactions/${id}`, data)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['categories-transactions'] })
        toast.success('Catégorie modifiée avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la modification de la catégorie.')
        console.error(error)
      },
    })
  },

  useDelete: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (id: number) => {
        await axiosInstance.delete(`/categories-transactions/${id}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['categories-transactions'] })
        toast.success('Catégorie supprimée avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la suppression de la catégorie.')
        console.error(error)
      },
    })
  },
}
