import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import type { API_RESPONSE_T } from '@/types'

import type { OBSERVATION_T } from '@/types/observations.types'

export const observationsServices = {
  useGetByProjet: (projetId?: number) => {
    return useQuery({
      queryKey: ['observations', 'projet', projetId],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<OBSERVATION_T[]>>(`/observations?micro_projet_id=${projetId}`)
        return data.data
      },
      enabled: !!projetId
    })
  }
}
