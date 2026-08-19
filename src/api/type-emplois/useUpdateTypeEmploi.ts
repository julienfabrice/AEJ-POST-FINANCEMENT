import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { TYPE_EMPLOI_T } from '@/types'

export const useUpdateTypeEmploi = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Omit<TYPE_EMPLOI_T, 'id'> }) => {
      const response = await axiosInstance.put(`/type-emplois/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['type-emplois'] })
      toast.success("Élément modifié avec succès !")
    },
    onError: (error) => {
      toast.error("Erreur lors de la modification.")
      console.error(error)
    }
  })
}
