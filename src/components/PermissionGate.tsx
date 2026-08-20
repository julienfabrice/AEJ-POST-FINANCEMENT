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
 */
export function PermissionGate({
  module,
  action = 'v',
  fallback = null,
  children,
}: PermissionGateProps) {

  const allowed = useAuthStore((s) => s.can(module, action))
  return <>{allowed ? children : fallback}</>
}
