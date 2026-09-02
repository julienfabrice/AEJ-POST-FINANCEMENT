import { useCallback, useMemo, useState } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { MODULES } from '@/constants/modules'
import { useCan } from '@/hooks/useCan'
import { cadreResultatServices } from '@/services/cadreResultat.services'
import { usePartenairesOptions } from '@/services/referentielsCadreResultat.services'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'
import { MutedTextCellRenderer } from '@/pages/Suivi/components/MutedTextCellRenderer'
import type { CADRE_RESULTAT_NOEUD_T, CADRE_RESULTAT_T } from '@/types'
import { CadreFormModal } from '../../components/CadreFormModal'
import { EtatCadreCellRenderer } from '../../components/EtatCadreCellRenderer'
import { HierarchieCellRenderer } from '../../components/HierarchieCellRenderer'
import { aplatirArbre, construireArbre } from '../../constants'
import { versLignesGrille, type LIGNE_GRILLE_T } from '../../utils/ligneGrille'
import { BadgeGrisCellRenderer, CodeBadgeCellRenderer, MonoTextCellRenderer } from '../cellulesGrille'
import { useNiveauxOptions } from '../useReferentielsInternes'

/**
 * Onglet « Cadre de résultat » — LA GRILLE HIÉRARCHIQUE, table
 * `cadres_resultat`.
 *
 * ══════════════════════════════════════════════════════════════════════
 *  CE QUI DISTINGUE CETTE GRILLE DES QUATRE AUTRES
 * ══════════════════════════════════════════════════════════════════════
 * AG Grid Community n'a pas de mode arbre (`treeData` est une fonctionnalité
 * Enterprise) et aucune dépendance nouvelle n'est autorisée. La hiérarchie
 * n'est donc portée que par DEUX choses :
 *
 *  • l'ORDRE DES LIGNES — `construireArbre()` puis `aplatirArbre()` produisent
 *    un parcours préfixe : un parent, puis tous ses descendants, puis le
 *    parent suivant ;
 *  • l'INDENTATION de la colonne « Intitulé » — `HierarchieCellRenderer` la
 *    calcule depuis la `profondeur` posée sur chaque nœud.
 *
 * Tout ce qui casserait l'ordre des lignes casse donc la LISIBILITÉ de
 * l'arborescence, et pas seulement son esthétique : des lignes indentées dont
 * le parent n'est plus au-dessus ne veulent plus rien dire. D'où les deux
 * particularités ci-dessous, qui n'ont pas d'équivalent dans les autres
 * onglets — le TRI désactivé et la RECHERCHE qui conserve les ancêtres.
 */

/** Repli d'affichage — cadratin, comme dans tout le dépôt. */
const REPLI = '—'

/**
 * Ligne de grille : le NŒUD (élément + `enfants` + `profondeur`), augmenté des
 * champs attendus par `ActionsCellRenderer` et des libellés de référentiels
 * résolus en amont (cf. `useNiveauxGrid` pour la justification).
 */
type LIGNE_CADRE_T = LIGNE_GRILLE_T<CADRE_RESULTAT_NOEUD_T> & {
  niveau_libelle: string
  partenaire_libelle: string
}

/** Champs réellement lus par l'utilisateur (cf. `useExploitationsGrid`). */
const CLES_RECHERCHE = [
  'abgrege_cs',
  'code_cs',
  'intutile_cs',
  'etat',
  'niveau_libelle',
  'partenaire_libelle',
] as const

/**
 * ⚠️ TRI DÉSACTIVÉ SUR TOUTE LA GRILLE — et ce n'est pas une facilité.
 *
 * `defaultColDef` de la page pose `sortable: true, filter: true` pour les cinq
 * onglets. Ici, les deux doivent être annulés colonne par colonne :
 *
 *  • TRIER par « Code » ou par « Partenaire » RÉORDONNE les lignes. Or
 *    l'indentation reste, elle, calculée sur la profondeur : on obtiendrait des
 *    enfants décalés de trois crans placés au-dessus de leur parent, ou
 *    séparés de lui par vingt lignes. L'écran ne dirait plus rien de vrai sur
 *    la structure — et l'utilisateur n'aurait aucun moyen de s'en apercevoir.
 *  • FILTRER par une colonne (menu d'en-tête d'AG Grid) supprime des lignes
 *    sans rien savoir de la parenté : il ferait disparaître des PARENTS en
 *    gardant leurs enfants, exactement le défaut que la recherche ci-dessous
 *    prend soin d'éviter. Le filtre d'en-tête ne peut pas être rendu
 *    « conscient de l'arbre » ; la recherche de la barre d'onglet, si.
 *
 * La colonne « Actions » porte déjà `sortable: false, filter: false` dans
 * toutes les grilles du dépôt : la constante est appliquée aux six colonnes
 * sans exception, ce qui évite d'avoir à se demander laquelle est concernée.
 */
const COLONNE_HIERARCHIQUE = { sortable: false, filter: false } as const

export function useCadresGrid(searchQuery: string) {
  const { data: fetchedData = [], isLoading, isError, error } = cadreResultatServices.useGetAll()
  const { mutate: deleteMutation } = cadreResultatServices.useDelete()
  const [editingItem, setEditingItem] = useState<CADRE_RESULTAT_T | null>(null)

  /** Abandon de l'édition — appelé par l'agrégateur au changement d'onglet. */
  const fermerEdition = useCallback(() => setEditingItem(null), [])

  const can = useCan()
  // Cf. `useNiveauxGrid` : la page est gardée par `MODULES.SUIVI`.
  const readonly = !can(MODULES.SUIVI, 'e') || !can(MODULES.SUIVI, 'd')

  /** Niveaux — référentiel INTERNE, alimenté par l'un des cinq endpoints. */
  const { options: optionsNiveaux } = useNiveauxOptions()
  const niveauxParId = useMemo(
    () => new Map(optionsNiveaux.map((option) => [option.value, option.label])),
    [optionsNiveaux],
  )

  /** Partenaires — seul référentiel EXTERNE déjà branché (`/organismes`). */
  const { options: optionsPartenaires } = usePartenairesOptions()
  const partenairesParId = useMemo(
    () => new Map(optionsPartenaires.map((option) => [option.value, option.label])),
    [optionsPartenaires],
  )

  /**
   * Liste plate de l'API → lignes ORDONNÉES par la hiérarchie, plus l'index des
   * parents dont la recherche a besoin.
   *
   * Les deux sont produits dans le MÊME `useMemo` parce qu'ils viennent du même
   * arbre : le recalculer une seconde fois pour l'index serait à la fois un
   * gaspillage et un risque de divergence si l'un des deux appels changeait.
   *
   * ⚠️ L'index des parents est construit en DESCENDANT L'ARBRE, et non en
   * relisant `parent_cs` sur les lignes. C'est indispensable :
   * `construireArbre()` NEUTRALISE les parents invalides (parent absent du lot,
   * cycle A → B → A) en remontant le nœud à la racine, mais il laisse
   * `parent_cs` intact sur l'objet. Remonter la chaîne des `parent_cs` bruts
   * pourrait donc boucler à l'infini sur une donnée cyclique — exactement ce
   * que `construireArbre` s'emploie à éviter. L'arbre, lui, est acyclique par
   * construction : le parcours ci-dessous se termine toujours.
   */
  const { lignes, parentDe } = useMemo(() => {
    const racines = construireArbre(fetchedData)

    const parents = new Map<number, number | null>()
    for (const racine of racines) parents.set(racine.id_cs, null)

    // Parcours ITÉRATIF (pile explicite), comme dans `constants.ts` : une
    // hiérarchie profonde ne doit pas pouvoir faire déborder la pile d'appels.
    const pile: CADRE_RESULTAT_NOEUD_T[] = [...racines]
    while (pile.length > 0) {
      const noeud = pile.pop()
      if (!noeud) break
      for (const enfant of noeud.enfants) {
        parents.set(enfant.id_cs, noeud.id_cs)
        pile.push(enfant)
      }
    }

    const rows: LIGNE_CADRE_T[] = versLignesGrille(
      aplatirArbre(racines),
      (element) => element.id_cs,
      // Nom cité par le toast de suppression : l'abrégé seul (« OS1 ») ne
      // permet pas de vérifier qu'on supprime la bonne ligne, l'intitulé seul
      // peut être très long. Les deux, comme dans le sélecteur de parent.
      (element) => `${element.abgrege_cs} · ${element.intutile_cs}`,
    ).map((ligne) => ({
      ...ligne,
      // Relation embarquée d'abord, référentiel ensuite : le contrat
      // d'eager-loading de l'API n'est pas connu (elle n'existe pas encore), et
      // le libellé embarqué est le plus fiable quand il est là.
      niveau_libelle:
        ligne.niveau?.libelle_nsc ?? niveauxParId.get(ligne.niveau_cs) ?? REPLI,
      partenaire_libelle:
        ligne.partenaire_cs === null
          ? REPLI
          : (partenairesParId.get(ligne.partenaire_cs) ?? REPLI),
    }))

    return { lignes: rows, parentDe: parents }
  }, [fetchedData, niveauxParId, partenairesParId])

  const columnDefs = useMemo<ColDef<LIGNE_CADRE_T>[]>(
    () => [
      {
        ...COLONNE_HIERARCHIQUE,
        field: 'abgrege_cs',
        // Coquille du schéma (`abgrege_cs` pour « abrégé ») conservée dans le
        // code, jamais à l'écran.
        headerName: 'Abrégé',
        width: 120,
        cellRenderer: CodeBadgeCellRenderer,
      },
      {
        ...COLONNE_HIERARCHIQUE,
        field: 'code_cs',
        headerName: 'Code',
        width: 120,
        cellRenderer: MonoTextCellRenderer,
      },
      {
        ...COLONNE_HIERARCHIQUE,
        field: 'intutile_cs',
        headerName: 'Intitulé',
        flex: 2,
        minWidth: 340,
        // Seule colonne à porter la structure : le rendu lit `profondeur` sur
        // la ligne pour son indentation (cf. `HierarchieCellRenderer`).
        cellRenderer: HierarchieCellRenderer,
      },
      {
        ...COLONNE_HIERARCHIQUE,
        field: 'niveau_libelle',
        headerName: 'Niveau',
        width: 180,
        cellRenderer: BadgeGrisCellRenderer,
      },
      {
        ...COLONNE_HIERARCHIQUE,
        field: 'etat',
        headerName: 'État',
        width: 150,
        cellRenderer: EtatCadreCellRenderer,
      },
      {
        ...COLONNE_HIERARCHIQUE,
        field: 'partenaire_libelle',
        headerName: 'Partenaire',
        flex: 1,
        minWidth: 200,
        cellRenderer: MutedTextCellRenderer,
      },
      {
        headerName: 'Actions',
        width: 120,
        minWidth: 120,
        sortable: false,
        filter: false,
        cellRenderer: ActionsCellRenderer,
        cellRendererParams: {
          onEdit: (row: CADRE_RESULTAT_T) => setEditingItem(row),
          onDelete: (id: number) => deleteMutation(id),
          readonly,
          readonlyMessage:
            "Vous n'avez pas les droits pour modifier ou supprimer un élément du cadre de résultat.",
        },
      },
    ],
    [deleteMutation, readonly],
  )

  /**
   * Recherche — LES ANCÊTRES DES LIGNES TROUVÉES SONT CONSERVÉS.
   *
   * ── Pourquoi un simple `fuse.search(...)` ne convient pas ici ──
   * Fuse renvoie les lignes qui correspondent, et elles seules. Sur une grille
   * plate c'est exactement ce qu'on veut ; sur celle-ci, un produit trouvé au
   * troisième niveau s'afficherait indenté de trois crans SANS son effet ni son
   * axe au-dessus. L'utilisateur verrait une ligne décalée dans le vide, sans
   * moyen de savoir à quoi elle se rattache — l'indentation deviendrait un
   * bruit visuel au lieu d'une information. Pire : deux résultats issus de
   * branches différentes se retrouveraient côte à côte, visuellement au même
   * niveau, comme s'ils étaient frères.
   *
   * On conserve donc, en plus des correspondances, TOUTE LEUR LIGNÉE
   * ASCENDANTE. Les ancêtres ne sont pas des résultats : ils sont le CONTEXTE
   * qui rend les résultats interprétables — c'est la convention de tout
   * explorateur d'arborescence filtrable.
   *
   * Les descendants, eux, ne sont PAS conservés : chercher « OS1 » doit
   * remonter l'axe, pas déplier les cent lignes qu'il contient — ce serait
   * n'avoir rien filtré du tout.
   *
   * Le résultat est produit en FILTRANT la liste déjà ordonnée, et non en
   * ré-assemblant les correspondances : l'ordre préfixe et les profondeurs sont
   * ainsi préservés tels quels, sans reconstruction possible d'un arbre faux.
   */
  const filteredData = useMemo<LIGNE_CADRE_T[]>(() => {
    const requete = searchQuery.trim()
    if (!requete || lignes.length === 0) return lignes

    const fuse = new Fuse(lignes, {
      keys: [...CLES_RECHERCHE],
      threshold: 0.3,
      ignoreLocation: true,
    })
    const correspondances = fuse.search(requete).map((resultat) => resultat.item.id_cs)
    if (correspondances.length === 0) return []

    const aConserver = new Set<number>(correspondances)
    for (const id of correspondances) {
      let parent = parentDe.get(id) ?? null
      // La remontée s'arrête sur un ancêtre DÉJÀ retenu : sa propre lignée a
      // alors été ajoutée par le passage qui l'a retenu (ou le sera par sa
      // propre itération s'il est lui-même une correspondance). L'index étant
      // acyclique par construction, la boucle se termine dans tous les cas.
      while (parent !== null && !aConserver.has(parent)) {
        aConserver.add(parent)
        parent = parentDe.get(parent) ?? null
      }
    }

    return lignes.filter((ligne) => aConserver.has(ligne.id_cs))
  }, [lignes, parentDe, searchQuery])

  const modalNode = (
    <CadreFormModal
      open={!!editingItem}
      onOpenChange={(open) => !open && setEditingItem(null)}
      initialData={editingItem}
    />
  )

  return { columnDefs, data: filteredData, isLoading, isError, error, modalNode, fermerEdition }
}
