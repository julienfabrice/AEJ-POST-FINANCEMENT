import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import { useProjetsStore } from '@/store/useProjetsStore'

export function usePlanDecaissementAction() {
  const setPlanDecaissementModalProjet = useProjetsStore(s => s.setPlanDecaissementModalProjet)
  
  const execute = async (projet: MICRO_PROJET_T) => {
    setPlanDecaissementModalProjet(projet)
  }

  return { execute }
}
