import { useCallback } from 'react'

/** Socle commun à toute liste paginée : le reste des champs est libre. */
export interface LIST_SEARCH_T {
  page: number
  perPage: number
}

/**
 * Surface minimale d'un `getRouteApi(...)` utilisée ici.
 */
export interface SEARCH_ROUTE_API_T<TSearch> {
  useSearch: () => TSearch
  useNavigate: () => (opts: {
    search: (prev: TSearch) => TSearch
    replace?: boolean
  }) => unknown
}

/**
 * Filtres + pagination d'une liste, stockés dans l'URL.
 */
export function useListSearch<TSearch extends LIST_SEARCH_T>(
  routeApi: SEARCH_ROUTE_API_T<TSearch>,
) {
  const search = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  /**
   * Applique un filtre et REVIENT À LA PAGE 1
   */
  const setFilter = useCallback(
    (patch: Partial<TSearch>) => {
      navigate({ search: (prev) => ({ ...prev, ...patch, page: 1 }), replace: true })
    },
    [navigate],
  )

  /** La pagination conserve les filtres et ne touche qu'à `page`. */
  const setPage = useCallback(
    (page: number) => {
      navigate({ search: (prev) => ({ ...prev, page }), replace: true })
    },
    [navigate],
  )

  /** Changer la taille de page invalide la position courante → retour page 1. */
  const setPerPage = useCallback(
    (perPage: number) => {
      navigate({ search: (prev) => ({ ...prev, perPage, page: 1 }), replace: true })
    },
    [navigate],
  )

  /**
   * Vide tous les filtres. `perPage` survit 
   */
  const resetFilters = useCallback(() => {
    navigate({
      search: (prev) => ({ page: 1, perPage: prev.perPage }) as TSearch,
      replace: true,
    })
  }, [navigate])

  return { search, setFilter, setPage, setPerPage, resetFilters }
}
