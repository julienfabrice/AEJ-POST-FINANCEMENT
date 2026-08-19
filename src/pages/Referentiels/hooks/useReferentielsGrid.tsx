import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'

import { ActionsCellRenderer } from '../components/ActionsCellRenderer'
import { PrimaryTextCellRenderer } from '../components/PrimaryTextCellRenderer'
import { useSecteursGrid } from './useSecteursGrid'
import { useSousSecteursGrid } from './useSousSecteursGrid'
import { usePiecesIdentiteGrid } from './usePiecesIdentiteGrid'
import { useSituationsMatrimonialesGrid } from './useSituationsMatrimonialesGrid'
import { useIndicateursGrid } from './useIndicateursGrid'
import { useTypeEntreprisesGrid } from './useTypeEntreprisesGrid'

import {
  MOCK_TYPE_EMPLOIS,
  
} from '@/mock'

export type ReferentielTab = 'secteurs' | 'sous_secteurs' | 'type_entreprises' | 'pieces_identite' | 'situation_matrimoniale' | 'type_emplois' | 'indicateurs'

export function useReferentielsGrid(activeTab: ReferentielTab, searchQuery: string) {
  // Hooks spécifiques
  const { columnDefs: secteursDefs, data: secteursData, isLoading: secteursLoading } = useSecteursGrid(searchQuery)
  const { columnDefs: sousSecteursDefs, data: sousSecteursData, isLoading: sousSecteursLoading } = useSousSecteursGrid(searchQuery)
  const { columnDefs: piecesDefs, data: piecesData, isLoading: piecesLoading } = usePiecesIdentiteGrid(searchQuery)
  const { columnDefs: situationsDefs, data: situationsData, isLoading: situationsLoading } = useSituationsMatrimonialesGrid(searchQuery)
  const { columnDefs: indicateursDefs, data: indicateursData, isLoading: indicateursLoading } = useIndicateursGrid(searchQuery)
  const { columnDefs: typeEntreprisesDefs, data: typeEntreprisesData, isLoading: typeEntreprisesLoading } = useTypeEntreprisesGrid(searchQuery)

  const columnDefs = useMemo<ColDef[]>(() => {
    const commonAction: ColDef = {
      headerName: 'Actions',
      width: 120,
      minWidth : 120,
      sortable: false,
      filter: false,
      cellRenderer: ActionsCellRenderer,
    }

    switch (activeTab) {
      case 'secteurs': return secteursDefs
      case 'sous_secteurs': return sousSecteursDefs
      case 'type_entreprises': return typeEntreprisesDefs
      case 'pieces_identite': return piecesDefs
      case 'situation_matrimoniale': return situationsDefs
      case 'type_emplois': return [
          { field: 'id', headerName: 'ID', width: 80, cellClass: 'font-mono text-slate-500' },
          { field: 'libelle', headerName: 'Type d\'emploi', flex: 1, cellRenderer: PrimaryTextCellRenderer },
          commonAction
        ]
      case 'indicateurs': return indicateursDefs
      default: return []
    }
  }, [activeTab, secteursDefs, sousSecteursDefs, piecesDefs, situationsDefs, indicateursDefs, typeEntreprisesDefs])

  // Données et recherche pour les onglets qui utilisent encore les mocks
  const data = useMemo(() => {
    if (activeTab === 'secteurs') return secteursData
    if (activeTab === 'sous_secteurs') return sousSecteursData
    if (activeTab === 'pieces_identite') return piecesData
    if (activeTab === 'situation_matrimoniale') return situationsData
    if (activeTab === 'indicateurs') return indicateursData
    if (activeTab === 'type_entreprises') return typeEntreprisesData

    let currentMock: any[] = []
    switch (activeTab) {
      case 'type_emplois': currentMock = MOCK_TYPE_EMPLOIS; break;
      }

    if (!searchQuery.trim()) return currentMock

    const fuse = new Fuse(currentMock, {
      keys: ['libelle', 'secteur', 'id', 'unite', 'type_valeur'],
      threshold: 0.3,
      ignoreLocation: true
    })
    return fuse.search(searchQuery).map(res => res.item)
  }, [activeTab, searchQuery, secteursData, sousSecteursData, piecesData, situationsData, indicateursData, typeEntreprisesData])

  const isLoading = activeTab === 'secteurs' ? secteursLoading : activeTab === 'sous_secteurs' ? sousSecteursLoading : activeTab === 'pieces_identite' ? piecesLoading : activeTab === 'situation_matrimoniale' ? situationsLoading : activeTab === 'indicateurs' ? indicateursLoading : activeTab === 'type_entreprises' ? typeEntreprisesLoading : false

  return { columnDefs, data, isLoading }
}
