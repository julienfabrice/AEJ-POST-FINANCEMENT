import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { DECAISSEMENT_DECLARATION_T, DECAISSEMENT_DECLARATION_STATUT_T, API_RESPONSE_T } from '@/types'

export const decaissementDeclarationServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['decaissements-declarations'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<DECAISSEMENT_DECLARATION_T[]>>('/decaissements-declarations')
        return data.data
      },
    })
  },
  useGetOne: (id: number | null) => {
    return useQuery({
      queryKey: ['decaissements-declarations', id],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<DECAISSEMENT_DECLARATION_T>>(`/decaissements-declarations/${id}`)
        return data.data
      },
      enabled: !!id,
    })
  },
  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: Omit<DECAISSEMENT_DECLARATION_T, 'id'>) => {
        const response = await axiosInstance.post('/decaissements-declarations', payload)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['decaissements-declarations'] })
        toast.success('Déclaration de décaissement enregistrée avec succès !')
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
      mutationFn: async ({ id, data }: { id: number; data: Omit<DECAISSEMENT_DECLARATION_T, 'id'> }) => {
        // NB : l'API expose PUT pour la mise à jour complète ; PATCH n'est utilisé côté backend
        // que pour le changement de statut (cf. useValidate), même s'il est documenté en PUT
        // dans la collection Postman fournie.
        const response = await axiosInstance.put(`/decaissements-declarations/${id}`, data)
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['decaissements-declarations'] })
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
      mutationFn: async ({ id, statut }: { id: number; statut: DECAISSEMENT_DECLARATION_STATUT_T }) => {
        const response = await axiosInstance.put(`/decaissements-declarations/${id}`, { statut })
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['decaissements-declarations'] })
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
        await axiosInstance.delete(`/decaissements-declarations/${id}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['decaissements-declarations'] })
        toast.success('Déclaration supprimée avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la suppression de la déclaration.')
        console.error(error)
      },
    })
  },
}
