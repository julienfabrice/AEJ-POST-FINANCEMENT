import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import { useProjetsStore } from '@/store/useProjetsStore'

export function useTraiterAction() {
  const setTraiterModalProjet = useProjetsStore((s) => s.setTraiterModalProjet)

  const execute = async (projet: MICRO_PROJET_T) => {
    setTraiterModalProjet(projet)
  }

  return { execute }
}
