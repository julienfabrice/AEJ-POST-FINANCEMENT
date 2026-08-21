import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'
import { authServices } from '@/services/auth.services'
import { profileServices } from '@/services/profile.services'
import { useAuthStore } from '@/store/useAuthStore'
import type { CHANGE_PASSWORD_T, UPDATE_PROFILE_T } from '@/types/profile.types'
import { AUTH_ME_KEY } from './auth.hooks'


const refreshSession = async (queryClient: QueryClient) => {
  const me = await queryClient.fetchQuery({
    queryKey: AUTH_ME_KEY,
    queryFn: authServices.me,
    staleTime: 0,
  })
  useAuthStore.getState().setSession(me)
  return me
}

/**
 * Mise à jour de l'identité du compte connecté, champ par champ.
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (patch: Partial<UPDATE_PROFILE_T>) => {

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

/**
 * Changement de mot de passe du compte connecté.
 *
 * La session n'est PAS refermée : le cookie reste valide, l'utilisateur
 * continue sa navigation. On relit tout de même `/auth/me` — le backend y
 * bascule `mot_de_passe_change` à 1, ce qui met à jour la carte « Mot de
 * passe » sans rechargement.
 */
export const useChangePassword = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CHANGE_PASSWORD_T) => {
      await profileServices.changePassword(payload)
      return refreshSession(queryClient)
    },
  })
}
