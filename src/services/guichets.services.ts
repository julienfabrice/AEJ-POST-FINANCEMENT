import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { GUICHET_T, API_RESPONSE_T } from '@/types'

export const guichetServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['guichets'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<GUICHET_T[]>>('/guichets')
        return data.data
      },
    })
  },
  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: Omit<GUICHET_T, 'id'>) => {
        const response = await axiosInstance.post('/guichets', payload)
        return response.data
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['guichets'] })
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
      mutationFn: async ({ id, data }: { id: number; data: Omit<GUICHET_T, 'id'> }) => {
        const response = await axiosInstance.put(`/guichets/${id}`, data)
        return response.data
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['guichets'] })
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
        await axiosInstance.delete(`/guichets/${id}`)
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['guichets'] })
        toast.success('Élément supprimé avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la suppression.')
        console.error(error)
      },
    })
  },
}
