import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { REMBOURSEMENT_DECLARATION_T, REMBOURSEMENT_DECLARATION_STATUT_T, API_RESPONSE_T } from '@/types'

export const remboursementDeclarationServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['remboursements-declarations'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<REMBOURSEMENT_DECLARATION_T[]>>('/remboursements-declarations')
        return data.data
      },
    })
  },
  useGetOne: (id: number | null) => {
    return useQuery({
      queryKey: ['remboursements-declarations', id],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<REMBOURSEMENT_DECLARATION_T>>(`/remboursements-declarations/${id}`)
        return data.data
      },
      enabled: !!id,
    })
  },
  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: Omit<REMBOURSEMENT_DECLARATION_T, 'id'>) => {
        const response = await axiosInstance.post('/remboursements-declarations', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['remboursements-declarations'] })
        toast.success('Déclaration de paiement enregistrée avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la création de la déclaration.')
        console.error(error)
      },
    })
  },
  useUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: Omit<REMBOURSEMENT_DECLARATION_T, 'id'> }) => {
        const response = await axiosInstance.put(`/remboursements-declarations/${id}`, data)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['remboursements-declarations'] })
        toast.success('Déclaration modifiée avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la modification de la déclaration.')
        console.error(error)
      },
    })
  },
  /** Fait avancer le workflow BROUILLON → SOUMIS → TRAITE (ou retour en arrière). */
  useValidate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, statut }: { id: number; statut: REMBOURSEMENT_DECLARATION_STATUT_T }) => {
        const response = await axiosInstance.patch(`/remboursements-declarations/${id}`, { statut })
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['remboursements-declarations'] })
        toast.success('Statut de la déclaration mis à jour !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la mise à jour du statut.')
        console.error(error)
      },
    })
  },
  useDelete: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (id: number) => {
        await axiosInstance.delete(`/remboursements-declarations/${id}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['remboursements-declarations'] })
        toast.success('Déclaration supprimée avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la suppression de la déclaration.')
        console.error(error)
      },
    })
  },
}
