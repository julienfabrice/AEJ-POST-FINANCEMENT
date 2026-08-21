import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { promoteursServices } from '@/services/promoteurs.services'
import type { PROMOTEUR_SEARCH_T } from '@/types/promoteurs.types'

/**
 * Liste des promoteurs, filtrée et paginée par le serveur.
 */
export const usePromoteurs = (query: PROMOTEUR_SEARCH_T) =>
  useQuery({
    queryKey: ['promoteurs', 'list', query],
    queryFn: () => promoteursServices.list(query),
    placeholderData: keepPreviousData,
  })
