import { create } from 'zustand'

interface PendingChallenge {
  /**
   * Identifiant de l'utilisateur pour les DEUX appels du défi
   * (`/auth/send-otp` et `/auth/verify-otp`) : le backend raisonne sur l'email.
   *
   * Fourni par la RÉPONSE de `/auth/login`, et non par le formulaire : le
   * backend fait autorité, et l'écran `/2fa` ne dépend plus de ce qui a été
   * saisi (casse, espaces, alias éventuel).
   */
  email: string
  /** `has_phone` du login : le compte a un numéro exploitable par WhatsApp. */
  hasPhone: boolean
}

interface AuthFlowState {
  /** Défi en attente — aucune session ouverte tant qu'il n'est pas résolu. */
  pending?: PendingChallenge
  setPending: (challenge: PendingChallenge) => void
  clearPending: () => void
}

/**
 * État transitoire du parcours de connexion (défi OTP).
 *
 * ⚠️ VOLONTAIREMENT NON PERSISTÉ : un rafraîchissement ou un accès direct à
 * `/2fa` doit perdre le défi pour que le garde de route renvoie vers `/login`.
 * L'envelopper dans `persist` annulerait cette protection.
 */
export const useAuthFlowStore = create<AuthFlowState>()((set) => ({
  setPending: (challenge) => set({ pending: challenge }),
  clearPending: () => set({ pending: undefined }),
}))
