import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import type { TYPE_EMPLOI_T, API_RESPONSE_T } from '@/types'

export const useGetTypeEmplois = () => {
  return useQuery({
    queryKey: ['type-emplois'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<API_RESPONSE_T<TYPE_EMPLOI_T[]>>('/type-emplois')
      return data.data
    },
  })
}
