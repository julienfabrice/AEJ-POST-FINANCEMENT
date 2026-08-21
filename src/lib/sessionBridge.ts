import type { AnyRouter } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'

import { setSessionLostHandler } from '@/constants/axiosInstance'
import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/store/useAuthStore'

/**
 * Branchement de la couche HTTP sur l'application
 */
export function wireSessionBridge(router: AnyRouter, queryClient: QueryClient) {
  setSessionLostHandler(() => {
    useAuthStore.getState().clearSession()

    // Indispensable : sans ça, les données du compte précédent restent en cache
    // et réapparaissent une fraction de seconde après le login suivant.
    queryClient.clear()

    void router.navigate({ to: ROUTES.LOGIN, replace: true })
  })
}
