import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import type { API_RESPONSE_T } from '@/types'
import type { ENTREPRISE_T } from '@/types/suivi.types'

/**
 * Entreprises — ressource `/entreprises`, en LECTURE SEULE ici.
 *
 * L'écran « Suivi & exploitation » ne fait qu'alimenter le select
 * « Entreprise » du formulaire des emplois créés : aucune création
 * d'entreprise ne part de ce module. Le référentiel est PETIT (2 lignes en
 * base au relevé du 30/08/2026), donc le chargement complet est acceptable —
 * contrairement à `/projets` et `/promoteurs`, qui exigent une recherche
 * serveur.
 */
export const entrepriseServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['entreprises'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<ENTREPRISE_T[]>>('/entreprises')
        return data.data
      },
    })
  },
  useGetOne: (id: number | null) => {
    return useQuery({
      queryKey: ['entreprises', id],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<ENTREPRISE_T>>(`/entreprises/${id}`)
        return data.data
      },
      enabled: !!id,
    })
  },
}
