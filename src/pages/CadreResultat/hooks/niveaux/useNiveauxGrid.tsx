import { useCallback, useMemo, useState } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { MODULES } from '@/constants/modules'
import { useCan } from '@/hooks/useCan'
import { niveauCadreResultatServices } from '@/services/cadreResultat.services'
import { useProgrammesOptions } from '@/services/referentielsCadreResultat.services'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'
import { PrimaryTextCellRenderer } from '@/pages/Referentiels/components/PrimaryTextCellRenderer'
import { MutedTextCellRenderer } from '@/pages/Suivi/components/MutedTextCellRenderer'
import type { NIVEAU_CADRE_RESULTAT_T } from '@/types'
import { NiveauFormModal } from '../../components/NiveauFormModal'
import { versLignesGrille, type LIGNE_GRILLE_T } from '../../utils/ligneGrille'
import {
  BadgeGrisCellRenderer,
  CodeBadgeCellRenderer,
  MonoTextCellRenderer,
} from '../cellulesGrille'

/**
 * Onglet « Niveaux » — référentiel des niveaux hiérarchiques du cadre
 * (« Axe », « Effet », « Produit »…), table `niveaux_cadre_resultat`.
 *
 * Gabarit `useExploitationsGrid` : contrat de retour
 * `{ columnDefs, data, isLoading, isError, error, modalNode, fermerEdition }`,
 * recherche Fuse.js sur les champs RÉELLEMENT LUS à l'écran, colonne
 * « Actions » en dernier avec le rendu partagé.
 *
 * ⚠️ Tant que `CADRE_RESULTAT_API_PRETE` vaut `false`, `useGetAll` est
 * `enabled: false` et renvoie `[]` : la grille est VIDE, et c'est le
 * comportement attendu — le bandeau de la page l'explique. Aucune donnée de
 * démonstration n'est fabriquée ici.
 */

/** Repli d'affichage — cadratin, comme dans tout le dépôt. */
const REPLI = '—'

/**
 * Ligne de grille : le niveau, augmenté de ce que le rendu partagé
 * (`ActionsCellRenderer`, via `versLignesGrille`) et les colonnes de
 * référentiel attendent.
 *
 * `programme_libelle` est RÉSOLU EN AMONT, sur la ligne, plutôt que calculé
 * dans un `valueGetter` : c'est ce qui rend la colonne triable, filtrable ET
 * cherchable sur le texte que l'utilisateur voit. Une colonne qui affiche un
 * libellé mais se trie sur une clé étrangère numérique est un piège.
 */
type LIGNE_NIVEAU_T = LIGNE_GRILLE_T<NIVEAU_CADRE_RESULTAT_T> & {
  programme_libelle: string
}

/** Champs réellement lus par l'utilisateur (cf. `useExploitationsGrid`). */
const CLES_RECHERCHE = [
  'code_number_nsc',
  'libelle_nsc',
  'type_niveau',
  'programme_libelle',
] as const

export function useNiveauxGrid(searchQuery: string) {
  const { data: fetchedData = [], isLoading, isError, error } =
    niveauCadreResultatServices.useGetAll()
  const { mutate: deleteMutation } = niveauCadreResultatServices.useDelete()
  const [editingItem, setEditingItem] = useState<NIVEAU_CADRE_RESULTAT_T | null>(null)

  /** Abandon de l'édition — appelé par l'agrégateur au changement d'onglet. */
  const fermerEdition = useCallback(() => setEditingItem(null), [])

  const can = useCan()
  // La page est gardée par `MODULES.SUIVI` et non par `MODULES.CADRE_RESULTAT`,
  // que le backend ne renvoie pas encore dans les permissions (justification
  // complète dans `src/constants/modules.ts`). Les deux actions sont
  // interrogées parce que `ActionsCellRenderer` n'expose qu'un seul verrou pour
  // « Modifier » et « Supprimer ».
  const readonly = !can(MODULES.SUIVI, 'e') || !can(MODULES.SUIVI, 'd')

  /**
   * Référentiel « Programmes » — source INCONNUE à ce jour, donc `options`
   * vide et `disponible: false`. La table de correspondance est alors vide et
   * chaque cellule affiche « — » : on n'invente aucun libellé, et on n'affiche
   * surtout pas l'identifiant brut, qui ne veut rien dire pour l'utilisateur.
   *
   * ⚠️ Note de stabilité, valable pour les trois référentiels non branchés
   * (programmes, structures, unités de gestion) : `referentielIndisponible()`
   * reconstruit son tableau d'options à chaque rendu, si bien que la
   * mémoïsation ci-dessous — et, par ricochet, celle des lignes — est
   * réévaluée à chaque rendu de la page. C'est SANS CONSÉQUENCE, et pour une
   * raison de fond : l'identité n'est instable que dans le cas où la liste est
   * VIDE. Dès qu'un référentiel est réellement branché, il mémoïse ses options
   * comme le fait déjà `usePartenairesOptions`, et la chaîne redevient stable
   * au moment précis où elle commence à coûter quelque chose.
   */
  const { options: optionsProgrammes } = useProgrammesOptions()
  const programmesParId = useMemo(
    () => new Map(optionsProgrammes.map((option) => [option.value, option.label])),
    [optionsProgrammes],
  )

  const lignes = useMemo<LIGNE_NIVEAU_T[]>(
    () =>
      versLignesGrille(
        fetchedData,
        (niveau) => niveau.id_nsc,
        // Nom cité par le toast de confirmation de suppression : le libellé
        // seul suffit, c'est ce que l'utilisateur a sous les yeux.
        (niveau) => niveau.libelle_nsc,
      ).map((ligne) => ({
        ...ligne,
        programme_libelle:
          ligne.programme === null ? REPLI : (programmesParId.get(ligne.programme) ?? REPLI),
      })),
    [fetchedData, programmesParId],
  )

  const columnDefs = useMemo<ColDef<LIGNE_NIVEAU_T>[]>(
    () => [
      {
        field: 'code_number_nsc',
        headerName: 'Code',
        width: 130,
        cellRenderer: CodeBadgeCellRenderer,
      },
      {
        field: 'libelle_nsc',
        headerName: 'Libellé',
        flex: 2,
        minWidth: 220,
        cellRenderer: PrimaryTextCellRenderer,
      },
      {
        field: 'nombre_nsc',
        // « Ordre » et non « Nombre » : la colonne porte la PROFONDEUR du
        // niveau dans la hiérarchie, pas un décompte (cf. le type).
        headerName: 'Ordre',
        width: 110,
        cellRenderer: MonoTextCellRenderer,
      },
      {
        field: 'type_niveau',
        headerName: 'Type de niveau',
        width: 170,
        cellRenderer: BadgeGrisCellRenderer,
      },
      {
        field: 'programme_libelle',
        headerName: 'Programme',
        flex: 1,
        minWidth: 190,
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
          onEdit: (row: NIVEAU_CADRE_RESULTAT_T) => setEditingItem(row),
          onDelete: (id: number) => deleteMutation(id),
          readonly,
          readonlyMessage:
            "Vous n'avez pas les droits pour modifier ou supprimer un niveau du cadre de résultat.",
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
    <NiveauFormModal
      open={!!editingItem}
      onOpenChange={(open) => !open && setEditingItem(null)}
      initialData={editingItem}
    />
  )

  return { columnDefs, data: filteredData, isLoading, isError, error, modalNode, fermerEdition }
}
