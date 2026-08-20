import { axiosInstance } from '@/constants/axiosInstance'
import type { API_RESPONSE_T } from '@/types'
import type { PERSONNEL_T } from '@/types/personnels.types'
import type { CHANGE_PASSWORD_T, UPDATE_PROFILE_T } from '@/types/profile.types'

/**
 * ⚠️ CHEMIN PROVISOIRE — à confirmer (cf. leftover #14).
 *
 * Isolé dans une constante : le jour où le backend tranche, c'est la seule
 * ligne à changer, avec éventuellement les noms de champs de `CHANGE_PASSWORD_T`.
 * NE PAS pointer vers `/password/setup` ni `/password/reset` : ceux-là relèvent
 * du parcours par lien email, sans session.
 */
const CHANGE_PASSWORD_PATH = '/password/change'


export const profileServices = {
  /** Met à jour l'identité du compte connecté. */
  update: async (id: number, payload: UPDATE_PROFILE_T): Promise<PERSONNEL_T> => {
    const { data } = await axiosInstance.put<API_RESPONSE_T<PERSONNEL_T>>(
      `/personnels/${id}`,
      payload,
    )
    return data.data
  },

  /**
   * Changement de mot de passe par l'utilisateur CONNECTÉ (ancien → nouveau).
   * La session reste ouverte : le cookie n'est pas invalidé côté serveur.
   */
  changePassword: async (payload: CHANGE_PASSWORD_T): Promise<void> => {
    await axiosInstance.post(CHANGE_PASSWORD_PATH, payload)
  },
}
