import { useQuery, useMutation, useQueryClient, keepPreviousData, useQueries } from '@tanstack/react-query'
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
    from: number | null
    to: number | null
  }
}

export const PROJETS_SEARCH_PER_PAGE = 25

export interface PROJETS_SEARCH_PAGE_T {
  rows: MICRO_PROJET_T[]
  total: number
}

export interface PROJETS_FILTRES_T {
  statut?: string
  dispositif_id?: number | string
  secteur_id?: number | string
  agence_id?: number | string
  commune_id?: number | string
  organisme_id?: number | string
  guichet_id?: number | string
  stade_projet?: string
  type_projet?: string
  promoteur_id?: number | string
  search?: string
}

const PROJETS_COUNT_PER_PAGE = 1
const PROJETS_COUNT_STALE_TIME = 15 * 60 * 1000

export interface COUNT_BUCKET_T {
  cle: string
  label: string
  filtres: PROJETS_FILTRES_T
}

export interface COUNT_ROW_T {
  cle: string
  label: string
  n: number
}

export interface COUNTS_RESULT_T {
  rows: COUNT_ROW_T[]
  isLoading: boolean
  isError: boolean
}

const nettoyerFiltres = (
  filtres: PROJETS_FILTRES_T,
): Record<string, string | number> =>
  Object.fromEntries(
    Object.entries(filtres).filter(
      ([, v]) => v !== undefined && v !== null && v !== '',
    ),
  ) as Record<string, string | number>

const cleComptage = (filtres: Record<string, string | number>) =>
  ['projets', 'count', filtres] as const

const compter = async (filtres: Record<string, string | number>): Promise<number> => {
  const { data } = await axiosInstance.get<PROJETS_API_RESPONSE_T>('/projets', {
    params: { ...filtres, per_page: PROJETS_COUNT_PER_PAGE },
  })

  const total = data?.pagination?.total
  if (typeof total !== 'number' || !Number.isFinite(total)) {
    throw new Error("Réponse /projets sans pagination.total exploitable : le comptage n'est pas fiable.")
  }
  return total
}

export const projetsServices = {
  useGetAll: (page = 1, perPage = 20, filters: Record<string, string | undefined> = {}) => {
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

  useSearch: (term: string, enabled = true) => {
    const search = term.trim()

    return useQuery({
      queryKey: ['projets', 'search', search],
      queryFn: async (): Promise<PROJETS_SEARCH_PAGE_T> => {
        const { data } = await axiosInstance.get<PROJETS_API_RESPONSE_T>('/projets', {
          params: { search, per_page: PROJETS_SEARCH_PER_PAGE },
        })
        return { rows: data.data, total: data.pagination.total }
      },
      enabled,
      placeholderData: keepPreviousData,
    })
  },

  useCount: (filtres: PROJETS_FILTRES_T = {}, enabled = true) => {
    const clean = nettoyerFiltres(filtres)
    return useQuery({
      queryKey: cleComptage(clean),
      queryFn: () => compter(clean),
      staleTime: PROJETS_COUNT_STALE_TIME,
      enabled,
    })
  },

  useCounts: (
    buckets: COUNT_BUCKET_T[],
    filtresTransverses: PROJETS_FILTRES_T = {},
  ): COUNTS_RESULT_T => {
    const resultats = useQueries({
      queries: buckets.map((bucket) => {
        const clean = nettoyerFiltres({ ...filtresTransverses, ...bucket.filtres })
        return {
          queryKey: cleComptage(clean),
          queryFn: () => compter(clean),
          staleTime: PROJETS_COUNT_STALE_TIME,
        }
      }),
    })

    const rows = buckets.map((bucket, i) => ({
      cle: bucket.cle,
      label: bucket.label,
      n: resultats[i]?.data ?? 0,
    }))

    return {
      rows,
      isLoading: resultats.some((r) => r.isLoading),
      isError: resultats.some((r) => r.isError),
    }
  },
}
