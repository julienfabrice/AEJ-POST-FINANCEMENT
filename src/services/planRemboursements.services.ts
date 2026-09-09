import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { PLAN_REMBOURSEMENT_T, API_RESPONSE_T } from '@/types'

export const planRemboursementServices = {
  useGetAll: (microProjetId?: number) => {
    return useQuery({
      queryKey: ['plan-remboursements', microProjetId],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<PLAN_REMBOURSEMENT_T[]>>('/plan-remboursements', {
          params: microProjetId ? { micro_projet_id: microProjetId } : undefined,
        })
        return data.data
      },
    })
  },
  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: Omit<PLAN_REMBOURSEMENT_T, 'id'>) => {
        const response = await axiosInstance.post('/plan-remboursements', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['plan-remboursements'] })
      },
      onError: (error) => {
        console.error(error)
      },
    })
  },
  /**
   * Enregistre l'échéancier généré côté client : pas d'endpoint bulk confirmé
   * côté backend, donc on poste chaque échéance séquentiellement et on
   * n'affiche qu'un seul toast de succès/erreur global.
   */
  useSaveEcheancier: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (rows: Omit<PLAN_REMBOURSEMENT_T, 'id'>[]) => {
        const results = []
        for (const row of rows) {
          const response = await axiosInstance.post('/plan-remboursements', row)
          results.push(response.data)
        }
        return results
      },
      onSuccess: (_, rows) => {
        queryClient.invalidateQueries({ queryKey: ['plan-remboursements'] })
        toast.success(`Échéancier enregistré : ${rows.length} échéance(s) créée(s) !`)
      },
      onError: (error) => {
        toast.error("Erreur lors de l'enregistrement de l'échéancier.")
        console.error(error)
      },
    })
  },
  useUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: Omit<PLAN_REMBOURSEMENT_T, 'id'> }) => {
        const response = await axiosInstance.put(`/plan-remboursements/${id}`, data)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['plan-remboursements'] })
        toast.success('Échéance modifiée avec succès !')
      },
      onError: (error) => {
        toast.error("Erreur lors de la modification de l'échéance.")
        console.error(error)
      },
    })
  },
  useDelete: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (id: number) => {
        await axiosInstance.delete(`/plan-remboursements/${id}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['plan-remboursements'] })
        toast.success('Échéance supprimée avec succès !')
      },
      onError: (error) => {
        toast.error("Erreur lors de la suppression de l'échéance.")
        console.error(error)
      },
    })
  },
}
