import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { INDICATEUR_T, API_RESPONSE_T } from '@/types'

export const indicateurServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['indicateurs'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<INDICATEUR_T[]>>('/indicateurs')
        return data.data
      },
    })
  },

  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: Omit<INDICATEUR_T, 'id' | 'created_at' | 'updated_at'>) => {
        const response = await axiosInstance.post('/indicateurs', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['indicateurs'] })
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
      mutationFn: async ({ id, data }: { id: number; data: Omit<INDICATEUR_T, 'id' | 'created_at' | 'updated_at'> }) => {
        const response = await axiosInstance.put(`/indicateurs/${id}`, data)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['indicateurs'] })
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
        await axiosInstance.delete(`/indicateurs/${id}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['indicateurs'] })
        toast.success("Élément supprimé avec succès !")
      },
      onError: (error) => {
        toast.error("Erreur lors de la suppression.")
        console.error(error)
      }
    })
  }
}
