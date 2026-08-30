import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

export interface PROJETS_API_RESPONSE_T {
  message: string
  data: MICRO_PROJET_T[]
  pagination: {
    current_page: number
    per_page: number
    total: number
    last_page: number
    from: number
    to: number
  }
}

export const projetsServices = {
  useGetAll: (page = 1, perPage = 20, filters: Record<string, string | undefined> = {}) => {
    // Nettoyer les filtres vides
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== '' && v !== 'tous_disp' && v !== 'tous_statut' && v !== 'toutes_agences')
    )

    return useQuery({
      queryKey: ['projets', page, perPage, cleanFilters],
      queryFn: async () => {
        const { data } = await axiosInstance.get<PROJETS_API_RESPONSE_T>('/projets', {
          params: { page, per_page: perPage, ...cleanFilters }
        })
        return data
      },
      // Keep previous data when fetching the next page
      placeholderData: (previousData) => previousData,
    })
  },
  useUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: Partial<MICRO_PROJET_T> }) => {
        const response = await axiosInstance.put(`/projets/${id}`, data)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projets'] })
        toast.success('Dossier mis à jour avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la mise à jour du dossier.')
        console.error(error)
      },
    })
  },
  useImputer: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, agence_id }: { id: number; agence_id: number | null }) => {
        try {
          const response = await axiosInstance.patch(`/projets/${id}`, { agence_id })
          return response.data
        } catch {
          const response = await axiosInstance.put(`/projets/${id}`, { agence_id })
          return response.data
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projets'] })
        toast.success('Dossier imputé avec succès !')
      },
      onError: (error) => {
        toast.error("Erreur lors de l'imputation du dossier.")
        console.error(error)
      },
    })
  },
}

