import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { TYPE_ENTREPRISE_T, API_RESPONSE_T } from '@/types'

export const typeEntrepriseServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['type-entreprises'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<TYPE_ENTREPRISE_T[]>>('/type-entreprises')
        return data.data
      },
    })
  },

  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: Omit<TYPE_ENTREPRISE_T, 'id' | 'created_at' | 'updated_at'>) => {
        const response = await axiosInstance.post('/type-entreprises', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['type-entreprises'] })
        toast.success("Élément ajouté avec succès !")
      },
      onError: (error) => {
        toast.error("Erreur lors de l'ajout.")
        console.error(error)
      }
    })
  },

  useUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: Omit<TYPE_ENTREPRISE_T, 'id' | 'created_at' | 'updated_at'> }) => {
        const response = await axiosInstance.put(`/type-entreprises/${id}`, data)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['type-entreprises'] })
        toast.success("Élément modifié avec succès !")
      },
      onError: (error) => {
        toast.error("Erreur lors de la modification.")
        console.error(error)
      }
    })
  },

  useDelete: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (id: number) => {
        await axiosInstance.delete(`/type-entreprises/${id}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['type-entreprises'] })
        toast.success("Élément supprimé avec succès !")
      },
      onError: (error) => {
        toast.error("Erreur lors de la suppression.")
        console.error(error)
      }
    })
  }
}
