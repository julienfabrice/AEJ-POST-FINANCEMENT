import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import type { API_RESPONSE_T, LOT_MICRO_PROJET_T } from '@/types'

export const lotsMicroProjetsServices = {
  useGetAll: (lotId: number | string | undefined) => {
    return useQuery({
      queryKey: ['lots-micro-projets', lotId],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<LOT_MICRO_PROJET_T[]>>('/lots-micro-projets', {
          params: { lot_id: lotId },
        })
        return data.data || []
      },
      enabled: !!lotId,
    })
  },
}
