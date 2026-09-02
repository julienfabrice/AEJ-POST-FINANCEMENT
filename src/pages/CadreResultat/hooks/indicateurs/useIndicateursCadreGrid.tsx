import { useCallback, useMemo, useState } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { MODULES } from '@/constants/modules'
import { useCan } from '@/hooks/useCan'
import { indicateurCadreResultatServices } from '@/services/cadreResultat.services'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'
import { MutedTextCellRenderer } from '@/pages/Suivi/components/MutedTextCellRenderer'
import type { INDICATEUR_CADRE_RESULTAT_T } from '@/types'
import { IndicateurCadreFormModal } from '../../components/IndicateurCadreFormModal'
import { versLignesGrille, type LIGNE_GRILLE_T } from '../../utils/ligneGrille'
import {
  BadgeGrisCellRenderer,
  CodeBadgeCellRenderer,
  TexteFortTronqueCellRenderer,
} from '../cellulesGrille'
import { useCadresOptions } from '../useReferentielsInternes'

/**
 * Onglet « Indicateurs » — table `indicateurs_cadre_resultat`.
 *
 * Même gabarit que `useNiveauxGrid`. Deux points d'attention propres à cette
 * table :
 *
 *  • `code_indicateur_istr` est ICI un CODE MÉTIER TEXTUEL (« R002 ») ; les
 *    colonnes du même nom des tables « cibles » et « suivis » sont, elles, des
 *    ENTIERS pointant vers `id_indicateur_str`. La colonne « Code » ci-dessous
 *    affiche donc bien un texte, et c'est correct.
 *  • `code_istr` est, malgré son nom, la CLÉ ÉTRANGÈRE vers l'élément du cadre
 *    (`cadres_resultat.id_cs`) — d'où la colonne « Élément du cadre rattaché »
 *    et non une colonne « Code ».
 */

/** Repli d'affichage — cadratin, comme dans tout le dépôt. */
const REPLI = '—'

/**
 * Retire les tirets cadratins d'INDENTATION que `useCadresOptions` place en
 * tête de ses libellés.
 *
 * Ce préfixe (`'— '.repeat(profondeur)`) est ce qui rend le SÉLECTEUR de
 * rattachement lisible : dans une liste déroulante, c'est la seule façon de
 * montrer la profondeur sans composant sur mesure. Dans une CELLULE de grille,
 * en revanche, il n'y a plus de liste à structurer — le préfixe n'y serait plus
 * qu'un artefact, et il se lirait comme une valeur manquante répétée.
 *
 * La correction se fait ici, à l'affichage, et non dans `useCadresOptions` :
 * ce hook est écrit pour les sélecteurs, où le préfixe est indispensable, et le
 * priver de son indentation casserait les cinq modales du module.
 */
const sansIndentation = (libelle: string): string => libelle.replace(/^(?:— )+/, '')

/**
 * Ligne de grille : l'indicateur, augmenté des champs du rendu d'actions et du
 * libellé de l'élément du cadre résolu en amont (cf. `useNiveauxGrid`).
 */
type LIGNE_INDICATEUR_T = LIGNE_GRILLE_T<INDICATEUR_CADRE_RESULTAT_T> & {
  cadre_libelle: string
}

/** Champs réellement lus par l'utilisateur (cf. `useExploitationsGrid`). */
const CLES_RECHERCHE = [
  'code_indicateur_istr',
  'intitule_indicateur_istr',
  'cadre_libelle',
  'periodicite_iop',
  'responsable_istr',
  'source_istr',
] as const

export function useIndicateursCadreGrid(searchQuery: string) {
  const { data: fetchedData = [], isLoading, isError, error } =
    indicateurCadreResultatServices.useGetAll()
  const { mutate: deleteMutation } = indicateurCadreResultatServices.useDelete()
  const [editingItem, setEditingItem] = useState<INDICATEUR_CADRE_RESULTAT_T | null>(null)

  /** Abandon de l'édition — appelé par l'agrégateur au changement d'onglet. */
  const fermerEdition = useCallback(() => setEditingItem(null), [])

  const can = useCan()
  // Cf. `useNiveauxGrid` : la page est gardée par `MODULES.SUIVI`.
  const readonly = !can(MODULES.SUIVI, 'e') || !can(MODULES.SUIVI, 'd')

  /**
   * Éléments du cadre — référentiel INTERNE. Sans argument : on ne construit
   * pas ici un sélecteur de parent, il n'y a donc aucun élément à écarter.
   */
  const { options: optionsCadres } = useCadresOptions()
  const cadresParId = useMemo(
    () => new Map(optionsCadres.map((option) => [option.value, sansIndentation(option.label)])),
    [optionsCadres],
  )

  const lignes = useMemo<LIGNE_INDICATEUR_T[]>(() => {
    // Relation embarquée d'abord, référentiel ensuite (cf. `useCadresGrid`).
    const libelleCadre = (indicateur: INDICATEUR_CADRE_RESULTAT_T): string => {
      const embarque = indicateur.cadre
      if (embarque) return `${embarque.abgrege_cs} · ${embarque.intutile_cs}`
      return cadresParId.get(indicateur.code_istr) ?? REPLI
    }

    return versLignesGrille(
      fetchedData,
      (indicateur) => indicateur.id_indicateur_str,
      // Nom cité par le toast de suppression : le code est ce que
      // l'utilisateur connaît, l'intitulé ce qui le rend identifiable.
      (indicateur) =>
        `${indicateur.code_indicateur_istr} · ${indicateur.intitule_indicateur_istr}`,
    ).map((ligne) => ({ ...ligne, cadre_libelle: libelleCadre(ligne) }))
  }, [fetchedData, cadresParId])

  const columnDefs = useMemo<ColDef<LIGNE_INDICATEUR_T>[]>(
    () => [
      {
        field: 'code_indicateur_istr',
        headerName: 'Code',
        width: 130,
        cellRenderer: CodeBadgeCellRenderer,
      },
      {
        field: 'intitule_indicateur_istr',
        headerName: 'Intitulé',
        flex: 2,
        minWidth: 300,
        // Colonne TEXT libre, régulièrement longue d'une phrase entière : le
        // rendu partagé `PrimaryTextCellRenderer` la laisserait déborder de la
        // colonne (cf. l'en-tête de `TexteFortTronqueCellRenderer`).
        cellRenderer: TexteFortTronqueCellRenderer,
      },
      {
        field: 'cadre_libelle',
        headerName: 'Élément du cadre rattaché',
        flex: 1,
        minWidth: 260,
        cellRenderer: MutedTextCellRenderer,
        cellRendererParams: { truncate: true },
      },
      {
        field: 'periodicite_iop',
        headerName: 'Périodicité',
        width: 150,
        cellRenderer: BadgeGrisCellRenderer,
      },
      {
        field: 'responsable_istr',
        headerName: 'Responsable',
        width: 180,
        cellRenderer: MutedTextCellRenderer,
      },
      {
        field: 'source_istr',
        headerName: 'Source',
        flex: 1,
        minWidth: 190,
        cellRenderer: MutedTextCellRenderer,
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
          onEdit: (row: INDICATEUR_CADRE_RESULTAT_T) => setEditingItem(row),
          onDelete: (id: number) => deleteMutation(id),
          readonly,
          readonlyMessage:
            "Vous n'avez pas les droits pour modifier ou supprimer un indicateur du cadre de résultat.",
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
    <IndicateurCadreFormModal
      open={!!editingItem}
      onOpenChange={(open) => !open && setEditingItem(null)}
      initialData={editingItem}
    />
  )

  return { columnDefs, data: filteredData, isLoading, isError, error, modalNode, fermerEdition }
}
