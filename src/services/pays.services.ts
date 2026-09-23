import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import type { PAYS_T, API_RESPONSE_T } from '@/types'

export const paysServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['pays'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<PAYS_T[]>>('/aej/pays')
        return data.data
      },
    })
  },
}
