import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

import { useJoindrePlanAction } from './useJoindrePlanAction'
import { useValiderAction } from './useValiderAction'
import { useTransmettreAction } from './useTransmettreAction'
import { useTraiterAction } from './traiter/useTraiterAction'
import { useDecaisserAction } from './decaissement/useDecaisserAction'
import { useRemboursementsAction } from './useRemboursementsAction'
import { useVisiteSuiviAction } from './useVisiteSuiviAction'
import { useImputerAction } from './useImputerAction'
import { usePlanDecaissementAction } from './usePlanDecaissementAction'
import { useCorrigerAction } from './useCorrigerAction'
import { useExaminerAction } from './useExaminerAction'
import { useAutoriserAction } from './useAutoriserAction'
import { useExecuterAction } from './useExecuterAction'
import { usePlanConventionAction } from './usePlanConventionAction'

export function useProjetActions() {
  const joindrePlan = useJoindrePlanAction()
  const valider = useValiderAction()
  const transmettre = useTransmettreAction()
  const traiter = useTraiterAction()
  const decaisser = useDecaisserAction()
  const remboursements = useRemboursementsAction()
  const visiteSuivi = useVisiteSuiviAction()
  const imputer = useImputerAction()
  const planDecaissement = usePlanDecaissementAction()
  const corriger = useCorrigerAction()
  const examiner = useExaminerAction()
  const autoriser = useAutoriserAction()
  const executer = useExecuterAction()
  const planConvention = usePlanConventionAction()

  /**
   * Dispatche l'exécution de l'action selon son code défini dans le paramétrage workflow.
   */
  const executeAction = async (actionCode: string, projet: MICRO_PROJET_T) => {
    switch (actionCode) {
      case 'JOINDRE_PLAN':
      case 'AJOUT_PLAN_AFFAIRES':
        return joindrePlan.execute(projet)
      case 'VALIDER':
      case 'VALIDATION':
        return valider.execute(projet)
      case 'TRANSMETTRE':
      case 'TRANSMISSION':
        return transmettre.execute(projet)
      case 'TRAITER':
        return traiter.execute(projet)
      case 'DECAISSER':
        return decaisser.execute(projet)
      case 'REMBOURSEMENTS':
        return remboursements.execute(projet)
      case 'VISITE_SUIVI':
        return visiteSuivi.execute(projet)
      case 'IMPUTER':
        return imputer.execute(projet)
      case 'PLAN_DECAISSEMENT':
        return planDecaissement.execute(projet)
      case 'CORRIGER':
        return corriger.execute(projet)
      case 'EXAMINER':
        return examiner.execute(projet)
      case 'AUTORISER':
        return autoriser.execute(projet)
      case 'EXECUTER':
        return executer.execute(projet)
      case 'PLAN_CONVENTION':
        return planConvention.execute(projet)
      default:
        console.warn(`Action ${actionCode} non reconnue ou non implémentée.`)
    }
  }

  return { executeAction }
}
