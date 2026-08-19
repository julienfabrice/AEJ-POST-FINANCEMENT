import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { TYPE_ENTREPRISE_T } from '@/types'

export const useCreateTypeEntreprise = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<TYPE_ENTREPRISE_T, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await axiosInstance.post('/type-entreprises', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['type-entreprises'] })
      toast.success("Type d'entreprise ajouté avec succès !")
    },
    onError: (error) => {
      toast.error("Erreur lors de l'ajout du type d'entreprise.")
      console.error(error)
    }
  })
}
