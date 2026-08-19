import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authServices } from '@/services/auth.services'
import { useAuthFlowStore } from '@/store/useAuthFlowStore'
import { useAuthStore } from '@/store/useAuthStore'
import type {
  LOGIN_CREDENTIALS_T,
  OTP_METHOD_T,
  PASSWORD_LINK_MODE_T,
  SET_PASSWORD_PAYLOAD_T,
} from '@/types/auth.types'

/** Clé de cache du profil — partagée avec le garde de route (`ensureQueryData`). */
export const AUTH_ME_KEY = ['auth', 'me'] as const

/**
 * Le profil authentifié — source de vérité de la session (le cookie part seul).
 * Monté au chargement par le garde `_authenticated` ; un 401 est intercepté par
 * l'instance axios (session vidée + retour /login).
 */
export const useMe = () =>
  useQuery({
    queryKey: AUTH_ME_KEY,
    queryFn: authServices.me,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

/**
 * Connexion cookie (Sanctum SPA). Deux issues, portées par ce hook :
 *
 *  - `otpRequired` → aucune session ouverte, on mémorise l'utilisateur en
 *                    attente et l'écran OTP prend le relais ;
 *  - sinon         → session ouverte, accès normal.
 *
 * La navigation reste à l'appelant (`useLoginForm`) : ce hook ne connaît pas les
 * routes, il expose le résultat normalisé.
 */
export const useLogin = () => {
  const setSession = useAuthStore((s) => s.setSession)
  const setPending = useAuthFlowStore((s) => s.setPending)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (credentials: LOGIN_CREDENTIALS_T) => {
      const result = await authServices.login(credentials)

      // Défi OTP : surtout NE PAS ouvrir la session — le second facteur n'a pas
      // encore été validé, le garde de route doit continuer à tout fermer.
      if (result.otpRequired) return result

      const user = await authServices.me()
      queryClient.setQueryData(AUTH_ME_KEY, user)
      setSession(user)
      return result
    },
    onSuccess: (result) => {
      // L'email vient de la RÉPONSE du backend, pas du formulaire : c'est lui
      // qui fait autorité pour la suite du défi.
      if (result.otpRequired) {
        setPending({ email: result.email, hasPhone: result.hasPhone })
      }
    },
  })
}

/**
 * Validation du code à 6 chiffres. C'est ICI que la session s'ouvre : le second
 * facteur vient d'être validé.
 */
export const useVerifyOtp = () => {
  const setSession = useAuthStore((s) => s.setSession)
  const clearPending = useAuthFlowStore((s) => s.clearPending)
  const queryClient = useQueryClient()

  return useMutation({
    // `mode` = le canal réellement utilisé pour l'envoi ; le backend l'exige
    // pour retrouver le code émis.
    mutationFn: async ({ code, mode }: { code: string; mode: OTP_METHOD_T }) => {
      const pending = useAuthFlowStore.getState().pending
      if (!pending) throw new Error('Aucune connexion en attente.')

      await authServices.verifyOtp({ code, email: pending.email, mode })
      const user = await authServices.me()
      queryClient.setQueryData(AUTH_ME_KEY, user)
      setSession(user)
      return user
    },
    onSuccess: () => clearPending(),
  })
}

/**
 * Envoi (ou renvoi) du code sur le canal choisi. Le même hook sert au premier
 * envoi — déclenché par le choix de la méthode — et aux renvois ultérieurs.
 */
export const useSendOtp = () =>
  useMutation({
    mutationFn: async (mode: OTP_METHOD_T) => {
      const pending = useAuthFlowStore.getState().pending
      if (!pending) throw new Error('Aucune connexion en attente.')
      await authServices.sendOtp(pending.email, mode)
    },
  })

/**
 * Écran 1 — demande d'un lien de réinitialisation (compte existant uniquement).
 * Pas d'équivalent « première connexion » : le lien d'activation part à la
 * création du compte, côté backend.
 */
export const useResetLinkMutation = () =>
  useMutation({
    mutationFn: (email: string) => authServices.requestResetLink(email),
  })

/**
 * Écran 2 — définition effective du mot de passe, à partir du couple
 * `uid` / `token` extrait du lien. Aucune session n'est ouverte : l'utilisateur
 * repart de l'écran de connexion.
 */
export const useResetPasswordMutation = (mode: PASSWORD_LINK_MODE_T) =>
  useMutation({
    // Deux endpoints distincts — le `mode` porté par le lien choisit lequel.
    mutationFn: (payload: SET_PASSWORD_PAYLOAD_T) =>
      mode === 'setup' ? authServices.setPassword(payload) : authServices.resetPassword(payload),
  })

/** Déconnexion : invalide la session serveur, puis purge le cache client. */
export const useLogout = () => {
  const clearSession = useAuthStore((s) => s.clearSession)
  const clearPending = useAuthFlowStore((s) => s.clearPending)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authServices.logout,
    // `onSettled` : même si l'appel échoue (cookie déjà expiré), on nettoie.
    onSettled: () => {
      clearSession()
      clearPending()
      queryClient.clear()
    },
  })
}
