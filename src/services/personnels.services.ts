import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import type { PERSONNEL_T } from '@/types/personnels.types'
import type { API_RESPONSE_T } from '@/types'

export const personnelsServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['personnels'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<PERSONNEL_T[]>>('/personnels')
        return data.data
      },
    })
  },
}
