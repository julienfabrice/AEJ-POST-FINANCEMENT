import { getRouteApi } from '@tanstack/react-router'
import { useListSearch } from '@/hooks/useListSearch'
import type { PROMOTEUR_SEARCH_T } from '@/types/promoteurs.types'

/**
 * Créé au niveau module : `getRouteApi` ne dépend que de l'identifiant de
 * route, inutile de le reconstruire à chaque rendu.
 *
 * On passe par `getRouteApi` plutôt que par un import du fichier de route, ce
 * qui éviterait un cycle route → page → route.
 */
const routeApi = getRouteApi('/_authenticated/_agent/jeunes')

/** Spécialisation de `useListSearch` pour l'écran promoteurs. */
export const usePromoteursSearch = () => useListSearch<PROMOTEUR_SEARCH_T>(routeApi)
