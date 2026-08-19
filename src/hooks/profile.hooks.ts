import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'
import { authServices } from '@/services/auth.services'
import { profileServices } from '@/services/profile.services'
import { useAuthStore } from '@/store/useAuthStore'
import type { UPDATE_PROFILE_T } from '@/types/profile.types'
import { AUTH_ME_KEY } from './auth.hooks'

/**
 * Après toute écriture, on relit `/auth/me` plutôt que de faire confiance au
 * corps de la réponse : seul `/me` porte les relations chargées ET les
 * permissions. Le store est ensuite resynchronisé, ce qui rafraîchit l'en-tête
 * (nom, avatar, rôle) immédiatement.
 */
const refreshSession = async (queryClient: QueryClient) => {
  const me = await authServices.me()
  queryClient.setQueryData(AUTH_ME_KEY, me)
  useAuthStore.getState().setSession(me)
  return me
}

/**
 * Mise à jour de l'identité du compte connecté, champ par champ.
 *
 * Accepte un PATCH partiel mais l'endpoint est un `PUT` : il REMPLACE la
 * ressource. On fusionne donc systématiquement avec l'utilisateur courant,
 * sinon modifier le seul téléphone effacerait nom, prénom et email.
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (patch: Partial<UPDATE_PROFILE_T>) => {
      // Lu au moment de l'appel : la session est garantie ouverte ici
      // (l'écran vit sous le garde `_authenticated`).
      const user = useAuthStore.getState().user
      if (!user) throw new Error('Aucun utilisateur connecté.')

      const payload: UPDATE_PROFILE_T = {
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
        adresse: user.adresse,
        ...patch,
      }

      await profileServices.update(user.id, payload)
      return refreshSession(queryClient)
    },
  })
}
