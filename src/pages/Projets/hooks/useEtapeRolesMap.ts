import { useMemo } from 'react'
import { etapeRolesServices } from '@/services/workflow/etapeRoles.services'
import type { WORKFLOW_ETAPE_ROLE_T } from '@/types/workflow.types'

/**
 * Dictionnaire indexé par `etape_code` → liste des rôles de cette étape.
 *
 * Chargé en UNE seule requête `/workflow/etape-roles`, puis filtré côté client.
 * Évite N requêtes pour N projets dans la liste.
 *
 * Exemple :
 *   etapeRolesMap["AGRC_PRCO_2"] → [{ role_code: "CHEF_AGENCE", action: "AJOUT_PLAN_AFFAIRES" }, ...]
 */
export type EtapeRolesMap = Record<string, WORKFLOW_ETAPE_ROLE_T[]>

export function useEtapeRolesMap(): {
  etapeRolesMap: EtapeRolesMap
  isLoading: boolean
  isError: boolean
} {
  const { data: allRoles, isLoading, isError } = etapeRolesServices.useGetAllEtapeRoles()

  const etapeRolesMap = useMemo<EtapeRolesMap>(() => {
    if (!allRoles) return {}
    return allRoles.reduce<EtapeRolesMap>((acc, role) => {
      if (!acc[role.etape_code]) acc[role.etape_code] = []
      acc[role.etape_code].push(role)
      return acc
    }, {})
  }, [allRoles])

  return { etapeRolesMap, isLoading, isError }
}
