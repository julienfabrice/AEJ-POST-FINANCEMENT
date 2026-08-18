import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import type { SITUATION_MATRIMONIALE_T, API_RESPONSE_T } from '@/types'

export const useGetSituationsMatrimoniales = () => {
  return useQuery({
    queryKey: ['situations-matrimoniales'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<API_RESPONSE_T<SITUATION_MATRIMONIALE_T[]>>('/aej/situations-matrimoniale')
      return data.data
    },
  })
}
