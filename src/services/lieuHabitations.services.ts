import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import type { LIEU_HABITATION_T, API_RESPONSE_T } from '@/types'

export const lieuHabitationServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['lieu-habitations'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<LIEU_HABITATION_T[]>>('/aej/lieu-habitations')
        return data.data
      },
    })
  },
}
