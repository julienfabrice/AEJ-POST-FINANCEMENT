import { axiosInstance } from '@/constants/axiosInstance'
import type { API_RESPONSE_T } from '@/types'
import type { PERSONNEL_T } from '@/types/personnels.types'
import type { UPDATE_PROFILE_T } from '@/types/profile.types'

/**
 * Couche transport du compte connecté : une méthode = un endpoint.
 *
 * L'`id` est toujours celui de l'utilisateur connecté ; il est fourni par le
 * hook (qui le lit dans le store), pas deviné ici.
 *
 * TODO(backend) — deux endpoints restent à confirmer avant d'être câblés
 * (cf. leftover #14) :
 *   • changePassword : changement authentifié ancien → nouveau. NE PAS réutiliser
 *     `/password/reset` ni `/password/set`, qui relèvent du parcours par lien
 *     email (non authentifié).
 *   • uploadAvatar   : envoi multipart de `profile_picture`.
 */
export const profileServices = {
  /** Met à jour l'identité du compte connecté. */
  update: async (id: number, payload: UPDATE_PROFILE_T): Promise<PERSONNEL_T> => {
    const { data } = await axiosInstance.put<API_RESPONSE_T<PERSONNEL_T>>(
      `/personnels/${id}`,
      payload,
    )
    return data.data
  },
}
