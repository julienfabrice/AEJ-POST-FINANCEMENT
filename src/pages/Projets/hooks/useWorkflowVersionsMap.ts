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
