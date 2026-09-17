import { useMemo } from 'react'
import { versionServices } from '@/services/workflow/versions.services'
import type { WORKFLOW_VERSION_T, WORKFLOW_ETAPE_T } from '@/types/workflow.types'

/**
 * Index des versions de workflow par leur code (ex: "AGR-V1").
 * Chaque version embarque ses étapes avec leurs rôles.
 */
export type WorkflowVersionMap = Record<string, WORKFLOW_VERSION_T>

/**
 * Charge toutes les versions de workflow une seule fois et les expose sous
 * forme d'un dictionnaire indexé par `version.code` (= workflow_instance.workflow_version).
 *
 * Usage : `map[projet.workflow_instance?.workflow_version]` → WORKFLOW_VERSION_T
 */
export function useWorkflowVersionsMap(): {
  versionsMap: WorkflowVersionMap
  isLoading: boolean
  isError: boolean
} {
  const { data: versions, isLoading, isError } = versionServices.useGetVersions()

  const versionsMap = useMemo<WorkflowVersionMap>(() => {
    if (!versions) return {}
    return Object.fromEntries(versions.map((v) => [v.code, v]))
  }, [versions])

  return { versionsMap, isLoading, isError }
}

/**
 * Retourne l'étape actuelle d'un projet à partir du dictionnaire des versions.
 */
export function getEtapeActuelle(
  versionCode: string | undefined | null,
  etapeCode: string | undefined | null,
  versionsMap: WorkflowVersionMap,
): WORKFLOW_ETAPE_T | null {
  if (!versionCode || !etapeCode) return null
  const version = versionsMap[versionCode]
  if (!version?.etapes) return null
  return version.etapes.find((e) => e.code === etapeCode) ?? null
}

/**
 * Vérifie si un rôle donné (ex: "CIP") est présent dans les rôles d'une étape
 * ET retourne les actions que ce rôle doit effectuer.
 */
export function getActionsForRole(
  etape: WORKFLOW_ETAPE_T | null,
  roleCode: string | undefined | null,
): string[] {
  if (!etape?.roles || !roleCode) return []
  return etape.roles
    .filter((r) => r.role_code === roleCode)
    .map((r) => r.action)
}

/**
 * Calcule le code de la prochaine étape à partir de la liste complète des étapes
 * d'une version de workflow, selon la logique parent/sous-étape + order.
 *
 * Règles :
 * - Les étapes racines ont `parent_etape_code === null`, triées par `order`.
 * - Les sous-étapes partagent le même `parent_etape_code`, triées par `order`.
 *
 * Algorithme :
 * 1. Si l'étape courante est une sous-étape :
 *    a. Cherche la sœur suivante (même parent, order supérieur).
 *    b. Si aucune sœur → remonte et cherche la prochaine étape racine.
 * 2. Si l'étape courante est une racine :
 *    a. Cherche la racine suivante (order supérieur).
 *    b. Si la racine suivante a des sous-étapes → retourne la 1re sous-étape.
 *    c. Si la racine suivante n'a pas de sous-étapes → retourne la racine.
 *    d. Si aucune racine suivante → retourne null (workflow terminé).
 *
 * @returns Le code de la prochaine étape, ou `null` si c'était la dernière.
 */
export function resolveNextEtape(
  allEtapes: WORKFLOW_ETAPE_T[],
  currentEtapeCode: string,
): string | null {
  if (!allEtapes.length || !currentEtapeCode) return null

  const current = allEtapes.find((e) => e.code === currentEtapeCode)
  if (!current) return null

  // ── Cas 1 : sous-étape ───────────────────────────────────────────────────
  if (current.parent_etape_code) {
    const sisters = allEtapes
      .filter((e) => e.parent_etape_code === current.parent_etape_code)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

    const nextSister = sisters.find((e) => (e.order ?? 0) > (current.order ?? 0))
    if (nextSister) return nextSister.code

    // Plus de sœur → remonter et trouver la prochaine racine à partir du parent
    return resolveNextEtape(allEtapes, current.parent_etape_code)
  }

  // ── Cas 2 : étape racine ──────────────────────────────────────────────────
  const roots = allEtapes
    .filter((e) => !e.parent_etape_code)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  const nextRoot = roots.find((e) => (e.order ?? 0) > (current.order ?? 0))
  if (!nextRoot) return null // dernière étape → workflow terminé

  // Si la prochaine racine a des sous-étapes, entrer dans la première
  const firstSubEtape = allEtapes
    .filter((e) => e.parent_etape_code === nextRoot.code)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0]

  return firstSubEtape ? firstSubEtape.code : nextRoot.code
}
