import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import { useProjetsStore } from '@/store/useProjetsStore'

export function useVisiteSuiviAction() {
  const setVisiteSuiviModalProjet = useProjetsStore(s => s.setVisiteSuiviModalProjet)

  const execute = async (projet: MICRO_PROJET_T) => {
    setVisiteSuiviModalProjet(projet)
  }

  return { execute }
}
