import { useMutation } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      await axiosInstance.post('/logout')
    },
  })
}
