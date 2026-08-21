import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { TYPE_EMPLOI_T, API_RESPONSE_T } from '@/types'

export const typeEmploiServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['type-emplois'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<TYPE_EMPLOI_T[]>>('/type-emplois')
        return data.data
      },
    })
  },

  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: Omit<TYPE_EMPLOI_T, 'id' | 'created_at' | 'updated_at'>) => {
        const response = await axiosInstance.post('/type-emplois', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['type-emplois'] })
        toast.success("Élément ajouté avec succès !")
      },
      onError: (error) => {
        toast.error("Erreur lors de l'ajout.")
        console.error(error)
      }
    })
  },

  useUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: Omit<TYPE_EMPLOI_T, 'id' | 'created_at' | 'updated_at'> }) => {
        const response = await axiosInstance.put(`/type-emplois/${id}`, data)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['type-emplois'] })
        toast.success("Élément modifié avec succès !")
      },
      onError: (error) => {
        toast.error("Erreur lors de la modification.")
        console.error(error)
      }
    })
  },

  useDelete: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (id: number) => {
        await axiosInstance.delete(`/type-emplois/${id}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['type-emplois'] })
        toast.success("Élément supprimé avec succès !")
      },
      onError: (error) => {
        toast.error("Erreur lors de la suppression.")
        console.error(error)
      }
    })
  }
}
