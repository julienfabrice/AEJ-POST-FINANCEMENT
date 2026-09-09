import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

export function useRemboursementsAction() {
  const execute = async (projet: MICRO_PROJET_T) => {
    console.log('Exécution de l\'action REMBOURSEMENTS pour le projet', projet.id)
    // TODO: Implémenter la logique spécifique
  }

  return { execute }
}
