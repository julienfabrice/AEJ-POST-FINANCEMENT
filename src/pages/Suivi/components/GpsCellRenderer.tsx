import type { ICellRendererParams } from 'ag-grid-community'
import type { EXPLOITATION_T } from '@/types'

/**
 * Position GPS — « lat, lng » en police monospace atténuée.
 *
 * ARBITRAGE maquette ↔ API : la maquette stockait UNE chaîne `gps` déjà
 * concaténée ; l'API porte DEUX décimaux (`latitude`, `longitude`, sérialisés
 * en chaînes par Laravel). On garde le rendu de la maquette (mono + atténué,
 * virgule + espace) mais la concaténation se fait ici, à l'affichage.
 *
 * Une position n'a de sens que COMPLÈTE : si une seule coordonnée est
 * présente en base (ancienne saisie), on affiche « — » plutôt qu'un point
 * imaginaire.
 */
export const GpsCellRenderer = (params: ICellRendererParams<EXPLOITATION_T>) => {
  const latitude = params.data?.latitude
  const longitude = params.data?.longitude

  if (!latitude || !longitude) {
    return <span className="text-[12.5px] text-slate-500">—</span>
  }

  return (
    <span className="font-mono text-[12px] text-slate-500">
      {latitude}, {longitude}
    </span>
  )
}
