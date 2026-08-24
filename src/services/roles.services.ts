import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'

export interface ROLE_T {
  id: number;
  code: string;
  libelle?: string;
  name?: string;
  description?: string;
}

export const rolesServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['roles'],
      queryFn: async () => {
        const { data } = await axiosInstance.get('/roles')
        const result = data.data || (Array.isArray(data) ? data : [])
        return result as ROLE_T[]
      },
    })
  }
}
