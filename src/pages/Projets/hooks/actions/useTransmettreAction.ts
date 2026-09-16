import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

export function useTransmettreAction() {
  const execute = async (projet: MICRO_PROJET_T) => {
    console.log('Exécution de l\'action TRANSMETTRE pour le projet', projet.id)
    // TODO: Implémenter la logique spécifique
  }

  return { execute }
}
