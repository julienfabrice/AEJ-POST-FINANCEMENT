import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'

/**
 * Le `queryClient` est exposé sur le contexte du routeur pour que les gardes
 * (`beforeLoad`) puissent lire le profil via `ensureQueryData` — c'est ce qui
 * permet à `_authenticated` de valider la session avant le rendu.
 */
export interface RouterContext {
  queryClient: QueryClient
}


const isDev = import.meta.env.DEV

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
      {isDev && <TanStackRouterDevtools />}
      <Toaster />
    </>
  ),
})
