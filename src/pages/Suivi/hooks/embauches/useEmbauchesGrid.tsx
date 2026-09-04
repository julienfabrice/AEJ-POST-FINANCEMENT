import { useCallback, useMemo, useState } from 'react'
import type { ColDef, ValueGetterParams } from 'ag-grid-community'
import Fuse from 'fuse.js'
import { MODULES } from '@/constants/modules'
import { useCan } from '@/hooks/useCan'
import { embaucheServices } from '@/services/embauches.services'
import { ActionsCellRenderer } from '@/pages/Referentiels/components/ActionsCellRenderer'
import type { EMBAUCHE_T } from '@/types'
import { EmbaucheFormModal } from '../../components/EmbaucheFormModal'
import { MicroProjetCellRenderer } from '../../components/MicroProjetCellRenderer'
import { MutedTextCellRenderer } from '../../components/MutedTextCellRenderer'
import { TypeEmploiCellRenderer } from '../../components/TypeEmploiCellRenderer'

/** Champs réellement lus par l'utilisateur (cf. `useExploitationsGrid`). */
const CLES_RECHERCHE = [
  'micro_projet.code',
  'micro_projet.intitule',
  'poste',
  'entreprise.raison_sociale',
  'promoteur.nom',
  'promoteur.prenom',
  'promoteur.matriculeaej',
  'type_emploi.libelle',
] as const

export function useEmbauchesGrid(searchQuery: string) {
  const { data: fetchedData = [], isLoading, isError, error } = embaucheServices.useGetAll()
  const { mutate: deleteMutation } = embaucheServices.useDelete()
  const [editingItem, setEditingItem] = useState<EMBAUCHE_T | null>(null)

  /** Cf. `useExploitationsGrid` : abandon de l'édition au changement d'onglet. */
  const fermerEdition = useCallback(() => setEditingItem(null), [])

  const can = useCan()
  const readonly = !can(MODULES.SUIVI, 'e') || !can(MODULES.SUIVI, 'd')

  const columnDefs = useMemo<ColDef<EMBAUCHE_T>[]>(
    () => [
      {
        colId: 'micro_projet',
        headerName: 'Micro-projet',
        flex: 2,
        minWidth: 260,
        valueGetter: (params: ValueGetterParams<EMBAUCHE_T>) =>
          params.data?.micro_projet?.intitule ?? '',
        cellRenderer: MicroProjetCellRenderer,
      },
      {
        field: 'poste',
        headerName: 'Poste',
        flex: 1,
        minWidth: 180,
        // Aucun renderer : la maquette déclare cette colonne nue
        // (`{ k: 'poste', label: "Poste" }`, l.6511), donc en texte de cellule
        // ORDINAIRE — c'est le micro-projet qui porte l'accent visuel de la
        // ligne, pas le poste.
      },
      {
        colId: 'type_emploi',
        headerName: 'Type',
        width: 150,
        // Libellé du référentiel plutôt que la clé étrangère : trier sur des
        // identifiants numériques n'aurait aucun sens à l'écran.
        valueGetter: (params: ValueGetterParams<EMBAUCHE_T>) =>
          params.data?.type_emploi?.libelle ?? '',
        cellRenderer: TypeEmploiCellRenderer,
      },
      {
        colId: 'entreprise',
        headerName: 'Entreprise',
        width: 220,
        valueGetter: (params: ValueGetterParams<EMBAUCHE_T>) =>
          params.data?.entreprise?.raison_sociale ?? '',
        cellRenderer: MutedTextCellRenderer,
      },
      // Pas de colonne « Bénéficiaire » : la maquette ne liste que QUATRE
      // colonnes pour `embauches` (Micro-projet, Poste, Type, Entreprise,
      // l.6510-6513). Le bénéficiaire n'apparaît que dans le FORMULAIRE
      // (l.6506), où il reste saisi — et l'API l'exige (`promoteur_id`
      // obligatoire). L'API dicte les CHAMPS, pas les colonnes d'une grille :
      // c'est la maquette qui fait autorité sur la forme. Le promoteur reste
      // néanmoins interrogeable par la recherche de l'onglet (cf.
      // `CLES_RECHERCHE`).
      {
        headerName: 'Actions',
        width: 120,
        minWidth: 120,
        sortable: false,
        filter: false,
        cellRenderer: ActionsCellRenderer,
        cellRendererParams: {
          onEdit: (row: EMBAUCHE_T) => setEditingItem(row),
          onDelete: (id: number) => deleteMutation(id),
          readonly,
          readonlyMessage: "Vous n'avez pas les droits pour modifier ou supprimer un emploi créé.",
        },
      },
    ],
    [deleteMutation, readonly],
  )

  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || fetchedData.length === 0) return fetchedData
    const fuse = new Fuse(fetchedData, {
      keys: [...CLES_RECHERCHE],
      threshold: 0.3,
      ignoreLocation: true,
    })
    return fuse.search(searchQuery).map((resultat) => resultat.item)
  }, [fetchedData, searchQuery])

  const modalNode = (
    <EmbaucheFormModal
      open={!!editingItem}
      onOpenChange={(open) => !open && setEditingItem(null)}
      initialData={editingItem}
    />
  )

  return { columnDefs, data: filteredData, isLoading, isError, error, modalNode, fermerEdition }
}
