import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'

export interface ROLE_T {
  id: number
  code: string
  libelle?: string
  name?: string
  description?: string
  created_at?: string
  updated_at?: string
}

export type ROLE_INPUT_T = Omit<ROLE_T, 'id' | 'created_at' | 'updated_at'>

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
  },
  useGetOne: (id: number | null) => {
    return useQuery({
      queryKey: ['roles', id],
      queryFn: async () => {
        const { data } = await axiosInstance.get(`/roles/${id}`)
        return (data.data ?? data) as ROLE_T
      },
      enabled: !!id,
    })
  },
  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: ROLE_INPUT_T) => {
        const response = await axiosInstance.post('/roles', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['roles'] })
        toast.success('Rôle créé avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la création du rôle.')
        console.error(error)
      },
    })
  },
  useUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: ROLE_INPUT_T }) => {
        const response = await axiosInstance.put(`/roles/${id}`, data)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['roles'] })
        toast.success('Rôle modifié avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la modification du rôle.')
        console.error(error)
      },
    })
  },
  useDelete: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (id: number) => {
        await axiosInstance.delete(`/roles/${id}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['roles'] })
        toast.success('Rôle supprimé avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la suppression du rôle.')
        console.error(error)
      },
    })
  },
}