import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import type {
  DIVISION_REGIONALE_T,
  VILLE_T,
  COMMUNE_T,
  LIEU_HABITATION_T,
  API_RESPONSE_T,
} from '@/types'

// Référentiels géographiques AEJ — LECTURE SEULE, synchronisés depuis le
// portail national agenceemploijeunes.ci (voir info/schema.v2.sql). Pas de
// useCreate/useUpdate/useDelete ici : rien à créer côté AEJ pour ces tables.
const STALE_TIME = 30 * 60 * 1000 // 30 min : référentiels très stables

export const localiteServices = {
  useDivisionsRegionales: () =>
    useQuery({
      queryKey: ['localites', 'divisions-regionales'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<DIVISION_REGIONALE_T[]>>('/aej/division-regionale')
        return data.data
      },
      staleTime: STALE_TIME,
    }),
  useVilles: () =>
    useQuery({
      queryKey: ['localites', 'villes'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<VILLE_T[]>>('/aej/villes')
        return data.data
      },
      staleTime: STALE_TIME,
    }),
  useCommunes: () =>
    useQuery({
      queryKey: ['localites', 'communes'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<COMMUNE_T[]>>('/aej/communes')
        return data.data
      },
      staleTime: STALE_TIME,
    }),
  useLieuxHabitation: () =>
    useQuery({
      queryKey: ['localites', 'lieux-habitation'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<LIEU_HABITATION_T[]>>('/aej/lieu-habitations')
        return data.data
      },
      staleTime: STALE_TIME,
    }),
}
