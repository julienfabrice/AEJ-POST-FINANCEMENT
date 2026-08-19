import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { SOUS_SECTEUR_T } from '@/types'

export const useUpdateSousSecteur = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Omit<SOUS_SECTEUR_T, 'id' | 'created_at' | 'updated_at'> }) => {
      const response = await axiosInstance.put(`/aej/sous-secteurs/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sous-secteurs'] })
      toast.success("Élément modifié avec succès !")
    },
    onError: (error) => {
      toast.error("Erreur lors de la modification.")
      console.error(error)
    }
  })
}
