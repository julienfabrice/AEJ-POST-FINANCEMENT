import { create } from 'zustand'

interface AuthFlowState {
  /** Utilisateur en attente de validation OTP — aucune session ouverte. */
  pendingUserId?: number
  setPending: (id: number) => void
  clearPending: () => void
}

/**
 * État transitoire du parcours de connexion (défi OTP).
 *
 * ⚠️ VOLONTAIREMENT NON PERSISTÉ : un rafraîchissement ou un accès direct à
 * `/2fa/email-otp` doit perdre `pendingUserId` pour que le garde de route
 * renvoie vers `/login`. L'envelopper dans `persist` annulerait cette protection.
 */
export const useAuthFlowStore = create<AuthFlowState>()((set) => ({
  setPending: (id) => set({ pendingUserId: id }),
  clearPending: () => set({ pendingUserId: undefined }),
}))
