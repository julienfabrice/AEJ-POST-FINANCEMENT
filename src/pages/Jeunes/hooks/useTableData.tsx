import { useMemo } from 'react'
import type { ColDef, ICellRendererParams, ValueGetterParams } from 'ag-grid-community'
import { formatAge } from '@/helpers/age'
import type { PROMOTEUR_T } from '@/types/promoteurs.types'
import { refLabel } from '@/types/referentials.types'

import { ProfileCellRenderer } from '../components/ProfileCellRenderer'
import { ContactCellRenderer } from '../components/ContactCellRenderer'
import { StatusCellRenderer } from '../components/StatusCellRenderer'
import { ActionsCellRenderer } from '../components/ActionsCellRenderer'

export function useTableData() {
  const columnDefs = useMemo<ColDef<PROMOTEUR_T>[]>(
    () => [
      {
        headerName: 'Nom & Matricule',
        flex: 1.2,
        minWidth: 220,
        valueGetter: (p: ValueGetterParams<PROMOTEUR_T>) =>
          `${p.data?.prenom ?? ''} ${p.data?.nom ?? ''} ${p.data?.matriculeaej ?? ''}`.trim(),
        cellRenderer: ProfileCellRenderer,
      },
      {
        headerName: 'Contact',
        flex: 1,
        minWidth: 200,
        valueGetter: (p: ValueGetterParams<PROMOTEUR_T>) =>
          [p.data?.email, p.data?.telephone].filter(Boolean).join(' - ') || '—',
        cellRenderer: ContactCellRenderer,
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