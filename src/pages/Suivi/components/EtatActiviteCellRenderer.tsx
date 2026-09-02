import type { ICellRendererParams } from 'ag-grid-community'
import { Badge } from '@/components/ui/badge'
import {
  ETAT_ACTIVITE_BADGE_STYLES,
  ETAT_ACTIVITE_LABELS,
  type ETAT_ACTIVITE_T,
  type EXPLOITATION_T,
} from '@/types'

/**
 * État de l'activité — badge COLORÉ (vert / bleu / rouge).
 *
 * Pourquoi un renderer local plutôt que `BadgeCellRenderer` : ce dernier ne
 * rend qu'un badge gris et n'accepte pas de couleur. La couleur porte ici
 * l'information (une exploitation sinistrée doit sauter aux yeux), on lit donc
 * les tables `ETAT_ACTIVITE_*` de `@/types` — convention du
 * `DecaissementStatutCellRenderer`.
 *
 * ARBITRAGE maquette ↔ API : la maquette proposait QUATRE états, dont
 * « En difficulté » (ambre). L'ENUM de l'API n'en accepte que TROIS. La valeur
 * refusée par l'API ne figure ni ici, ni dans le select du formulaire.
 */
export const EtatActiviteCellRenderer = (params: ICellRendererParams<EXPLOITATION_T>) => {
  // On lit la valeur BRUTE sur la ligne, pas `params.value` : la colonne expose
  // le libellé français au tri et au filtre, mais la couleur se choisit sur
  // l'ENUM.
  const etat: ETAT_ACTIVITE_T | null | undefined = params.data?.etat_activite

  // Valeur inconnue (ENUM élargi côté serveur sans mise à jour du front) :
  // on affiche « — » plutôt qu'un badge dont on ne saurait pas quoi dire.
  if (!etat || !(etat in ETAT_ACTIVITE_LABELS)) {
    return <span className="text-[12.5px] text-slate-500">—</span>
  }

  return (
    <div className="flex h-full items-center">
      <Badge className={ETAT_ACTIVITE_BADGE_STYLES[etat]}>{ETAT_ACTIVITE_LABELS[etat]}</Badge>
    </div>
  )
}
