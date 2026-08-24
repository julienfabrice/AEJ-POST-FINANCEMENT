import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { FONCTION_T, API_RESPONSE_T } from '@/types'

export const fonctionServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['fonctions'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<FONCTION_T[]>>('/fonctions')
        return data.data
      },
    })
  },
  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: Omit<FONCTION_T, 'id'>) => {
        const response = await axiosInstance.post('/fonctions', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['fonctions'] })
        toast.success('Élément ajouté avec succès !')
      },
      onError: (error) => {
        toast.error("Erreur lors de l'ajout.")
        console.error(error)
      },
    })
  },
  useUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: Omit<FONCTION_T, 'id'> }) => {
        const response = await axiosInstance.put(`/fonctions/${id}`, data)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['fonctions'] })
        toast.success('Élément modifié avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la modification.')
        console.error(error)
      },
    })
  },
  useDelete: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (id: number) => {
        await axiosInstance.delete(`/fonctions/${id}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['fonctions'] })
        toast.success('Élément supprimé avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la suppression.')
        console.error(error)
      },
    })
  },
}
