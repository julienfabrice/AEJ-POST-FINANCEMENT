import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { SOUS_SECTEUR_T } from '@/types'

export const useCreateSousSecteur = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<SOUS_SECTEUR_T, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await axiosInstance.post('/aej/sous-secteurs', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sous-secteurs'] })
      toast.success("Élément ajouté avec succès !")
    },
    onError: (error) => {
      toast.error("Erreur lors de l'ajout.")
      console.error(error)
    }
  })
}
