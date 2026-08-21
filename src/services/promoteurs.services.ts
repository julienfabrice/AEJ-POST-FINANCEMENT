import { axiosInstance } from '@/constants/axiosInstance'
import type { PAGINATED_T } from '@/types'
import type { PROMOTEUR_SEARCH_T, PROMOTEUR_T } from '@/types/promoteurs.types'

/**
 * Prépare les filtres : retire les clés vides, et convertit les clés étrangères
 * en ENTIERS (elles transitent par l'URL, donc en chaînes).
 */
const toFilterParams = (filters: Record<string, unknown>) => {
  const result: Record<string, unknown> = {};
  // Transformer l'ojet en list
  const filterKeyValues = Object.entries(filters);

  for (const [key, value] of filterKeyValues) {
    if (value === undefined || value === null || value === '') {
      continue;
    }

    result[key] = key.endsWith('_id') ? Number(value) : value;
  }

  return result;
};



/**
 * Endpoint unique retenu. Les variantes `POST /promoteurs/filter` et
 * `POST /promoteurs/filter-with-projects` sont abandonnées.
 *
 * ⚠️ Deux points à surveiller avec ce choix (cf. leftover #18) :
 *  - la prise en compte des filtres par ce GET reste à confirmer ;
 *  - la relation `micro_projets` doit être renvoyée pour que la colonne
 *    « Projets » et la section « Projets » de la fiche aient du contenu.
 */
const LIST_PATH = '/promoteurs'

export interface PROMOTEURS_PAGE_T {
  rows: PROMOTEUR_T[]
  total: number
  page: number
  perPage: number
  lastPage: number
}

export const promoteursServices = {
  /**
   * Liste paginée + filtrée CÔTÉ SERVEUR.
   */
  list: async (q: PROMOTEUR_SEARCH_T): Promise<PROMOTEURS_PAGE_T> => {
    const { page, perPage, ...filters } = q

  
    const { data } = await axiosInstance.get<PAGINATED_T<PROMOTEUR_T>>(LIST_PATH, {
      params: { page, per_page: perPage, ...toFilterParams(filters) },
    })

    return {
      rows: data.data,
      total: data.total,
      page: data.current_page,
      perPage: data.per_page,
      lastPage: data.last_page,
    }
  },
}
