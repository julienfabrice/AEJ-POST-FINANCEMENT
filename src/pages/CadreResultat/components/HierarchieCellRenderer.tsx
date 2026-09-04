import type { ICellRendererParams } from 'ag-grid-community'
import { CornerDownRight } from 'lucide-react'

/**
 * Colonne « Intitulé » de l'onglet « Cadre de résultat » — rend la HIÉRARCHIE
 * visible dans une grille qui, elle, est plate.
 *
 * AG Grid Community n'a pas de mode arbre (`treeData` est une fonctionnalité
 * Enterprise) et la consigne interdit toute dépendance nouvelle. La hiérarchie
 * est donc portée par deux choses, et deux seulement :
 *  • l'ORDRE des lignes — parcours préfixe produit par `aplatirArbre()` ;
 *  • l'INDENTATION de cette cellule, calculée depuis `profondeur`.
 *
 * ⚠️ L'indentation est un `padding-left` en STYLE INLINE et non une classe
 * Tailwind composée : Tailwind ne génère que les classes écrites en toutes
 * lettres dans le source, et `pl-[${n}px]` n'existerait dans aucune feuille de
 * style. Même règle que les couleurs de `BarreTaux`.
 *
 * La profondeur est BORNÉE à l'affichage : une hiérarchie très profonde (ou
 * abîmée) pousserait sinon le texte hors de la colonne, et le libellé —
 * l'information utile — deviendrait illisible. Au-delà de la borne, les lignes
 * restent visibles et gardent leur chevron ; seul le décalage cesse de croître.
 */

/** Décalage par niveau, en pixels — même pas que l'indentation des menus. */
const PAS_INDENTATION = 18

/** Profondeur au-delà de laquelle l'indentation cesse de croître (cf. en-tête). */
const PROFONDEUR_MAX_AFFICHEE = 6

interface Params extends ICellRendererParams {
  /** Injecté par la colonne : la profondeur calculée par `construireArbre()`. */
  profondeur?: number
}

export const HierarchieCellRenderer = (params: Params) => {
  // ⚠️ PAS de `return null` sur une valeur vide, contrairement aux renderers
  // génériques du dépôt : cette colonne est la SEULE à porter la structure de
  // l'arborescence. Une cellule entièrement vide donnerait une ligne de 55 px
  // sans chevron ni indentation, indiscernable d'un défaut d'affichage — alors
  // que l'élément existe bel et bien et garde ses actions. On applique donc le
  // repli « — » du module, en conservant la position de la ligne dans l'arbre.
  const intitule = typeof params.value === 'string' ? params.value.trim() : params.value
  const libelle = intitule ? String(intitule) : '—'

  // La profondeur vit sur la ligne (`CADRE_RESULTAT_NOEUD_T`), jamais sur la
  // valeur de la cellule : la lire ici évite d'avoir à la dupliquer dans un
  // `valueGetter` composite qui casserait le tri sur le seul intitulé.
  const profondeurBrute =
    typeof params.data?.profondeur === 'number' ? params.data.profondeur : 0
  const profondeur = Math.max(0, profondeurBrute)
  const decalage = Math.min(profondeur, PROFONDEUR_MAX_AFFICHEE) * PAS_INDENTATION

  return (
    <div className="flex h-full items-center gap-1.5" style={{ paddingLeft: `${decalage}px` }}>
      {/* Le chevron ne marque QUE les éléments non racines : sur une racine il
          serait un ornement, et sur toutes les lignes il annulerait le signal. */}
      {profondeur > 0 && (
        <CornerDownRight className="h-3.5 w-3.5 shrink-0 text-slate-300" aria-hidden="true" />
      )}
      <span
        className={
          // Le repli « — » reste atténué : c'est une absence de donnée, pas un
          // intitulé. Le gras des racines ne doit pas lui donner du poids.
          !intitule
            ? 'truncate text-[#8595A8]'
            : profondeur === 0
              ? 'truncate font-semibold text-[#131C29]'
              : 'truncate text-[#131C29]'
        }
        title={libelle}
      >
        {libelle}
      </span>
    </div>
  )
}
