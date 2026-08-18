import { useMutation } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import type { LOGIN_RESPONSE_T } from '@/types'

export interface LOGIN_CREDENTIALS_T {
  email: string
  mot_de_passe: string
}

// 2. Hooks TanStack Query
export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: LOGIN_CREDENTIALS_T) => {
      const { data } = await axiosInstance.post<LOGIN_RESPONSE_T>('/login', credentials)
      return data
    },
  })
}
