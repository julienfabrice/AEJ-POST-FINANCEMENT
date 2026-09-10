import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import type { WORKFLOW_T, API_RESPONSE_T } from '@/types'

export const workflowModelsServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['workflow', 'models'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<WORKFLOW_T[]>>('/workflow/models')
        return data.data
      },
    })
  },
}