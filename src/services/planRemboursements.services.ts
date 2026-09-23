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
      mutationFn: async (payload: Omit<PLAN_REMBOURSEMENT_T, 'id' | 'created_at' | 'updated_at'>) => {
        const response = await axiosInstance.post('/plan-remboursements', payload)
        return response.data.data ?? response.data // API might wrap in { data: ... }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['plan-remboursements'] })
      },
      onError: (error) => {
        console.error(error)
      },
    })
  },
  useUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: Partial<Omit<PLAN_REMBOURSEMENT_T, 'id'>> }) => {
        const response = await axiosInstance.put(`/plan-remboursements/${id}`, data)
        return response.data.data ?? response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['plan-remboursements'] })
        toast.success('Plan modifié avec succès !')
      },
      onError: (error) => {
        toast.error("Erreur lors de la modification du plan.")
        console.error(error)
      },
    })
  },
}
