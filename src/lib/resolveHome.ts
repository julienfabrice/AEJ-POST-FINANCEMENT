import { ROUTES, type AppRoute } from '@/constants/routes'
import type { PERSONNEL_T } from '@/types/personnels.types'

/**
 * Rôle → écran d'atterrissage après connexion.
 *
 * C'est le SEUL usage du rôle en dehors du choix de l'arbre de routes : il ne
 * donne aucun droit, il choisit juste où l'on arrive. Les accès, eux, sont
 * gardés par `can()` / `requireModule`.
 */
const HOME_BY_ROLE: Record<string, AppRoute> = {
  PF: ROUTES.PF_ESPACE,
  BENEF: ROUTES.BENEF_DASHBOARD,
}

const DEFAULT_HOME: AppRoute = ROUTES.DASHBOARD

export const resolveHome = (user?: PERSONNEL_T): AppRoute => {
  const roleCode = user?.role?.code
  if (!roleCode) return DEFAULT_HOME
  return HOME_BY_ROLE[roleCode] ?? DEFAULT_HOME
}
