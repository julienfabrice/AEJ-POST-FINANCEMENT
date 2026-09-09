import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import { toDateOnly } from '@/helpers/age'
import type { API_RESPONSE_T } from '@/types'
import type { VISITE_PHOTO_T } from '@/types/suivi.types'

/**
 * Photos de visite — ressource `/visite-photos`.
 *
 * C'est la relation qui remplace le champ texte « Pièces jointes » de la
 * maquette : celui-ci n'existe pas côté API, une visite porte des photos
 * (`{ photo_url, description, prise_le, prise_par_id }`) et rien d'autre.
 */

/**
 * Charge utile de création/modification.
 * Champs requis vérifiés en live (POST vide) : `exploitation_id`, `photo_url`.
 */
export interface VISITE_PHOTO_PAYLOAD_T {
  exploitation_id: number
  photo_url: string
  description?: string | null
  prise_le?: string | null
  prise_par_id?: number | null
}

/**
 * Normalisation avant envoi : la date de prise de vue peut arriver en ISO
 * complet (relecture) ou en « AAAA-MM-JJ » (saisie), et un champ vide doit
 * partir en `null` plutôt qu'en chaîne vide — que la règle `date` rejette.
 */
function toApiPayload(payload: VISITE_PHOTO_PAYLOAD_T) {
  return {
    exploitation_id: payload.exploitation_id,
    photo_url: payload.photo_url.trim(),
    description: payload.description?.trim() || null,
    prise_le: toDateOnly(payload.prise_le),
    // Règle `exists` côté API : 0 serait refusé.
    prise_par_id: payload.prise_par_id && payload.prise_par_id > 0 ? payload.prise_par_id : null,
  }
}

export const visitePhotoServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['visite-photos'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<VISITE_PHOTO_T[]>>('/visite-photos')
        return data.data
      },
    })
  },
  useGetOne: (id: number | null) => {
    return useQuery({
      queryKey: ['visite-photos', id],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<VISITE_PHOTO_T>>(`/visite-photos/${id}`)
        return data.data
      },
      enabled: !!id,
    })
  },
  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: VISITE_PHOTO_PAYLOAD_T) => {
        const response = await axiosInstance.post('/visite-photos', toApiPayload(payload))
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['visite-photos'] })
        // La photo est portée par un rapport : sa liste embarquée change aussi.
        queryClient.invalidateQueries({ queryKey: ['exploitations'] })
        toast.success('Photo de visite ajoutée avec succès !')
      },
      onError: (error) => {
        toast.error("Erreur lors de l'ajout de la photo de visite.")
        console.error(error)
      },
    })
  },
  useUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: VISITE_PHOTO_PAYLOAD_T }) => {
        const response = await axiosInstance.put(`/visite-photos/${id}`, toApiPayload(data))
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['visite-photos'] })
        queryClient.invalidateQueries({ queryKey: ['exploitations'] })
        toast.success('Photo de visite modifiée avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la modification de la photo de visite.')
        console.error(error)
      },
    })
  },
  useDelete: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (id: number) => {
        await axiosInstance.delete(`/visite-photos/${id}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['visite-photos'] })
        queryClient.invalidateQueries({ queryKey: ['exploitations'] })
        toast.success('Photo de visite supprimée avec succès !')
      },
      onError: (error) => {
        toast.error('Erreur lors de la suppression de la photo de visite.')
        console.error(error)
      },
    })
  },
}
