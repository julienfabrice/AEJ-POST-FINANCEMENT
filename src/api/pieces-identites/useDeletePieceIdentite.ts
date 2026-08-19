import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'

export const useDeletePieceIdentite = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axiosInstance.delete(`/aej/types-pieces-identites/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pieces-identites'] })
      toast.success('Élément supprimé avec succès !')
    },
    onError: (error) => {
      toast.error('Une erreur est survenue lors de la suppression.')
      console.error(error)
    }
  })
}
