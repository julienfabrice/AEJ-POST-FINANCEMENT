
import { setSessionLostHandler } from '@/constants/axiosInstance'

/**
 * Branchement de la couche HTTP sur l'application
 */
export function wireSessionBridge() {
  setSessionLostHandler(() => {
    // DÉSACTIVATION AUTHENTIFICATION : on ne fait plus rien
    // useAuthStore.getState().clearSession()
    // queryClient.clear()
    // void router.navigate({ to: ROUTES.LOGIN, replace: true })
  })
}
