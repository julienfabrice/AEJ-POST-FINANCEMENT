import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { PIECE_IDENTITE_T } from '@/types'

export const useCreatePieceIdentite = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<PIECE_IDENTITE_T, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await axiosInstance.post('/aej/types-pieces-identites', data)
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
}
