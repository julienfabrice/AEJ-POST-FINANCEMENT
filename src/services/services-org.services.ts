import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { SERVICE_ORG_T, API_RESPONSE_T } from '@/types'

export const serviceOrgServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['services-org'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<SERVICE_ORG_T[]>>('/services')
        return data.data
      },
    })
  },
  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: Omit<SERVICE_ORG_T, 'id'>) => {
        const response = await axiosInstance.post('/services', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['services-org'] })
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
      mutationFn: async ({ id, data }: { id: number; data: Omit<SERVICE_ORG_T, 'id'> }) => {
        const response = await axiosInstance.put(`/services/${id}`, data)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['services-org'] })
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
        await axiosInstance.delete(`/services/${id}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['services-org'] })
        toast.success('Élément supprimé avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la suppression.')
        console.error(error)
      },
    })
  },
}
