import { workflowServices } from '@/services/workflow'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

export function useWorkflowTab(projet: MICRO_PROJET_T) {
  const { data: versions, isLoading: versionsLoading } = workflowServices.useGetVersions()
  const { data: allEtapeRoles, isLoading: rolesLoading } = workflowServices.useGetAllEtapeRoles()

  const currentVersion = versions?.find((v) => v.code === projet?.workflow_instance?.workflow_version)
  const mainSteps = (currentVersion?.etapes || [])
    .filter((e) => !e.parent_etape_code)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  const currentEtapeCode = projet?.workflow_instance?.current_etape_code
  let currentIndex = mainSteps.findIndex((e) => e.code === currentEtapeCode)
  const isAcheve = projet?.workflow_instance?.statut === 'ACHEVE' || projet?.workflow_instance?.statut === 'TERMINE'

  if (currentIndex === -1 && !isAcheve) {
    currentIndex = 0 // Par défaut, on se met au début si non trouvé et non achevé
  }

  const isLoading = versionsLoading || rolesLoading

  return {
    mainSteps,
    currentIndex,
    isAcheve,
    isLoading,
    allEtapeRoles,
  }
}
