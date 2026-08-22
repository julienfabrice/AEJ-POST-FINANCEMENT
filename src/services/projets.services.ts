import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

export const projetsServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['projets'],
      queryFn: async () => {
        const { data } = await axiosInstance.get('/projets')
        return data.data as MICRO_PROJET_T[]
      },
    })
  },
}
