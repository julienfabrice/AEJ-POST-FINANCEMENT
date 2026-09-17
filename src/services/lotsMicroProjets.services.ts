import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { LOT_MICRO_PROJET_T, API_RESPONSE_T } from '@/types'

export const lotsMicroProjetsServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['lots-micro-projets'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<LOT_MICRO_PROJET_T[]>>('/lots-micro-projets')
        return data.data
      },
    })
  },
  useGetOne: (id: number | null) => {
    return useQuery({
      queryKey: ['lots-micro-projets', id],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<LOT_MICRO_PROJET_T>>(`/lots-micro-projets/${id}`)
        return data.data
      },
      enabled: !!id,
    })
  },
  /** Rattache une liste de micro-projets à un lot en un seul appel : {lot_id, micro_projet_ids: [...]}. */
  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: { lot_id: number; micro_projet_ids: number[]; statut: LOT_MICRO_PROJET_T['statut'] }) => {
        const response = await axiosInstance.post('/lots-micro-projets', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['lots-micro-projets'] })
      },
      onError: (error) => {
        toast.error("Erreur lors de l'association des dossiers au lot.")
        console.error(error)
      },
    })
  },
  useUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: Partial<LOT_MICRO_PROJET_T> }) => {
        const response = await axiosInstance.put(`/lots-micro-projets/${id}`, data)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['lots-micro-projets'] })
        toast.success('Association mise à jour !')
      },
      onError: (error) => {
        toast.error("Erreur lors de la mise à jour de l'association.")
        console.error(error)
      },
    })
  },
  useDelete: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (id: number) => {
        await axiosInstance.delete(`/lots-micro-projets/${id}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['lots-micro-projets'] })
        toast.success('Dossier retiré du lot !')
      },
      onError: (error) => {
        toast.error('Erreur lors du retrait du dossier.')
        console.error(error)
      },
    })
  },
}