import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import type { API_RESPONSE_T } from '@/types'
import type { REF_ITEM_T } from '@/types/referentials.types'

export const sexeServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['sexes'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<REF_ITEM_T[]>>('/aej/sexes')
        return data.data
      },
    })
  },
}
