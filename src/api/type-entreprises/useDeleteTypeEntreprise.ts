import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'

export const useDeleteTypeEntreprise = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axiosInstance.delete(`/type-entreprises/${id}`)
      return data
    },
    onSuccess: () => {
      toast.dismiss()
      // Refresh the grid
      queryClient.invalidateQueries({ queryKey: ['type-entreprises'] })
      toast.success('Élément supprimé avec succès !')
    },
    onError: (error) => {
      toast.error('Une erreur est survenue lors de la suppression.')
      console.error(error)
    },
  })
}
