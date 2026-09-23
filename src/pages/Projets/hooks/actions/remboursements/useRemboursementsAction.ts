import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import { useProjetsStore } from '@/store/useProjetsStore'

export function useRemboursementsAction() {
  const setRemboursementsModalProjet = useProjetsStore(s => s.setRemboursementsModalProjet)

  const execute = async (projet: MICRO_PROJET_T) => {
    setRemboursementsModalProjet(projet)
  }

  return { execute }
}
