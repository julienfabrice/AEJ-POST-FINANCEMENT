import { useMemo } from 'react'
import type { ColDef, ICellRendererParams, ValueGetterParams } from 'ag-grid-community'
import { formatAge } from '@/helpers/age'
import type { PROMOTEUR_T } from '@/types/promoteurs.types'
import { refLabel } from '@/types/referentials.types'

import { ProfileCellRenderer } from '../components/ProfileCellRenderer'
import { StatusCellRenderer } from '../components/StatusCellRenderer'
import { ActionsCellRenderer } from '../components/ActionsCellRenderer'

const Mono = (p: ICellRendererParams<PROMOTEUR_T>) => (
  <span className="font-mono text-xs font-medium text-slate-500">{p.value || '—'}</span>
)

export function useTableData() {
  const columnDefs = useMemo<ColDef<PROMOTEUR_T>[]>(
    () => [
      {
        field: 'matriculeaej',
        headerName: 'Matricule',
        width: 150,
        cellRenderer: Mono,
      },
      {
        headerName: 'Nom complet',
        flex: 1,
        minWidth: 220,
        valueGetter: (p: ValueGetterParams<PROMOTEUR_T>) =>
          `${p.data?.prenom ?? ''} ${p.data?.nom ?? ''}`.trim(),
        cellRenderer: ProfileCellRenderer,
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1,
        minWidth: 200,
        cellRenderer: (p: ICellRendererParams<PROMOTEUR_T>) => (
          <span className="text-sm text-slate-600">{p.value || '—'}</span>
        ),
      },
      {
        field: 'telephone',
        headerName: 'Téléphone',
        width: 160,
        cellRenderer: (p: ICellRendererParams<PROMOTEUR_T>) => (
          <span className="font-mono text-sm text-slate-600">{p.value || '—'}</span>
        ),
      },
      {
        headerName: 'Âge (ans)',
        width: 110,
        // `tranche_age` reste un critère de FILTRE ; à l'affichage, l'âge exact
        // dérivé de la date de naissance est plus informatif. Pas de repli sur
        // la tranche : sans date, la cellule reste vide.
        valueGetter: (p: ValueGetterParams<PROMOTEUR_T>) => formatAge(p.data?.datenaissance),
        cellRenderer: (p: ICellRendererParams<PROMOTEUR_T>) => (
          <span className="text-sm text-slate-600">{p.value}</span>
        ),
      },
      {
        headerName: 'Localité',
        width: 150,
        // Relations eager-loaded par `GET /promoteurs` : le libellé est sur la
        // ligne, aucun référentiel à charger. La clé porteuse varie
        // (`libelle`, `nom`…), d'où `refLabel`.
        valueGetter: (p: ValueGetterParams<PROMOTEUR_T>) =>
          p.data?.lieu_habitation ? refLabel(p.data.lieu_habitation) : '—',
        cellRenderer: (p: ICellRendererParams<PROMOTEUR_T>) => (
          <span className="text-sm text-slate-600">{p.value}</span>
        ),
      },
      {
        headerName: "Secteur d'activité",
        width: 180,
        valueGetter: (p: ValueGetterParams<PROMOTEUR_T>) =>
          p.data?.secteur_activite ? refLabel(p.data.secteur_activite) : '—',
        cellRenderer: (p: ICellRendererParams<PROMOTEUR_T>) => (
          <span className="truncate text-sm text-slate-600">{p.value}</span>
        ),
      },
      {
        field: 'statut',
        headerName: 'Statut',
        width: 120,
        cellRenderer: StatusCellRenderer,
      },
      {
        headerName: 'Actions',
        width: 80,
        cellRenderer: ActionsCellRenderer,
      },
    ],
    [],
  )

  return { columnDefs }
}

/*
 * Colonnes ABSENTES volontairement : « Localité » et « Secteur d'activité ».
 * `PROMOTEUR_T` ne porte que `lieuhabitation_id` / `secteuractivite_id` — des
 * identifiants, sans libellé. Les afficher suppose de charger les référentiels
 * correspondants (cf. leftover #18) ; afficher un numéro brut n'aiderait
 * personne.
 */
