import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { SECTEUR_T } from '@/types'

export const useCreateSecteur = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<SECTEUR_T, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await axiosInstance.post('/aej/secteurs', data)
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
}
