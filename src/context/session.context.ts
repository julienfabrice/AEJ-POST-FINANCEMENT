import { createContext, useContext } from 'react'

export interface SESSION_CTX_T {
  /** Secondes restantes avant déconnexion pour inactivité. `0` = illimité. */
  remainingSeconds: number
  /** Recharge le compte à rebours (« Rester connecté »). */
  extend: () => void
  /** `false` quand `delai_inactivite_minutes` vaut 0 : aucune expiration. */
  isTracking: boolean
}

/**
 * Contexte isolé du provider
 */
export const SessionContext = createContext<SESSION_CTX_T | null>(null)

export function useSession(): SESSION_CTX_T {
  const ctx = useContext(SessionContext)
  if (!ctx) {
    throw new Error('useSession doit être utilisé à l’intérieur de <SessionProvider>.')
  }
  return ctx
}
