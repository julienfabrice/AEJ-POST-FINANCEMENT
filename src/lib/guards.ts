import { redirect } from '@tanstack/react-router'
import { ROUTES } from '@/constants/routes'
import type { ModuleKey } from '@/constants/modules'
import { useAuthStore } from '@/store/useAuthStore'
import type { PERMISSION_ACTION_T } from '@/types/auth.types'

/**
 * Garde de route par module, à brancher dans `beforeLoad`.
 *
 *   export const Route = createFileRoute('/_authenticated/_agent/projets')({
 *     beforeLoad: requireModule(MODULES.PROJETS),
 *     component: ProjetsPage,
 *   })
 *
 * Le garde parent `_authenticated` a déjà chargé `/auth/me` : les permissions
 * sont donc présentes avant qu'un écran ne soit rendu.
 */
export const requireModule =
  (module: ModuleKey, action: PERMISSION_ACTION_T = 'v') =>
  () => {
    if (!useAuthStore.getState().can(module, action)) {
      throw redirect({ to: ROUTES.DASHBOARD })
    }
  }
