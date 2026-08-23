import type { AnyRouter } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'

import { setSessionLostHandler } from '@/constants/axiosInstance'
// import { ROUTES } from '@/constants/routes'
// import { useAuthStore } from '@/store/useAuthStore'

/**
 * Branchement de la couche HTTP sur l'application
 */
export function wireSessionBridge(_router: AnyRouter, _queryClient: QueryClient) {
  setSessionLostHandler(() => {
    // DÉSACTIVATION AUTHENTIFICATION : on ne fait plus rien
    // useAuthStore.getState().clearSession()
    // queryClient.clear()
    // void router.navigate({ to: ROUTES.LOGIN, replace: true })
  })
}
