import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { TABLEAU_AMORTISSEMENT_T, API_RESPONSE_T } from '@/types'

export const tableauAmortissementServices = {
  useGetAll: (planRemboursementId?: number) => {
    return useQuery({
      queryKey: ['tableau-amortissements', planRemboursementId],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<TABLEAU_AMORTISSEMENT_T[]>>('/tableau-amortissements', {
          params: planRemboursementId ? { plan_remboursement_id: planRemboursementId } : undefined,
        })
        return data.data
      },
    })
  },
  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: Omit<TABLEAU_AMORTISSEMENT_T, 'id' | 'created_at' | 'updated_at'>) => {
        const response = await axiosInstance.post('/tableau-amortissements', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tableau-amortissements'] })
      },
      onError: (error) => {
        console.error(error)
      },
    })
  },
  useUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: Partial<TABLEAU_AMORTISSEMENT_T> }) => {
        const response = await axiosInstance.put(`/tableau-amortissements/${id}`, data)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tableau-amortissements'] })
      },
      onError: (error) => {
        console.error(error)
      },
    })
  },
  useSaveEcheancier: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (rows: Omit<TABLEAU_AMORTISSEMENT_T, 'id' | 'created_at' | 'updated_at'>[]) => {
        const results = []
        for (const row of rows) {
          const response = await axiosInstance.post('/tableau-amortissements', row)
          results.push(response.data)
        }
        return results
      },
      onSuccess: (_, rows) => {
        queryClient.invalidateQueries({ queryKey: ['tableau-amortissements'] })
        toast.success(`Échéancier enregistré : ${rows.length} échéance(s) créée(s) !`)
      },
      onError: (error) => {
        toast.error("Erreur lors de l'enregistrement de l'échéancier.")
        console.error(error)
      },
    })
  },
}
