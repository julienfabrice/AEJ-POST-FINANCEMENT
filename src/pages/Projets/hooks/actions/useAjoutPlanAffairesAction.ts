import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

export function useAjoutPlanAffairesAction() {
  const execute = async (projet: MICRO_PROJET_T) => {
    console.log('Exécution de l\'action AJOUT_PLAN_AFFAIRES pour le projet', projet.id)
    // TODO: Implémenter la logique spécifique pour AJOUT_PLAN_AFFAIRES
  }

  return { execute }
}
