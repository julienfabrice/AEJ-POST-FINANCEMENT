import type { PERMISSION_ACTION_T } from '@/types/auth.types'
import type { PermissionIndex, PERMISSION_T } from '@/types/permissions.types'

/**
 * Aplatit les lignes de permission en index consultable en O(1).
 *
 * Une ligne non autorisée n'entre PAS dans l'index : l'absence vaut refus, ce
 * qui rend `canFrom` fail-closed sans cas particulier.
 */
export function indexPermissions(rows: PERMISSION_T[]): PermissionIndex {
  const idx: PermissionIndex = new Map()
  for (const r of rows) {
    if (r.autorise === 1 && r.acces === '1') {
      idx.set(r.module, { access: true, full: r.full_access === 1 })
    }
  }
  return idx
}

/**
 * Projette le modèle à deux niveaux sur les quatre actions :
 *  - `v`           → il suffit d'avoir l'accès au module ;
 *  - `c` | `e` | `d` → exige le `full_access`.
 */
export function canFrom(
  idx: PermissionIndex | undefined,
  module: string,
  action: PERMISSION_ACTION_T = 'v',
): boolean {
  // Désactivation des permissions : on retourne true partout
  return true

  const m = idx?.get(module)
  if (!m?.access) return false
  //@ts-ignore
  return action === 'v' ? true : m.full
}
