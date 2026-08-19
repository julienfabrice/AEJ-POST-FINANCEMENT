import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { INDICATEUR_T } from '@/types'

export const useCreateIndicateur = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<INDICATEUR_T, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await axiosInstance.post('/indicateurs', data)
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
}
