import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import { useProjetsStore } from '@/store/useProjetsStore'

export function useAutoriserAction() {
  const setPlanDecaissementViewerProjet = useProjetsStore(s => s.setPlanDecaissementViewerProjet)

  const execute = async (projet: MICRO_PROJET_T) => {
    // Ouvrir le modal du plan de décaissement pour que le Partenaire Financier puisse y autoriser les numéros de lignes
    setPlanDecaissementViewerProjet(projet)
  }

  return { execute }
}
