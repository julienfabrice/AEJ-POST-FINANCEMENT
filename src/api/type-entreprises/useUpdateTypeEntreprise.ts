import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { TYPE_ENTREPRISE_T } from '@/types'

export const useUpdateTypeEntreprise = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Omit<TYPE_ENTREPRISE_T, 'id' | 'created_at' | 'updated_at'> }) => {
      const response = await axiosInstance.put(`/type-entreprises/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['type-entreprises'] })
      toast.success("Type d'entreprise modifié avec succès !")
    },
    onError: (error) => {
      toast.error("Erreur lors de la modification du type d'entreprise.")
      console.error(error)
    }
  })
}
