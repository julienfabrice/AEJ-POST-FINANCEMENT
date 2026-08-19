import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'

export const useDeleteSecteur = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axiosInstance.delete(`/aej/secteurs/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secteurs'] })
      toast.success('Élément supprimé avec succès !')
    },
    onError: (error) => {
      toast.error('Une erreur est survenue lors de la suppression.')
      console.error(error)
    }
  })
}
