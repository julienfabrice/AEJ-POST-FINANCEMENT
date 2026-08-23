import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: Omit<PERSONNEL_T, 'id' | 'created_at' | 'updated_at' | 'is_active' | 'mot_de_passe_change' | 'permissions' | 'role' | 'fonction' | 'agence' | 'organisme'> & { mot_de_passe: string }) => {
        const response = await axiosInstance.post('/personnels', payload)
        return response.data
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['personnels'] })
      },
    })
  },
  useUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, payload }: { id: number; payload: Partial<Omit<PERSONNEL_T, 'id' | 'created_at' | 'updated_at' | 'is_active' | 'mot_de_passe_change' | 'permissions' | 'role' | 'fonction' | 'agence' | 'organisme'>> & { mot_de_passe?: string } }) => {
        const response = await axiosInstance.put(`/personnels/${id}`, payload)
        return response.data
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['personnels'] })
      },
    })
  },
  useDelete: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await axiosInstance.delete(`/personnels/${id}`)
        return response.data
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['personnels'] })
      },
    })
  },
  useSetupPassword: () => {
    return useMutation({
      mutationFn: async (payload: { token: string | number; password: string }) => {
        const response = await axiosInstance.post('/password/setup', payload)
        return response.data
      },
    })
  }
}
