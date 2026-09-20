import { useAuthStore } from '@/store/useAuthStore'
import { workflowInstancesServices } from '@/services/workflowInstances.services'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import { useWorkflowVersionsMap, resolveNextEtape } from './useWorkflowVersionsMap'

interface AdvanceWorkflowParams {
  /** Le projet dont on veut avancer le workflow */
  projet: MICRO_PROJET_T
  /** Le code de l'action effectuée (ex: 'JOINDRE_PLAN', 'VALIDER') */
  action: string
  /** Commentaire / observation optionnel à enregistrer dans l'historique */
  comment?: string
}

/**
 * Hook générique pour faire avancer le workflow d'un projet après une action métier.
 *
 * Enchaîne deux appels API :
 * 1. POST /workflow-instances/histories — audit trail de l'action
 * 2. PATCH /workflow-instances/{id}    — mise à jour de l'étape courante
 *
 * La prochaine étape est résolue ainsi (priorité décroissante) :
 *   1. `next_etape_code` fourni par l'API s'il est non-null.
 *   2. Calcul front via `resolveNextEtape` à partir de la définition du workflow.
 *   3. `null` → dernière étape, workflow marqué TERMINE.
 */
export function useAdvanceWorkflow() {
  const user = useAuthStore((s) => s.user)
  const createHistory = workflowInstancesServices.useCreateHistory()
  const patchInstance = workflowInstancesServices.usePatchInstance()
  const { versionsMap } = useWorkflowVersionsMap()

  const advance = async ({ projet, action, comment }: AdvanceWorkflowParams) => {
    const instance = projet.workflow_instance
    if (!instance) {
      console.warn('[useAdvanceWorkflow] Aucune instance workflow sur ce projet.', projet.id)
      return
    }
    if (!user) {
      console.warn('[useAdvanceWorkflow] Aucun utilisateur connecté.')
      return
    }

    const roleCode = user.role?.code ?? ''

    // ── Résolution de la prochaine étape ─────────────────────────────────────
    // Priorité 1 : valeur fournie par le backend
    // Priorité 2 : calcul front depuis la définition du workflow
    const version = versionsMap[instance.workflow_version]
    const nextEtapeCode: string | null =
      instance.next_etape_code !== null && instance.next_etape_code !== undefined
        ? instance.next_etape_code
        : resolveNextEtape(version?.etapes ?? [], instance.current_etape_code)

    const isLastStep = nextEtapeCode === null

    // 1. Enregistrement de l'historique
    await createHistory.mutateAsync({
      workflow_instance_id: instance.id,
      etape_code: instance.current_etape_code,
      role_code: roleCode,
      acted_by: user.id,
      action,
      comment: comment || null,
    })

    // 2. Mise à jour de l'instance
    await patchInstance.mutateAsync({
      instanceId: instance.id,
      patch: {
        current_etape_code: nextEtapeCode,
        next_etape_code: null,
        statut: isLastStep ? 'TERMINE' : 'EN_COURS',
        completed_at: isLastStep ? new Date().toISOString() : null,
      },
    })
  }

  return {
    advance,
    isAdvancing: createHistory.isPending || patchInstance.isPending,
  }
}
