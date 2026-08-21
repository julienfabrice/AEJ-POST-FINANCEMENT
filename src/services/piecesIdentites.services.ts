import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { PIECE_IDENTITE_T, API_RESPONSE_T } from '@/types'

export const pieceIdentiteServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['pieces-identites'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<PIECE_IDENTITE_T[]>>('/aej/types-pieces-identites')
        return data.data
      },
    })
  },

  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: Omit<PIECE_IDENTITE_T, 'id' | 'created_at' | 'updated_at'>) => {
        const response = await axiosInstance.post('/aej/types-pieces-identites', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['pieces-identites'] })
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
      mutationFn: async ({ id, data }: { id: number; data: Omit<PIECE_IDENTITE_T, 'id' | 'created_at' | 'updated_at'> }) => {
        const response = await axiosInstance.put(`/aej/types-pieces-identites/${id}`, data)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['pieces-identites'] })
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
        await axiosInstance.delete(`/aej/types-pieces-identites/${id}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['pieces-identites'] })
        toast.success("Élément supprimé avec succès !")
      },
      onError: (error) => {
        toast.error("Erreur lors de la suppression.")
        console.error(error)
      }
    })
  }
}
