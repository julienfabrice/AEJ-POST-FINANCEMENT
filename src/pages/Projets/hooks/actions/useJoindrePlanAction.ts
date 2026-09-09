import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

export function useJoindrePlanAction() {
  const execute = async (projet: MICRO_PROJET_T) => {
    console.log('Exécution de l\'action JOINDRE_PLAN pour le projet', projet.id)
    // TODO: Implémenter la logique spécifique
  }

  return { execute }
}
