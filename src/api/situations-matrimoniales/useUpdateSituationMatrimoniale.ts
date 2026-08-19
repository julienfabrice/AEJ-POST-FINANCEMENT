import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { SITUATION_MATRIMONIALE_T } from '@/types'

export const useUpdateSituationMatrimoniale = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Omit<SITUATION_MATRIMONIALE_T, 'id' | 'created_at' | 'updated_at'> }) => {
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
}
