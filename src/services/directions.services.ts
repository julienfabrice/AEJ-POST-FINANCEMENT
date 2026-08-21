import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { DIRECTION_T, API_RESPONSE_T } from '@/types'

export const directionServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['directions'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<DIRECTION_T[]>>('/directions')
        return data.data
      },
    })
  },
  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: Omit<DIRECTION_T, 'id'>) => {
        const response = await axiosInstance.post('/directions', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['directions'] })
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
      mutationFn: async ({ id, data }: { id: number; data: Omit<DIRECTION_T, 'id'> }) => {
        const response = await axiosInstance.put(`/directions/${id}`, data)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['directions'] })
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
        await axiosInstance.delete(`/directions/${id}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['directions'] })
        toast.success('Élément supprimé avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la suppression.')
        console.error(error)
      },
    })
  },
}
