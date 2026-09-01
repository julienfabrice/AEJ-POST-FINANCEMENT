import { useCallback, useMemo, useState } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { MODULES } from '@/constants/modules'
import { useCan } from '@/hooks/useCan'
import { cibleIndicateurServices, suiviIndicateurServices } from '@/services/cadreResultat.services'
import {
  useProgrammesOptions,
  useUnitesGestionOptions,
} from '@/services/referentielsCadreResultat.services'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'
import { PrimaryTextCellRenderer } from '@/pages/Referentiels/components/PrimaryTextCellRenderer'
import { MutedTextCellRenderer } from '@/pages/Suivi/components/MutedTextCellRenderer'
import type { CIBLE_INDICATEUR_T } from '@/types'
import { CibleFormModal } from '../../components/CibleFormModal'
import { TauxAtteinteCellRenderer } from '../../components/TauxAtteinteCellRenderer'
import { anneeDe, tauxAtteinte, versNombre } from '../../utils/format'
import { versLignesGrille, type LIGNE_GRILLE_T } from '../../utils/ligneGrille'
import { BadgeGrisCellRenderer, ValeurNumeriqueCellRenderer } from '../cellulesGrille'
import { useIndicateursOptions } from '../useReferentielsInternes'

/**
 * Onglet « Cibles annuelles » — table `cibles_indicateur_cadre_resultat`.
 *
 * ⚠️ DEUX COLONNES NE S'AFFICHENT PAS TELLES QU'ELLES ARRIVENT :
 *
 *  • `annee` est une colonne DATE (« 2019-01-01 ») alors qu'elle porte un
 *    EXERCICE. `anneeDe()` en extrait les quatre premiers caractères sans
 *    construire de `Date` — un « 2019-01-01T00:00:00Z » interprété en heure
 *    locale négative basculerait sur 2018 et l'exercice changerait d'année à
 *    l'écran. La valeur de la colonne est donc le NOMBRE 2019, ce qui la rend
 *    aussi triable dans l'ordre chronologique.
 *  • `valeur_cible_indcateur_istr` est un NUMERIC que Laravel sérialise en
 *    CHAÎNE : trié tel quel, « 9 » passerait après « 10 ». La valeur de la
 *    colonne est donc le nombre produit par `versNombre`, et c'est le rendu
 *    qui le met en forme.
 *
 * ⚠️ `code_indicateur_istr` est ici un ENTIER pointant vers
 * `indicateurs_cadre_resultat.id_indicateur_str`, et NON le code textuel
 * « R002 » de la table des indicateurs, qui porte pourtant le même nom. C'est
 * le piège de nommage le plus coûteux du schéma : `useIndicateursOptions`
 * indexe bien sur la clé primaire entière.
 *
 * ══════════════════════════════════════════════════════════════════════
 *  LA COLONNE « TAUX D'ATTEINTE » SE CALCULE PAR INDICATEUR × EXERCICE,
 *  PAS LIGNE À LIGNE — et c'est le seul calcul exact possible ici
 * ══════════════════════════════════════════════════════════════════════
 * Une ligne de cet onglet est une cible (indicateur, programme, UG, année) ;
 * une réalisation, elle, ne porte QUE (indicateur, date, UG) — `code_programme`
 * n'est même pas déclaré dans la table des suivis (cf. l'en-tête de
 * `SUIVI_INDICATEUR_T`). Le réalisé n'est donc PAS ventilable par programme :
 * rapporter le cumul entier des réalisations à la cible d'UNE ligne gonflerait
 * mécaniquement le taux de chacune dès qu'un indicateur a plusieurs cibles pour
 * le même exercice.
 *
 * Les DEUX membres du rapport sont donc cumulés sur le MÊME périmètre
 * (indicateur × exercice), exactement comme dans `UI/OngletAtteinte` : le taux
 * affiché ici est, au chiffre près, celui de l'onglet de synthèse — deux écrans
 * du même module ne peuvent pas se contredire. Conséquence assumée : les
 * plusieurs lignes d'un même indicateur pour un même exercice portent le MÊME
 * taux, puisque c'est une propriété de l'exercice et non de la ligne. Le
 * `headerTooltip` de la colonne le dit à l'utilisateur.
 *
 * Cible cumulée nulle, absente, ou exercice illisible → `null`, et
 * `BarreTaux` affiche « — » : jamais « 0 % », qui se lirait comme une
 * contre-performance là où il n'y a rien à comparer.
 */

/**
 * Clé de regroupement « indicateur × exercice ».
 *
 * Chaîne et non tuple : une `Map` compare ses clés objet par IDENTITÉ, deux
 * tuples `[3, 2024]` distincts ne se retrouveraient jamais. Le séparateur `|`
 * ne peut apparaître dans aucun des deux membres (deux entiers).
 */
function cleExercice(idIndicateur: number, annee: number): string {
  return `${idIndicateur}|${annee}`
}

/** Repli d'affichage — cadratin, comme dans tout le dépôt. */
const REPLI = '—'

/**
 * Ligne de grille : la cible, augmentée des champs du rendu d'actions, des
 * libellés de référentiels et des DEUX valeurs converties décrites ci-dessus.
 * Tout est résolu en amont pour que tri, filtre et recherche portent sur ce que
 * l'utilisateur voit (cf. `useNiveauxGrid`).
 */
type LIGNE_CIBLE_T = LIGNE_GRILLE_T<CIBLE_INDICATEUR_T> & {
  indicateur_libelle: string
  programme_libelle: string
  unite_gestion_libelle: string
  annee_valeur: number | null
  valeur_cible: number
  /**
   * Taux DÉJÀ CALCULÉ (cf. en-tête), `null` s'il ne l'est pas. Porté par la
   * ligne plutôt que par un `valueGetter` : la colonne reste triable et
   * filtrable sur ce que l'utilisateur voit, et le calcul n'est pas refait à
   * chaque rendu de cellule.
   */
  taux_atteinte: number | null
}

/**
 * Champs réellement lus par l'utilisateur (cf. `useExploitationsGrid`).
 *
 * `annee_valeur` en fait partie bien qu'elle soit numérique : chercher « 2024 »
 * dans la barre de recherche est le réflexe naturel sur un onglet d'exercices.
 */
const CLES_RECHERCHE = [
  'indicateur_libelle',
  'annee_valeur',
  'programme_libelle',
  'unite_gestion_libelle',
] as const

export function useCiblesGrid(searchQuery: string) {
  const { data: fetchedData = [], isLoading, isError, error } = cibleIndicateurServices.useGetAll()
  /**
   * Réalisations — lues UNIQUEMENT pour la colonne de taux.
   *
   * Ni `isLoading` ni `isError` ne sont remontés : l'onglet reste celui des
   * CIBLES, et une lecture de suivis en retard ou en échec ne doit pas vider la
   * grille ni afficher un écran d'erreur pour une colonne annexe. Elle rend
   * alors « — », comme n'importe quel taux incalculable. La requête est
   * mutualisée par TanStack Query avec celles de l'onglet « Réalisations » et
   * de la synthèse : même clé, une seule requête.
   */
  const { data: suivis = [] } = suiviIndicateurServices.useGetAll()
  const { mutate: deleteMutation } = cibleIndicateurServices.useDelete()
  const [editingItem, setEditingItem] = useState<CIBLE_INDICATEUR_T | null>(null)

  /** Abandon de l'édition — appelé par l'agrégateur au changement d'onglet. */
  const fermerEdition = useCallback(() => setEditingItem(null), [])

  const can = useCan()
  // Cf. `useNiveauxGrid` : la page est gardée par `MODULES.SUIVI`.
  const readonly = !can(MODULES.SUIVI, 'e') || !can(MODULES.SUIVI, 'd')

  const { options: optionsIndicateurs } = useIndicateursOptions()
  const indicateursParId = useMemo(
    () => new Map(optionsIndicateurs.map((option) => [option.value, option.label])),
    [optionsIndicateurs],
  )

  /**
   * Référentiels EXTERNES — sources inconnues à ce jour, donc listes vides et
   * cellules à « — » (note de stabilité dans `useNiveauxGrid`).
   */
  const { options: optionsProgrammes } = useProgrammesOptions()
  const programmesParId = useMemo(
    () => new Map(optionsProgrammes.map((option) => [option.value, option.label])),
    [optionsProgrammes],
  )

  const { options: optionsUnites } = useUnitesGestionOptions()
  const unitesParId = useMemo(
    () => new Map(optionsUnites.map((option) => [option.value, option.label])),
    [optionsUnites],
  )

  /**
   * Cible CUMULÉE par indicateur × exercice — calculée sur `fetchedData`, la
   * liste COMPLÈTE, et jamais sur la liste filtrée par la recherche : un taux
   * qui changerait au gré de ce qu'on tape dans la barre de recherche serait
   * faux, et personne ne le verrait.
   */
  const cumulCibles = useMemo(() => {
    const cumul = new Map<string, number>()
    for (const cible of fetchedData) {
      const annee = anneeDe(cible.annee)
      // Exercice illisible : la cible n'est rattachable à aucune période, elle
      // ne peut donc entrer dans aucun cumul (sa ligne affichera « — »).
      if (annee === null) continue
      const cle = cleExercice(cible.code_indicateur_istr, annee)
      cumul.set(cle, (cumul.get(cle) ?? 0) + versNombre(cible.valeur_cible_indcateur_istr))
    }
    return cumul
  }, [fetchedData])

  /** Réalisations cumulées sur le MÊME périmètre — cf. en-tête. */
  const cumulRealises = useMemo(() => {
    const cumul = new Map<string, number>()
    for (const suivi of suivis) {
      // `Date_suivi` est la date de la MESURE : c'est son année qui rattache la
      // réalisation à un exercice. `anneeDe` lit les quatre premiers caractères
      // sans construire de `Date`, pour qu'un horodatage UTC ne fasse pas
      // basculer un 1er janvier sur l'exercice précédent.
      const annee = anneeDe(suivi.Date_suivi)
      if (annee === null) continue
      const cle = cleExercice(suivi.code_indicateur_istr, annee)
      cumul.set(cle, (cumul.get(cle) ?? 0) + versNombre(suivi.valeur_realisee_istr))
    }
    return cumul
  }, [suivis])

  const lignes = useMemo<LIGNE_CIBLE_T[]>(() => {
    // Relation embarquée d'abord, référentiel ensuite (cf. `useCadresGrid`).
    const libelleIndicateur = (cible: CIBLE_INDICATEUR_T): string => {
      const embarque = cible.indicateur
      if (embarque) {
        return `${embarque.code_indicateur_istr} · ${embarque.intitule_indicateur_istr}`
      }
      return indicateursParId.get(cible.code_indicateur_istr) ?? REPLI
    }

    return versLignesGrille(
      fetchedData,
      (cible) => cible.id_cible_indicateur_istr,
      // Nom cité par le toast de suppression : une cible ne se reconnaît que
      // par le couple indicateur + exercice — deux cibles du même indicateur
      // ne diffèrent que par l'année.
      (cible) => `Cible ${anneeDe(cible.annee) ?? REPLI} · ${libelleIndicateur(cible)}`,
    ).map((ligne) => {
      const annee = anneeDe(ligne.annee)
      const cle = annee === null ? null : cleExercice(ligne.code_indicateur_istr, annee)
      return {
        ...ligne,
        indicateur_libelle: libelleIndicateur(ligne),
        programme_libelle: programmesParId.get(ligne.code_programme) ?? REPLI,
        unite_gestion_libelle:
          ligne.code_ug === null ? REPLI : (unitesParId.get(ligne.code_ug) ?? REPLI),
        annee_valeur: annee,
        valeur_cible: versNombre(ligne.valeur_cible_indcateur_istr),
        // `cumulCibles` est construit plus haut à partir de CETTE liste, avec
        // la même clé et le même test `annee === null` : dès que `cle` n'est
        // pas nulle, l'entrée existe forcément. Pas de repli à prévoir donc —
        // en écrire un laisserait croire à un cas qui ne peut pas se produire.
        //
        // Cible ABSENTE et cible NULLE sont volontairement traitées de la même
        // façon : ni l'une ni l'autre ne permet un rapport interprétable, et
        // `tauxAtteinte` renvoie `null` dans les deux cas (affiché « — »).
        // Écrire « 0 % » se lirait comme une contre-performance là où il n'y a
        // simplement rien à comparer.
        taux_atteinte:
          cle === null ? null : tauxAtteinte(cumulRealises.get(cle) ?? 0, cumulCibles.get(cle)),
      }
    })
  }, [
    fetchedData,
    indicateursParId,
    programmesParId,
    unitesParId,
    cumulCibles,
    cumulRealises,
  ])

  const columnDefs = useMemo<ColDef<LIGNE_CIBLE_T>[]>(
    () => [
      {
        field: 'indicateur_libelle',
        headerName: 'Indicateur',
        flex: 2,
        minWidth: 300,
        cellRenderer: PrimaryTextCellRenderer,
      },
      {
        field: 'annee_valeur',
        headerName: 'Année',
        width: 120,
        cellRenderer: BadgeGrisCellRenderer,
      },
      {
        field: 'valeur_cible',
        headerName: 'Valeur cible',
        width: 160,
        cellRenderer: ValeurNumeriqueCellRenderer,
      },
      {
        field: 'taux_atteinte',
        headerName: "Taux d'atteinte",
        width: 180,
        minWidth: 150,
        // L'en-tête seul laisserait croire à un taux PAR LIGNE ; le périmètre
        // réel du calcul doit être lisible sans ouvrir le code (cf. en-tête).
        headerTooltip:
          "Réalisations cumulées ÷ cibles cumulées de l'indicateur pour l'exercice — les lignes d'un même indicateur et d'un même exercice portent donc le même taux.",
        cellRenderer: TauxAtteinteCellRenderer,
      },
      {
        field: 'programme_libelle',
        headerName: 'Programme',
        flex: 1,
        minWidth: 190,
        cellRenderer: MutedTextCellRenderer,
      },
      {
        field: 'unite_gestion_libelle',
        headerName: 'Unité de gestion',
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
          onEdit: (row: CIBLE_INDICATEUR_T) => setEditingItem(row),
          onDelete: (id: number) => deleteMutation(id),
          readonly,
          readonlyMessage:
            "Vous n'avez pas les droits pour modifier ou supprimer une cible annuelle.",
        },
      },
    ],
    [deleteMutation, readonly],
  )

  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || lignes.length === 0) return lignes
    const fuse = new Fuse(lignes, {
      keys: [...CLES_RECHERCHE],
      threshold: 0.3,
      ignoreLocation: true,
    })
    return fuse.search(searchQuery).map((resultat) => resultat.item)
  }, [lignes, searchQuery])

  const modalNode = (
    <CibleFormModal
      open={!!editingItem}
      onOpenChange={(open) => !open && setEditingItem(null)}
      initialData={editingItem}
    />
  )

  return { columnDefs, data: filteredData, isLoading, isError, error, modalNode, fermerEdition }
}
