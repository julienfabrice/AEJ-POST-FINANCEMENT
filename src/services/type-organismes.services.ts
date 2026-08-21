import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { TYPE_ORGANISME_T, API_RESPONSE_T } from '@/types'

export const typeOrganismeServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['type-organismes'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<TYPE_ORGANISME_T[]>>('/type-organismes')
        return data.data
      },
    })
  },
  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: Omit<TYPE_ORGANISME_T, 'id'>) => {
        const response = await axiosInstance.post('/type-organismes', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['type-organismes'] })
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
      mutationFn: async ({ id, data }: { id: number; data: Omit<TYPE_ORGANISME_T, 'id'> }) => {
        const response = await axiosInstance.put(`/type-organismes/${id}`, data)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['type-organismes'] })
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
        await axiosInstance.delete(`/type-organismes/${id}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['type-organismes'] })
        toast.success('Élément supprimé avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la suppression.')
        console.error(error)
      },
    })
  },
}
