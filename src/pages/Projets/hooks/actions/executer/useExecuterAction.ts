import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import { useProjetsStore } from '@/store/useProjetsStore'

export function useExecuterAction() {
  const setPlanDecaissementViewerProjet = useProjetsStore(s => s.setPlanDecaissementViewerProjet)

  const execute = async (projet: MICRO_PROJET_T) => {
    // Ouvrir le modal du plan de décaissement pour que l'Agence puisse exécuter les numéros de lignes autorisés
    setPlanDecaissementViewerProjet(projet)
  }

  return { execute }
}
