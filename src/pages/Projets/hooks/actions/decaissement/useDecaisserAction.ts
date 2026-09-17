import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import { useProjetsStore } from '@/store/useProjetsStore'

export function useDecaisserAction() {
  const { setDecaissementModalProjet } = useProjetsStore()

  const execute = (projet: MICRO_PROJET_T) => {
    setDecaissementModalProjet(projet)
  }

  return { execute }
}
