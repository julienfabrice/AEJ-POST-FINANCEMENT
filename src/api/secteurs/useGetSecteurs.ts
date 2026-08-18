import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import type { SECTEUR_T, API_RESPONSE_T } from '@/types'

export const useGetSecteurs = () => {
  return useQuery({
    queryKey: ['secteurs'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<API_RESPONSE_T<SECTEUR_T[]>>('/aej/secteurs')
      return data.data
    },
  })
}
