import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { COMPTE_FINANCEMENT_T, API_RESPONSE_T } from '@/types'

export const compteFinancementServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['compte-financements'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<COMPTE_FINANCEMENT_T[]>>('/compte-financements')
        return data.data
      },
    })
  },
  useGetOne: (id: number | null) => {
    return useQuery({
      queryKey: ['compte-financements', id],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<COMPTE_FINANCEMENT_T>>(`/compte-financements/${id}`)
        return data.data
      },
      enabled: !!id,
    })
  },
  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: Omit<COMPTE_FINANCEMENT_T, 'id'>) => {
        const response = await axiosInstance.post('/compte-financements', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['compte-financements'] })
        toast.success('Compte de financement créé avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la création du compte de financement.')
        console.error(error)
      },
    })
  },
  useUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: Omit<COMPTE_FINANCEMENT_T, 'id'> }) => {
        const response = await axiosInstance.put(`/compte-financements/${id}`, data)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['compte-financements'] })
        toast.success('Compte de financement modifié avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la modification du compte de financement.')
        console.error(error)
      },
    })
  },
  useDelete: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (id: number) => {
        await axiosInstance.delete(`/compte-financements/${id}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['compte-financements'] })
        toast.success('Compte de financement supprimé avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la suppression du compte de financement.')
        console.error(error)
      },
    })
  },
}
