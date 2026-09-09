import type { ICellRendererParams } from 'ag-grid-community'
import { BarreTaux } from '../UI/BarreTaux'

/**
 * Colonne « Taux d'atteinte » de l'onglet « Cibles annuelles ».
 *
 * Simple adaptateur AG Grid → `BarreTaux` : la barre elle-même est un composant
 * d'UI réutilisable (elle sert aussi hors grille), et le renderer n'a d'autre
 * rôle que de lui passer la valeur de la cellule.
 *
 * ⚠️ La valeur de la colonne est le TAUX DÉJÀ CALCULÉ (`valueGetter` du hook de
 * grille), et non le couple réalisé/cible. C'est ce qui rend la colonne
 * TRIABLE et FILTRABLE sur ce que l'utilisateur voit : trier sur un objet
 * composite ne produirait aucun ordre intelligible.
 *
 * `null` = taux non calculable (cible nulle ou absente) ; `BarreTaux` affiche
 * alors « — » plutôt qu'une barre vide, qui se lirait comme un 0 %.
 */
export const TauxAtteinteCellRenderer = (params: ICellRendererParams) => (
  <BarreTaux taux={typeof params.value === 'number' ? params.value : null} />
)
