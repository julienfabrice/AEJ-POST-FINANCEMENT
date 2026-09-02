import type { ICellRendererParams } from 'ag-grid-community'
import { Badge } from '@/components/ui/badge'
import { ETAT_CADRE_RESULTAT_BADGE_STYLE } from '@/types'

/**
 * Colonne « État » d'un élément du cadre — badge GRIS, quelle que soit la
 * valeur.
 *
 * ── Pourquoi un renderer local et non `BadgeCellRenderer` ──
 * Le renderer partagé renvoie `null` sur une valeur vide : la cellule serait
 * alors VIDE, indiscernable d'une colonne non rendue. Or `etat` est
 * `VARCHAR(30) NULL` et le schéma ne documente AUCUNE valeur : le cas « pas
 * d'état » sera le plus fréquent au branchement. On affiche donc un badge
 * « — », comme le fait la maquette partout où une valeur peut manquer (même
 * choix que `EtatInstallationCellRenderer` du module Suivi).
 *
 * ── Pourquoi une seule couleur ──
 * Aucune liste d'états n'étant documentée (ni ENUM, ni CHECK, ni commentaire),
 * attribuer un vert à « ACTIF » et un rouge à « CLOTURE » supposerait des
 * valeurs inventées : le premier état réellement renvoyé par l'API tomberait
 * hors de la table et perdrait sa couleur sans que personne le remarque. Le
 * gris de la palette produit (#F1F4F8 / #5A6B80) est neutre et vrai. Le jour où
 * le backend documente ses états, `ETAT_CADRE_RESULTAT_BADGE_STYLE` devient une
 * table `Record<…, string>` et ce renderer l'indexe.
 */
export const EtatCadreCellRenderer = (params: ICellRendererParams) => {
  const texte =
    typeof params.value === 'string' && params.value.trim() ? params.value.trim() : '—'

  return (
    <div className="flex h-full items-center">
      <Badge variant="secondary" className={`font-medium ${ETAT_CADRE_RESULTAT_BADGE_STYLE}`}>
        {texte}
      </Badge>
    </div>
  )
}
