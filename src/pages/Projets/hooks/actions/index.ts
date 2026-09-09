import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

import { useAjoutPlanAffairesAction } from './useAjoutPlanAffairesAction'
import { useSoumissionAction } from './useSoumissionAction'
import { useValidationAction } from './useValidationAction'
import { useRejetAction } from './useRejetAction'
import { useRevisionAction } from './useRevisionAction'
import { useConsultationAction } from './useConsultationAction'
import { useApprobationFinaleAction } from './useApprobationFinaleAction'
import { useDecisionAction } from './useDecisionAction'

export function useProjetActions() {
  const ajoutPlanAffaires = useAjoutPlanAffairesAction()
  const soumission = useSoumissionAction()
  const validation = useValidationAction()
  const rejet = useRejetAction()
  const revision = useRevisionAction()
  const consultation = useConsultationAction()
  const approbationFinale = useApprobationFinaleAction()
  const decision = useDecisionAction()

  /**
   * Dispatche l'exécution de l'action selon son code défini dans le paramétrage workflow.
   */
  const executeAction = async (actionCode: string, projet: MICRO_PROJET_T) => {
    switch (actionCode) {
      case 'AJOUT_PLAN_AFFAIRES':
        return ajoutPlanAffaires.execute(projet)
      case 'SOUMISSION':
        return soumission.execute(projet)
      case 'VALIDATION':
        return validation.execute(projet)
      case 'REJET':
        return rejet.execute(projet)
      case 'REVISION':
        return revision.execute(projet)
      case 'CONSULTATION':
        return consultation.execute(projet)
      case 'APPROBATION_FINALE':
        return approbationFinale.execute(projet)
      case 'DECISION':
        return decision.execute(projet)
      default:
        console.warn(`Action ${actionCode} non reconnue ou non implémentée.`)
    }
  }

  return { executeAction }
}
