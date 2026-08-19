import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import type { TYPE_ENTREPRISE_T, API_RESPONSE_T } from '@/types'

export const useGetTypeEntreprises = () => {
  return useQuery({
    queryKey: ['type-entreprises'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<API_RESPONSE_T<TYPE_ENTREPRISE_T[]>>('/type-entreprises')
      return data.data
    },
  })
}
