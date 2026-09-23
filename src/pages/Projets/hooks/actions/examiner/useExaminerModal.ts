import { useProjetsStore } from '@/store/useProjetsStore'
import { workflowServices } from '@/services/workflow'
import { workflowHistoriesServices } from '@/services/workflow-instance/histories.services'
import { useConfigStore } from '@/store/useConfigStore'
import { STATUT_PLAN } from '@/constants/PLAN_STATUSES'

export function useExaminerModal() {
  const { sigle_monnaie_pays } = useConfigStore()
  const projet = useProjetsStore(s => s.examinerModalProjet)
  const setExaminerModalProjet = useProjetsStore(s => s.setExaminerModalProjet)

  const { data: versions } = workflowServices.useGetVersions()
  const { data: allEtapeRoles } = workflowServices.useGetAllEtapeRoles()
  const { data: historiques } = workflowHistoriesServices.useGetHistories(projet?.workflow_instance?.id)

  const handleClose = () => setExaminerModalProjet(null)

  const currentStatut = projet?.plan_decaissement?.statut ?? projet?.statut ?? 'BROUILLON'
  const statutConfig = STATUT_PLAN[currentStatut] ?? { label: currentStatut, variant: 'outline' as const }

  // Calcul du workflow
  const currentVersion = versions?.find(v => v.code === projet?.workflow_instance?.workflow_version)
  const mainSteps = (currentVersion?.etapes || [])
    .filter(e => !e.parent_etape_code)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
  const currentEtapeCode = projet?.workflow_instance?.current_etape_code
  let currentIndex = mainSteps.findIndex((e) => e.code === currentEtapeCode)
  if (currentIndex === -1 && projet?.workflow_instance?.statut !== 'ACHEVE' && projet?.workflow_instance?.statut !== 'TERMINE') {
    currentIndex = 0 // Par défaut, on se met au début si non trouvé et non achevé
  }

  // Fenêtrage : on veut afficher au max 5 étapes (2 avant, la courante, 2 après)
  const MAX_VISIBLE = 5
  let visibleStartIndex = 0

  if (mainSteps.length > MAX_VISIBLE) {
    if (currentIndex <= 2) {
      visibleStartIndex = 0
    } else if (currentIndex >= mainSteps.length - 3) {
      visibleStartIndex = mainSteps.length - MAX_VISIBLE
    } else {
      visibleStartIndex = currentIndex - 2
    }
  }

  const visibleSteps = mainSteps.slice(visibleStartIndex, visibleStartIndex + MAX_VISIBLE)

  const chaineValidation = visibleSteps.length > 0 ? visibleSteps.map((step, idx) => {
    const originalIndex = visibleStartIndex + idx
    let statut: 'done' | 'current' | 'pending' = 'pending'
    if (currentIndex === -1) {
      if (projet?.workflow_instance?.statut === 'ACHEVE' || projet?.workflow_instance?.statut === 'TERMINE') {
        statut = 'done'
      }
    } else if (originalIndex < currentIndex) {
      statut = 'done'
    } else if (originalIndex === currentIndex) {
      statut = 'current'
    }

    // Chercher le premier rôle associé à cette étape
    const etapeRoles = allEtapeRoles?.filter(r => r.etape_code === step.code) || []
    const firstRoleCode = etapeRoles.length > 0 ? etapeRoles[0].role_code : undefined
    
    // On affiche le code du rôle, sinon on fallback sur le nom de l'étape
    const roleCode = firstRoleCode || step.name

    return { role: roleCode, statut, originalIndex }
  }) : []

  return {
    projet,
    sigle_monnaie_pays,
    historiques,
    allEtapeRoles,
    statutConfig,
    mainSteps,
    visibleStartIndex,
    chaineValidation,
    handleClose
  }
}
