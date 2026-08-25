import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { REMBOURSEMENT_T, REMBOURSEMENT_STATUT_T, API_RESPONSE_T } from '@/types'

export const remboursementServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['remboursements'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<REMBOURSEMENT_T[]>>('/remboursements')
        return data.data
      },
    })
  },
  useGetOne: (id: number | null) => {
    return useQuery({
      queryKey: ['remboursements', id],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<REMBOURSEMENT_T>>(`/remboursements/${id}`)
        return data.data
      },
      enabled: !!id,
    })
  },
  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: Omit<REMBOURSEMENT_T, 'id'>) => {
        const response = await axiosInstance.post('/remboursements', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['remboursements'] })
        toast.success('Remboursement enregistré avec succès !')
      },
      onError: (error) => {
        toast.error("Erreur lors de la création du remboursement.")
        console.error(error)
      },
    })
  },
  useUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: Omit<REMBOURSEMENT_T, 'id'> }) => {
        const response = await axiosInstance.put(`/remboursements/${id}`, data)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['remboursements'] })
        toast.success('Remboursement modifié avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la modification du remboursement.')
        console.error(error)
      },
    })
  },
  /**
   * Validation rapide (PATCH partiel) : bascule `statut` sans repasser tout
   * le formulaire, comme pour les budgets et décaissements.
   */
  useValidate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, statut }: { id: number; statut: REMBOURSEMENT_STATUT_T }) => {
        const response = await axiosInstance.patch(`/remboursements/${id}`, { statut })
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['remboursements'] })
        toast.success('Statut du remboursement mis à jour !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la validation du remboursement.')
        console.error(error)
      },
    })
  },
  useDelete: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (id: number) => {
        await axiosInstance.delete(`/remboursements/${id}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['remboursements'] })
        toast.success('Remboursement supprimé avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la suppression du remboursement.')
        console.error(error)
      },
    })
  },
}
