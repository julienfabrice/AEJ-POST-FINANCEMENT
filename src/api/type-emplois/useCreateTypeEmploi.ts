import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { TYPE_EMPLOI_T } from '@/types'

export const useCreateTypeEmploi = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<TYPE_EMPLOI_T, 'id'>) => {
      const response = await axiosInstance.post('/type-emplois', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['type-emplois'] })
      toast.success("Élément ajouté avec succès !")
    },
    onError: (error) => {
      toast.error("Erreur lors de l'ajout.")
      console.error(error)
    }
  })
}
