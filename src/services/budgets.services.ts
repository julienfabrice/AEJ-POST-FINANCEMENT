import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { BUDGET_T, BUDGET_STATUT_T, API_RESPONSE_T } from '@/types'

export const budgetServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['budgets'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<BUDGET_T[]>>('/budgets')
        return data.data
      },
    })
  },
  useGetOne: (id: number | null) => {
    return useQuery({
      queryKey: ['budgets', id],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<BUDGET_T>>(`/budgets/${id}`)
        return data.data
      },
      enabled: !!id,
    })
  },
  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: Omit<BUDGET_T, 'id'>) => {
        const response = await axiosInstance.post('/budgets', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['budgets'] })
        toast.success('Budget créé avec succès !')
      },
      onError: (error) => {
        toast.error("Erreur lors de la création du budget.")
        console.error(error)
      },
    })
  },
  useUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: Omit<BUDGET_T, 'id'> }) => {
        const response = await axiosInstance.put(`/budgets/${id}`, data)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['budgets'] })
        toast.success('Budget modifié avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la modification du budget.')
        console.error(error)
      },
    })
  },
  /**
   * Validation rapide (PATCH partiel) : bascule `statut` sans repasser tout
   * le formulaire. Utilisé pour le bouton "Valider" / "Rejeter" de la grille.
   */
  useValidate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, statut }: { id: number; statut: BUDGET_STATUT_T }) => {
        const response = await axiosInstance.patch(`/budgets/${id}`, { statut })
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['budgets'] })
        toast.success('Statut du budget mis à jour !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la validation du budget.')
        console.error(error)
      },
    })
  },
  useDelete: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (id: number) => {
        await axiosInstance.delete(`/budgets/${id}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['budgets'] })
        toast.success('Budget supprimé avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la suppression du budget.')
        console.error(error)
      },
    })
  },
}
