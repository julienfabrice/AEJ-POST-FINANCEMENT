import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
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
}
