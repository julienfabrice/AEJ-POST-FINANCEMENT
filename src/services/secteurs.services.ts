import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { SECTEUR_T, API_RESPONSE_T } from '@/types'

export const secteurServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['secteurs'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<SECTEUR_T[]>>('/aej/secteurs')
        return data.data
      },
    })
  },

  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: Omit<SECTEUR_T, 'id' | 'created_at' | 'updated_at'>) => {
        const response = await axiosInstance.post('/aej/secteurs', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['secteurs'] })
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
      mutationFn: async ({ id, data }: { id: number; data: Omit<SECTEUR_T, 'id' | 'created_at' | 'updated_at'> }) => {
        const response = await axiosInstance.put(`/aej/secteurs/${id}`, data)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['secteurs'] })
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
        await axiosInstance.delete(`/aej/secteurs/${id}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['secteurs'] })
        toast.success("Élément supprimé avec succès !")
      },
      onError: (error) => {
        toast.error("Erreur lors de la suppression.")
        console.error(error)
      }
    })
  }
}
