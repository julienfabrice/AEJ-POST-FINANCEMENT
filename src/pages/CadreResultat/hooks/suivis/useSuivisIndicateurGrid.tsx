import { useCallback, useMemo, useState } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { MODULES } from '@/constants/modules'
import { useCan } from '@/hooks/useCan'
import { formatDate } from '@/helpers/age'
import { suiviIndicateurServices } from '@/services/cadreResultat.services'
import { useUnitesGestionOptions } from '@/services/referentielsCadreResultat.services'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'
import { PrimaryTextCellRenderer } from '@/pages/Referentiels/components/PrimaryTextCellRenderer'
import { MutedTextCellRenderer } from '@/pages/Suivi/components/MutedTextCellRenderer'
import type { SUIVI_INDICATEUR_T } from '@/types'
import { SuiviIndicateurFormModal } from '../../components/SuiviIndicateurFormModal'
import { versNombre } from '../../utils/format'
import { versLignesGrille, type LIGNE_GRILLE_T } from '../../utils/ligneGrille'
import { DateCellRenderer, ValeurNumeriqueCellRenderer } from '../cellulesGrille'
import { useIndicateursOptions } from '../useReferentielsInternes'

/**
 * Onglet « Réalisations » — table `suivis_indicateur_cadre_resultat`.
 *
 * ⚠️ `Date_suivi` garde la MAJUSCULE initiale du schéma, seule de tout le
 * modèle. Elle est reprise telle quelle jusque dans le nom du champ de colonne :
 * un renommage silencieux ici la rendrait introuvable le jour du branchement,
 * où c'est le premier point à vérifier.
 *
 * ⚠️ La valeur de la colonne « Date de suivi » reste la CHAÎNE ISO de l'API, et
 * non la date déjà formatée : trier sur « 30/08/2026 » revient à trier sur le
 * jour et mélange les années. C'est `DateCellRenderer` qui traduit.
 *
 * ⚠️ `code_indicateur_istr` est ici un ENTIER pointant vers
 * `id_indicateur_str` — même piège de nommage que dans l'onglet des cibles.
 */

/** Repli d'affichage — cadratin, comme dans tout le dépôt. */
const REPLI = '—'

/**
 * Ligne de grille : la réalisation, augmentée des champs du rendu d'actions,
 * des libellés de référentiels et de la valeur NUMERIC convertie en nombre —
 * tout est résolu en amont pour que tri, filtre et recherche portent sur ce que
 * l'utilisateur voit (cf. `useNiveauxGrid`).
 */
type LIGNE_SUIVI_T = LIGNE_GRILLE_T<SUIVI_INDICATEUR_T> & {
  indicateur_libelle: string
  unite_gestion_libelle: string
  valeur_realisee: number
}

/** Champs réellement lus par l'utilisateur (cf. `useExploitationsGrid`). */
const CLES_RECHERCHE = [
  'indicateur_libelle',
  'unite_gestion_libelle',
  'commentaire_suivi_istr',
] as const

export function useSuivisIndicateurGrid(searchQuery: string) {
  const { data: fetchedData = [], isLoading, isError, error } = suiviIndicateurServices.useGetAll()
  const { mutate: deleteMutation } = suiviIndicateurServices.useDelete()
  const [editingItem, setEditingItem] = useState<SUIVI_INDICATEUR_T | null>(null)

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
   * Référentiel EXTERNE — source non arbitrée à ce jour, donc liste vide et
   * cellules à « — » (note de stabilité dans `useNiveauxGrid`).
   */
  const { options: optionsUnites } = useUnitesGestionOptions()
  const unitesParId = useMemo(
    () => new Map(optionsUnites.map((option) => [option.value, option.label])),
    [optionsUnites],
  )

  const lignes = useMemo<LIGNE_SUIVI_T[]>(() => {
    // Relation embarquée d'abord, référentiel ensuite (cf. `useCadresGrid`).
    const libelleIndicateur = (suivi: SUIVI_INDICATEUR_T): string => {
      const embarque = suivi.indicateur
      if (embarque) {
        return `${embarque.code_indicateur_istr} · ${embarque.intitule_indicateur_istr}`
      }
      return indicateursParId.get(suivi.code_indicateur_istr) ?? REPLI
    }

    return versLignesGrille(
      fetchedData,
      (suivi) => suivi.id_suivi_indicateur_istr,
      // Nom cité par le toast de suppression : une réalisation ne se reconnaît
      // que par le couple indicateur + date de mesure.
      (suivi) => `Réalisation du ${formatDate(suivi.Date_suivi)} · ${libelleIndicateur(suivi)}`,
    ).map((ligne) => ({
      ...ligne,
      indicateur_libelle: libelleIndicateur(ligne),
      unite_gestion_libelle:
        ligne.code_ug === null ? REPLI : (unitesParId.get(ligne.code_ug) ?? REPLI),
      valeur_realisee: versNombre(ligne.valeur_realisee_istr),
    }))
  }, [fetchedData, indicateursParId, unitesParId])

  const columnDefs = useMemo<ColDef<LIGNE_SUIVI_T>[]>(
    () => [
      {
        field: 'indicateur_libelle',
        headerName: 'Indicateur',
        flex: 2,
        minWidth: 300,
        cellRenderer: PrimaryTextCellRenderer,
      },
      {
        field: 'Date_suivi',
        headerName: 'Date de suivi',
        width: 160,
        cellRenderer: DateCellRenderer,
      },
      {
        field: 'unite_gestion_libelle',
        headerName: 'Unité de gestion',
        width: 200,
        cellRenderer: MutedTextCellRenderer,
      },
      {
        field: 'valeur_realisee',
        headerName: 'Valeur réalisée',
        width: 170,
        cellRenderer: ValeurNumeriqueCellRenderer,
      },
      {
        field: 'commentaire_suivi_istr',
        headerName: 'Commentaire',
        flex: 1,
        minWidth: 280,
        cellRenderer: MutedTextCellRenderer,
        // Colonne TEXT libre : tronquée sur une ligne à 280 px, texte complet
        // en infobulle — même rendu que la colonne « Observations » du module
        // Suivi, dont ce composant est repris tel quel.
        cellRendererParams: { truncate: true },
      },
      {
        headerName: 'Actions',
        width: 120,
        minWidth: 120,
        sortable: false,
        filter: false,
        cellRenderer: ActionsCellRenderer,
        cellRendererParams: {
          onEdit: (row: SUIVI_INDICATEUR_T) => setEditingItem(row),
          onDelete: (id: number) => deleteMutation(id),
          readonly,
          readonlyMessage:
            "Vous n'avez pas les droits pour modifier ou supprimer une réalisation.",
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
    <SuiviIndicateurFormModal
      open={!!editingItem}
      onOpenChange={(open) => !open && setEditingItem(null)}
      initialData={editingItem}
    />
  )

  return { columnDefs, data: filteredData, isLoading, isError, error, modalNode, fermerEdition }
}
