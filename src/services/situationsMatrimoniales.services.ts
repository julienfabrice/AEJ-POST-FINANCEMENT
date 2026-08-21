import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { SITUATION_MATRIMONIALE_T, API_RESPONSE_T } from '@/types'

export const situationMatrimonialeServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['situations-matrimoniales'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<SITUATION_MATRIMONIALE_T[]>>('/aej/situations-matrimoniale')
        return data.data
      },
    })
  },

  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: Omit<SITUATION_MATRIMONIALE_T, 'id' | 'created_at' | 'updated_at'>) => {
        const response = await axiosInstance.post('/aej/situations-matrimoniale', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['situations-matrimoniales'] })
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
      mutationFn: async ({ id, data }: { id: number; data: Omit<SITUATION_MATRIMONIALE_T, 'id' | 'created_at' | 'updated_at'> }) => {
        const response = await axiosInstance.put(`/aej/situations-matrimoniale/${id}`, data)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['situations-matrimoniales'] })
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
        await axiosInstance.delete(`/aej/situations-matrimoniale/${id}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['situations-matrimoniales'] })
        toast.success("Élément supprimé avec succès !")
      },
      onError: (error) => {
        toast.error("Erreur lors de la suppression.")
        console.error(error)
      }
    })
  }
}
