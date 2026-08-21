import { axiosInstance } from '@/constants/axiosInstance'
import type { API_RESPONSE_T } from '@/types'
import type { REF_ITEM_T } from '@/types/referentials.types'

/**
 * Transport des référentiels `/aej/*`.
 *
 * Un seul point d'accès générique : ces endpoints partagent tous la même forme
 */
export const referentialsServices = {
  list: async (endpoint: string): Promise<REF_ITEM_T[]> => {
    const { data } = await axiosInstance.get<API_RESPONSE_T<REF_ITEM_T[]> | REF_ITEM_T[]>(
      endpoint,
    )
    // Tolère les deux formes : enveloppe standard ou tableau nu.
    return Array.isArray(data) ? data : (data.data ?? [])
  },
}


