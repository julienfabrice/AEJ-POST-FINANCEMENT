import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import type { SOUS_SECTEUR_T, API_RESPONSE_T } from '@/types'

export const useGetSousSecteurs = () => {
  return useQuery({
    queryKey: ['sous-secteurs'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<API_RESPONSE_T<SOUS_SECTEUR_T[]>>('/aej/sous-secteurs')
      return data.data
    },
  })
}
