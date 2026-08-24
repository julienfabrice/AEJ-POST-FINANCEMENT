import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { ORGANISME_FINANCEMENT_T, API_RESPONSE_T } from '@/types'

export const organismeServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['organismes'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<ORGANISME_FINANCEMENT_T[]>>('/organismes')
        return data.data
      },
    })
  },
  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: Omit<ORGANISME_FINANCEMENT_T, 'id'>) => {
        const response = await axiosInstance.post('/organismes', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['organismes'] })
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
      mutationFn: async ({ id, data }: { id: number; data: Omit<ORGANISME_FINANCEMENT_T, 'id'> }) => {
        const response = await axiosInstance.put(`/organismes/${id}`, data)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['organismes'] })
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
        await axiosInstance.delete(`/organismes/${id}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['organismes'] })
        toast.success('Élément supprimé avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la suppression.')
        console.error(error)
      },
    })
  },
}
