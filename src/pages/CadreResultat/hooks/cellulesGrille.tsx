import type { ICellRendererParams } from 'ag-grid-community'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/helpers/age'
import { formatValeur } from '../utils/format'

/**
 * CADRE DE RÉSULTAT — les six rendus de cellule utilisés par PLUSIEURS des cinq
 * grilles du module.
 *
 * ══════════════════════════════════════════════════════════════════════
 *  CE QUI N'EST PAS ICI, ET POURQUOI
 * ══════════════════════════════════════════════════════════════════════
 * Les rendus PARTAGÉS du dépôt sont importés, jamais recopiés — c'est la règle
 * du lot. Trois d'entre eux couvrent déjà une partie des colonnes du module et
 * ne sont donc pas redéfinis ici :
 *
 *  • `ActionsCellRenderer`      (`@/pages/Referentiels/components/`) — colonne
 *    « Actions » des cinq grilles ;
 *  • `PrimaryTextCellRenderer`  (idem) — texte GRAS couleur encre non tronqué ;
 *  • `MutedTextCellRenderer`    (`@/pages/Suivi/components/`) — texte ATTÉNUÉ,
 *    avec son repli « — » et son mode tronqué à 280 px.
 *
 * ⚠️ `MutedTextCellRenderer` vient du module « Suivi » : c'est une dépendance
 * ENTRE ÉCRANS, assumée. Le dépôt en a déjà le précédent
 * (`usePersonnelsGrid` importe `StatutActifCellRenderer` de `@/pages/Unites/`),
 * et l'alternative — recopier le composant — est explicitement proscrite :
 * une copie divergerait dès la première correction du repli ou de la largeur
 * de troncature. Le fichier d'origine n'est pas modifié, seulement lu.
 *
 * ── Pourquoi ce fichier vit dans `hooks/` et non dans `components/` ──
 * Le périmètre de ce lot est `src/pages/CadreResultat/hooks/`. Ces six rendus
 * n'existent QUE pour les colonnes déclarées par les hooks de grille voisins et
 * ne sont utilisés nulle part ailleurs ; les poser ici les garde à côté de leur
 * unique appelant. Le jour où un écran hors grille en aura besoin, le
 * déplacement vers `components/` est un `git mv` et cinq imports.
 *
 * ── Règle commune : le repli « — » est PORTÉ PAR LA CELLULE ──
 * Chaque rendu affiche « — » quand la valeur est absente ou vide, comme partout
 * dans le dépôt. Ce n'est pas décoratif : la moitié des colonnes du module lit
 * des clés étrangères dont le référentiel n'est pas encore branché
 * (`referentielsCadreResultat.services.ts`), et une cellule VIDE serait
 * indiscernable d'une colonne cassée. « — » dit « pas de valeur », ce qui est
 * exactement l'information disponible.
 */

/** Repli d'affichage — cadratin, comme dans tout le dépôt. */
const REPLI = '—'

/**
 * Valeur de cellule considérée comme absente.
 *
 * La chaîne vide compte comme absente : les colonnes TEXT NULL de l'API
 * (`responsable_istr`, `source_istr`, `commentaire_suivi_istr`…) reviennent
 * indifféremment à `null` ou à `''` selon que la ligne a été créée avant ou
 * après la normalisation `toTexte` du service.
 */
const estVide = (valeur: unknown): boolean =>
  valeur === null ||
  valeur === undefined ||
  (typeof valeur === 'string' && valeur.trim() === '')

/**
 * CODE métier en badge ORANGE monospace (#FBEADE / #C85E18).
 *
 * Même rendu que le code de micro-projet de la maquette
 * (`MicroProjetCellRenderer`, module Suivi) : c'est la convention du produit
 * pour un identifiant COURT que l'utilisateur connaît par cœur — « OS1 »,
 * « S01 », « R002 ». Le monospace aligne les codes d'une ligne à l'autre, ce
 * qui rend la colonne balayable à l'œil.
 *
 * Codes couleur EN DUR et non `COLORS.orange.*` : Tailwind ne génère que les
 * classes écrites en toutes lettres dans le source (même contrainte que
 * `ETAT_CADRE_RESULTAT_BADGE_STYLE`).
 */
export const CodeBadgeCellRenderer = (params: ICellRendererParams) => (
  <div className="flex h-full items-center">
    <Badge className="shrink-0 border-0 bg-[#FBEADE] font-mono text-[11px] font-semibold text-[#C85E18] hover:bg-[#FBEADE]">
      {estVide(params.value) ? REPLI : String(params.value)}
    </Badge>
  </div>
)

/**
 * Classement / catégorie en badge GRIS (#F1F4F8 / #5A6B80).
 *
 * Sert aux colonnes qui rangent la ligne dans une famille sans porter de
 * jugement : type de niveau, niveau hiérarchique, périodicité, année. Le gris
 * est le choix de la maquette pour ce rôle — réserver la couleur aux états
 * (vert/rouge/ambre) est ce qui la rend lisible là où elle apparaît.
 *
 * ── Pourquoi pas `BadgeCellRenderer` (`@/pages/Referentiels/components/`) ──
 * Le rendu partagé retourne `null` sur une valeur vide, ce qui laisse la
 * CELLULE VIDE. Or `periodicite_iop` est NULLABLE et `annee` peut être
 * inexploitable : le cas « pas de valeur » sera fréquent, et une cellule vide
 * au milieu d'une colonne de badges se lit comme un défaut d'affichage. Même
 * arbitrage — et même justification — que `EtatCadreCellRenderer`.
 */
export const BadgeGrisCellRenderer = (params: ICellRendererParams) => (
  <div className="flex h-full items-center">
    <Badge
      variant="secondary"
      className="border-0 bg-[#F1F4F8] font-medium text-[#5A6B80] hover:bg-[#F1F4F8]"
    >
      {estVide(params.value) ? REPLI : String(params.value)}
    </Badge>
  </div>
)

/**
 * Valeur COURTE en monospace couleur encre.
 *
 * Deux usages : le code technique d'un élément du cadre (`code_cs`) et l'ordre
 * d'un niveau (`nombre_nsc`). Le monospace n'est pas un ornement — il aligne
 * verticalement des chaînes de longueur variable, seul moyen de comparer d'un
 * coup d'œil une colonne de codes ou de rangs.
 *
 * AUCUN formatage numérique n'est appliqué : `nombre_nsc` est un RANG (1, 2,
 * 3…), pas une quantité ; le grouper en milliers (« 1 000 ») serait une faute
 * de sens. Les vraies quantités passent par `ValeurNumeriqueCellRenderer`.
 */
export const MonoTextCellRenderer = (params: ICellRendererParams) => (
  <span className="font-mono text-[12.5px] text-[#131C29]">
    {estVide(params.value) ? REPLI : String(params.value)}
  </span>
)

/**
 * QUANTITÉ NUMERIC formatée à la française (« 1 250,5 »), en monospace.
 *
 * ⚠️ La valeur de la colonne doit être le NOMBRE (produit par `versNombre` dans
 * le hook de grille), pas la chaîne brute de l'API : c'est ce qui rend la
 * colonne triable numériquement. Trier « 9 » et « 10 » en tant que chaînes
 * placerait 10 avant 9. Le formatage — groupage des milliers et conservation du
 * signe — appartient à `formatValeur`, partagé avec la synthèse « Atteinte des
 * cibles » pour que les deux surfaces affichent strictement le même chiffre.
 *
 * `tabular-nums` en plus du monospace : la police du produit n'est pas
 * forcément à chasse fixe pour les chiffres, et une colonne de montants
 * désalignée est illisible.
 */
export const ValeurNumeriqueCellRenderer = (params: ICellRendererParams) => (
  <span className="font-mono text-[12.5px] font-semibold tabular-nums text-[#131C29]">
    {params.value === null || params.value === undefined
      ? REPLI
      : formatValeur(params.value as string | number)}
  </span>
)

/**
 * Texte GRAS couleur encre, TRONQUÉ sur une ligne, texte complet en infobulle.
 *
 * ── Pourquoi ce rendu ne peut pas être `PrimaryTextCellRenderer` ──
 * Le rendu partagé est bien celui du texte gras encre, et il est utilisé tel
 * quel partout où la colonne est courte. Mais son balisage est un
 * `<div class="flex …">` SANS `min-w-0` ni `truncate` : un enfant de flexbox a
 * une largeur minimale automatique égale à son contenu, si bien qu'un intitulé
 * long POUSSE hors de la colonne au lieu de s'y couper. Or
 * `intitule_indicateur_istr` est un TEXT libre, régulièrement long d'une
 * phrase entière. Ce n'est donc pas une copie du rendu partagé mais son
 * pendant contraint ; le rendu partagé reste utilisé pour les colonnes courtes.
 */
export const TexteFortTronqueCellRenderer = (params: ICellRendererParams) => {
  const texte = estVide(params.value) ? REPLI : String(params.value)
  return (
    <div className="flex h-full min-w-0 items-center">
      <span className="truncate font-semibold text-[#131C29]" title={texte}>
        {texte}
      </span>
    </div>
  )
}

/**
 * Date au format français (« 30/08/2026 »).
 *
 * ⚠️ La valeur de la colonne reste la chaîne ISO de l'API, JAMAIS la date déjà
 * formatée : trier sur « 30/08/2026 » revient à trier sur le JOUR, ce qui
 * mélange les années. C'est le rendu, et lui seul, qui traduit.
 *
 * `formatDate` (helper PARTAGÉ du dépôt) renvoie déjà « — » sur une valeur
 * absente ou invalide : le repli n'est pas réécrit ici.
 */
export const DateCellRenderer = (params: ICellRendererParams) => (
  <span className="text-[12.5px] text-[#131C29]">
    {formatDate(typeof params.value === 'string' ? params.value : null)}
  </span>
)
