import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { SITUATION_MATRIMONIALE_T } from '@/types'

export const useCreateSituationMatrimoniale = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<SITUATION_MATRIMONIALE_T, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await axiosInstance.post('/aej/situations-matrimoniale', data)
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
}
