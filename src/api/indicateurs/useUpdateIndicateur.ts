import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { INDICATEUR_T } from '@/types'

export const useUpdateIndicateur = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Omit<INDICATEUR_T, 'id' | 'created_at' | 'updated_at'> }) => {
      const response = await axiosInstance.put(`/indicateurs/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indicateurs'] })
      toast.success("Élément modifié avec succès !")
    },
    onError: (error) => {
      toast.error("Erreur lors de la modification.")
      console.error(error)
    }
  })
}
