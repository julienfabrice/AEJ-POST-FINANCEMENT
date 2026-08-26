import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import type { AGENCE_REGIONALE_T, API_RESPONSE_T } from '@/types'

/**
 * Référentiel en LECTURE SEULE : les agences régionales sont synchronisées
 * depuis le portail national agenceemploijeunes.ci. Volontairement pas de
 * useCreate/useUpdate/useDelete ici — il n'y a rien à créer côté AEJ.
 */
export const agenceRegionaleServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['agences-regionales'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<AGENCE_REGIONALE_T[]>>('/aej/agences-regionales')
        return data.data
      },
    })
  },
}
