import { useMutation } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import type { LoginResponse } from '@/types'

export interface LoginCredentials {
  email: string
  mot_de_passe: string
}

// 2. Hooks TanStack Query
export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await axiosInstance.post<LoginResponse>('/login', credentials)
      return data
    },
  })
}
