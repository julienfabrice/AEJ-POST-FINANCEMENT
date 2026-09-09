import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

export function useRejetAction() {
  const execute = async (projet: MICRO_PROJET_T) => {
    console.log('Exécution de l\'action REJET pour le projet', projet.id)
    // TODO: Implémenter la logique spécifique pour REJET
  }

  return { execute }
}
