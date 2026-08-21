import { useQuery } from '@tanstack/react-query'
import { referentialsServices } from '@/services/referentials.services'
import { refLabel } from '@/types/referentials.types'

/** Demi-heure : un référentiel ne bouge pas pendant une session de travail. */
const REFERENTIAL_STALE_TIME = 30 * 60 * 1000

/**
 * Charge un référentiel et le met en cache par endpoint.
 */
export const useReferential = (endpoint: string) =>
  useQuery({
    queryKey: ['referential', endpoint],
    queryFn: () => referentialsServices.list(endpoint),
    staleTime: REFERENTIAL_STALE_TIME,
    // Les filtres statiques passent une chaîne vide : aucun appel à faire.
    enabled: endpoint !== '',
  })

/** Référentiel déjà converti en options `{ value, label }` pour les listes. */
export const useReferentialOptions = (endpoint: string) => {
  const { data, isLoading, isError } = useReferential(endpoint)

  return {
    options: (data ?? []).map((item) => ({
     
      value: String(item.id),
      label: refLabel(item),
    })),
    isLoading,
    isError,
  }
}
