import type { ReactNode } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import type { ModuleKey } from '@/constants/modules'
import type { PERMISSION_ACTION_T } from '@/types/auth.types'

interface PermissionGateProps {
  module: ModuleKey
  action?: PERMISSION_ACTION_T
  fallback?: ReactNode
  children: ReactNode
}

/**
 * Rend ses enfants uniquement si le droit est accordé.
 *
 *   <PermissionGate module={MODULES.PROJETS} action="c">
 *     <Button>Nouveau projet</Button>
 *   </PermissionGate>
 *
 * Ne remplace PAS le garde de route (`requireModule`) : masquer une action ne
 * protège pas l'URL correspondante.
 */
export function PermissionGate({
  module,
  action = 'v',
  fallback = null,
  children,
}: PermissionGateProps) {
  // On s'abonne au BOOLÉEN, pas au store entier : re-rendu seulement quand le
  // droit lui-même change.
  const allowed = useAuthStore((s) => s.can(module, action))
  return <>{allowed ? children : fallback}</>
}
