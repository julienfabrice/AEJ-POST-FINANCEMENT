import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { PIECE_IDENTITE_T } from '@/types'

export const useUpdatePieceIdentite = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Omit<PIECE_IDENTITE_T, 'id' | 'created_at' | 'updated_at'> }) => {
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
}
