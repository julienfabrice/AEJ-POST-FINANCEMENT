import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { PERMISSION_T } from '@/types/permissions.types'

/**
 * Payload d'écriture pour POST/PUT /permissions.
 *
 * ⚠️ Contrairement à `PERMISSION_T` (lecture, embarqué dans GET /auth/me, où
 * `autorise` est un entier 0/1 et `acces` une chaîne "0"/"1"), la collection
 * Postman confirme que la création/modification via /permissions attend de
 * vrais booléens JS (`true`/`false`). Les deux formats ne se combinent pas :
 * ne pas réutiliser PERMISSION_T pour écrire.
 */
export interface PERMISSION_INPUT_T {
  role_id: number
  module: string
  autorise: boolean
  acces: boolean
  full_access: boolean
}

export const permissionsServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['permissions'],
      queryFn: async () => {
        const { data } = await axiosInstance.get('/permissions')
        const result = data.data || (Array.isArray(data) ? data : [])
        return result as PERMISSION_T[]
      },
    })
  },
  useGetOne: (id: number | null) => {
    return useQuery({
      queryKey: ['permissions', id],
      queryFn: async () => {
        const { data } = await axiosInstance.get(`/permissions/${id}`)
        return (data.data ?? data) as PERMISSION_T
      },
      enabled: !!id,
    })
  },
  /** Permissions d'un rôle donné — pratique pour construire une matrice rôle → modules. */
  useGetByRole: (roleId: number | null) => {
    return useQuery({
      queryKey: ['permissions', 'role', roleId],
      queryFn: async () => {
        const { data } = await axiosInstance.get('/permissions')
        const result = (data.data || (Array.isArray(data) ? data : [])) as PERMISSION_T[]
        return result.filter((p) => p.role_id === roleId)
      },
      enabled: !!roleId,
    })
  },
  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: PERMISSION_INPUT_T) => {
        const response = await axiosInstance.post('/permissions', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['permissions'] })
        toast.success('Permission créée avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la création de la permission.')
        console.error(error)
      },
    })
  },
  useUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: PERMISSION_INPUT_T }) => {
        const response = await axiosInstance.put(`/permissions/${id}`, data)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['permissions'] })
        toast.success('Permission modifiée avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la modification de la permission.')
        console.error(error)
      },
    })
  },
  useDelete: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (id: number) => {
        await axiosInstance.delete(`/permissions/${id}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['permissions'] })
        toast.success('Permission supprimée avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la suppression de la permission.')
        console.error(error)
      },
    })
  },
}