import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/constants/axiosInstance'
import { toast } from 'sonner'
import type { API_RESPONSE_T } from '@/types'
import type { EMBAUCHE_T } from '@/types/suivi.types'

/**
 * Emplois créés — ressource `/embauches`.
 *
 * Champs REQUIS par l'API, relevés en live (POST vide → « The promoteur id
 * field is required. » / « The poste field is required. ») : `promoteur_id` et
 * `poste`. Les autres clés étrangères sont facultatives côté serveur.
 */

/** Charge utile de création/modification (POST/PUT `/embauches`). */
export interface EMBAUCHE_PAYLOAD_T {
  promoteur_id: number
  poste: string
  micro_projet_id?: number | null
  entreprise_id?: number | null
  type_emploi_id?: number | null
}

/**
 * Clé étrangère facultative → identifiant ou `null`.
 *
 * Les `<Select>` du dépôt initialisent leurs valeurs numériques à `0` (cf.
 * `useOrganismeForm`), or l'API applique une règle `exists` sur ces colonnes :
 * envoyer `0` déclencherait « The selected … is invalid. ». On convertit donc
 * toute valeur non sélectionnée en `null`.
 */
const toForeignKey = (value: number | null | undefined): number | null =>
  value && value > 0 ? value : null

/**
 * Normalisation avant envoi — la conversion appartient au service, pas au
 * composant (même principe que `toApiPayload` de `budgets.services.ts`).
 */
function toApiPayload(payload: EMBAUCHE_PAYLOAD_T) {
  return {
    promoteur_id: payload.promoteur_id,
    poste: payload.poste.trim(),
    micro_projet_id: toForeignKey(payload.micro_projet_id),
    entreprise_id: toForeignKey(payload.entreprise_id),
    type_emploi_id: toForeignKey(payload.type_emploi_id),
  }
}

export const embaucheServices = {
  useGetAll: () => {
    return useQuery({
      queryKey: ['embauches'],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<EMBAUCHE_T[]>>('/embauches')
        return data.data
      },
    })
  },
  useGetOne: (id: number | null) => {
    return useQuery({
      queryKey: ['embauches', id],
      queryFn: async () => {
        const { data } = await axiosInstance.get<API_RESPONSE_T<EMBAUCHE_T>>(`/embauches/${id}`)
        return data.data
      },
      enabled: !!id,
    })
  },
  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: EMBAUCHE_PAYLOAD_T) => {
        const response = await axiosInstance.post('/embauches', toApiPayload(payload))
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['embauches'] })
        toast.success('Emploi créé enregistré avec succès !')
      },
      onError: (error) => {
        toast.error("Erreur lors de l'enregistrement de l'emploi créé.")
        console.error(error)
      },
    })
  },
  useUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: EMBAUCHE_PAYLOAD_T }) => {
        const response = await axiosInstance.put(`/embauches/${id}`, toApiPayload(data))
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['embauches'] })
        toast.success('Emploi créé modifié avec succès !')
      },
      onError: (error) => {
        toast.error("Erreur lors de la modification de l'emploi créé.")
        console.error(error)
      },
    })
  },
  useDelete: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (id: number) => {
        await axiosInstance.delete(`/embauches/${id}`)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['embauches'] })
        toast.success('Emploi créé supprimé avec succès !')
      },
      onError: (error) => {
        toast.error("Erreur lors de la suppression de l'emploi créé.")
        console.error(error)
      },
    })
  },
}
