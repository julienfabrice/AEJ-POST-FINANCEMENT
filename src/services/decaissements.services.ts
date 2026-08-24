import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { DECAISSEMENT_T, DECAISSEMENT_STATUT_T, API_RESPONSE_T } from '@/types'

export const decaissementServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['decaissements'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<DECAISSEMENT_T[]>>('/decaissements')
        return data.data
      },
    })
  },
  useGetOne: (id: number | null) => {
    return useQuery({
      queryKey: ['decaissements', id],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<DECAISSEMENT_T>>(`/decaissements/${id}`)
        return data.data
      },
      enabled: !!id,
    })
  },
  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: Omit<DECAISSEMENT_T, 'id'>) => {
        const response = await axiosInstance.post('/decaissements', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['decaissements'] })
        toast.success('Décaissement enregistré avec succès !')
      },
      onError: (error) => {
        toast.error("Erreur lors de la création du décaissement.")
        console.error(error)
      },
    })
  },
  useUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: Omit<DECAISSEMENT_T, 'id'> }) => {
        const response = await axiosInstance.put(`/decaissements/${id}`, data)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['decaissements'] })
        toast.success('Décaissement modifié avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la modification du décaissement.')
        console.error(error)
      },
    })
  },
  /**
   * Validation rapide (PATCH partiel) : bascule `statut` sans repasser tout
   * le formulaire, comme pour les budgets.
   */
  useValidate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, statut }: { id: number; statut: DECAISSEMENT_STATUT_T }) => {
        const response = await axiosInstance.patch(`/decaissements/${id}`, { statut })
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['decaissements'] })
        toast.success('Statut du décaissement mis à jour !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la validation du décaissement.')
        console.error(error)
      },
    })
  },
  useDelete: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (id: number) => {
        await axiosInstance.delete(`/decaissements/${id}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['decaissements'] })
        toast.success('Décaissement supprimé avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la suppression du décaissement.')
        console.error(error)
      },
    })
  },
}
