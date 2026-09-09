import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

export function useDecisionAction() {
  const execute = async (projet: MICRO_PROJET_T) => {
    console.log('Exécution de l\'action DECISION pour le projet', projet.id)
    // TODO: Implémenter la logique spécifique pour DECISION
  }

  return { execute }
}
