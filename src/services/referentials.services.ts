import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import type { API_RESPONSE_T } from '@/types'
import { refLabel, type REF_ITEM_T } from '@/types/referentials.types'

/** Demi-heure : un référentiel ne bouge pas pendant une session de travail. */
const REFERENTIAL_STALE_TIME = 30 * 60 * 1000

/** Clés de cache — indexées par endpoint, donc partagées entre écrans. */
export const referentialsKeys = {
  all: ['referential'] as const,
  byEndpoint: (endpoint: string) => [...referentialsKeys.all, endpoint] as const,
}

/**
 * Référentiels `/aej/*`.
 */
export const referentialsServices = {
  list: async (endpoint: string): Promise<REF_ITEM_T[]> => {
    const { data } = await axiosInstance.get<API_RESPONSE_T<REF_ITEM_T[]> | REF_ITEM_T[]>(
      endpoint,
    )
    // Tolère les deux formes : enveloppe standard ou tableau nu.
    return Array.isArray(data) ? data : (data.data ?? [])
  },

  /**
   * Charge un référentiel et le met en cache PAR ENDPOINT : deux écrans qui
   * demandent `/aej/pays` partagent la même entrée, le référentiel n'est donc
   * téléchargé qu'une fois.
   */
  useGetReferential: (endpoint: string) =>
    useQuery({
      queryKey: referentialsKeys.byEndpoint(endpoint),
      queryFn: () => referentialsServices.list(endpoint),
      staleTime: REFERENTIAL_STALE_TIME,
      // Les filtres statiques passent une chaîne vide : aucun appel à faire.
      enabled: endpoint !== '',
    }),

  /** Référentiel déjà converti en options `{ value, label }` pour les listes. */
  useGetReferentialOptions: (endpoint: string) => {
    const { data, isLoading, isError } = referentialsServices.useGetReferential(endpoint)

    return {
      options: (data ?? []).map((item) => ({
        // Les FK partent en chaîne dans l'URL ; le service de liste les
        // reconvertit en entiers avant l'envoi au backend.
        value: String(item.id),
        label: refLabel(item),
      })),
      isLoading,
      isError,
    }
  },
}
