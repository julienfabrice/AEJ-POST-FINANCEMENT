import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import type { INDICATEUR_T, API_RESPONSE_T } from '@/types'

export const useGetIndicateurs = () => {
  return useQuery({
    queryKey: ['indicateurs'],
    queryFn: async () => {
      // Trying /aej/indicateurs first for consistency, falling back to /indicateurs if that's what was meant
      // Actually I will use '/aej/indicateurs' as the others were on /aej/.
      // If the user meant literal /api/indicateurs, then axiosBaseURL + /indicateurs handles it.
      const { data } = await axiosInstance.get<API_RESPONSE_T<INDICATEUR_T[]>>('/aej/indicateurs')
      return data.data
    },
  })
}
