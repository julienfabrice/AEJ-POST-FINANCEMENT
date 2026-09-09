import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

export function useRevisionAction() {
  const execute = async (projet: MICRO_PROJET_T) => {
    console.log('Exécution de l\'action REVISION pour le projet', projet.id)
    // TODO: Implémenter la logique spécifique pour REVISION
  }

  return { execute }
}
