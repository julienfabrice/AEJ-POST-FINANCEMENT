import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import type { PIECE_IDENTITE_T, API_RESPONSE_T } from '@/types'

export const useGetPiecesIdentites = () => {
  return useQuery({
    queryKey: ['pieces-identites'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<API_RESPONSE_T<PIECE_IDENTITE_T[]>>('/aej/types-pieces-identites')
      return data.data
    },
  })
}
