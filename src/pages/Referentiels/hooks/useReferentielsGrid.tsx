import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'

import { ActionsCellRenderer } from '../components/ActionsCellRenderer'
import { BadgeCellRenderer } from '../components/BadgeCellRenderer'
import { PrimaryTextCellRenderer } from '../components/PrimaryTextCellRenderer'
import { useSecteursGrid } from './useSecteursGrid'
import { useSousSecteursGrid } from './useSousSecteursGrid'
import { usePiecesIdentiteGrid } from './usePiecesIdentiteGrid'

import {
  MOCK_TYPE_ENTREPRISES,
  MOCK_SITUATION_MATRIMONIALE,
  MOCK_TYPE_EMPLOIS,
  MOCK_INDICATEURS
} from '@/mock'

export type ReferentielTab = 'secteurs' | 'sous_secteurs' | 'type_entreprises' | 'pieces_identite' | 'situation_matrimoniale' | 'type_emplois' | 'indicateurs'

export function useReferentielsGrid(activeTab: ReferentielTab, searchQuery: string) {
  // Hooks spécifiques
  const { columnDefs: secteursDefs, data: secteursData, isLoading: secteursLoading } = useSecteursGrid(searchQuery)
  const { columnDefs: sousSecteursDefs, data: sousSecteursData, isLoading: sousSecteursLoading } = useSousSecteursGrid(searchQuery)
  const { columnDefs: piecesDefs, data: piecesData, isLoading: piecesLoading } = usePiecesIdentiteGrid(searchQuery)

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
      case 'type_entreprises': return [
          { field: 'id', headerName: 'ID', width: 80, cellClass: 'font-mono text-slate-500' },
          { field: 'libelle', headerName: 'Type d\'entreprise', flex: 1, cellRenderer: PrimaryTextCellRenderer },
          commonAction
        ]
      case 'pieces_identite': return piecesDefs
      case 'situation_matrimoniale': return [
          { field: 'id', headerName: 'ID', width: 80, cellClass: 'font-mono text-slate-500' },
          { field: 'libelle', headerName: 'Situation matrimoniale', flex: 1, cellRenderer: PrimaryTextCellRenderer },
          commonAction
        ]
      case 'type_emplois': return [
          { field: 'id', headerName: 'ID', width: 80, cellClass: 'font-mono text-slate-500' },
          { field: 'libelle', headerName: 'Type d\'emploi', flex: 1, cellRenderer: PrimaryTextCellRenderer },
          commonAction
        ]
      case 'indicateurs': return [
          { field: 'id', headerName: 'ID', width: 80, cellClass: 'font-mono text-slate-500' },
          { field: 'libelle', headerName: 'Indicateur', flex: 1, cellRenderer: PrimaryTextCellRenderer },
          { field: 'unite', headerName: 'Unité', width: 150, cellRenderer: BadgeCellRenderer },
          { field: 'type_valeur', headerName: 'Type de valeur', width: 150 },
          commonAction
        ]
      default: return []
    }
  }, [activeTab, secteursDefs, sousSecteursDefs, piecesDefs])

  // Données et recherche pour les onglets qui utilisent encore les mocks
  const data = useMemo(() => {
    if (activeTab === 'secteurs') return secteursData
    if (activeTab === 'sous_secteurs') return sousSecteursData
    if (activeTab === 'pieces_identite') return piecesData

    let currentMock: any[] = []
    switch (activeTab) {
      case 'type_entreprises': currentMock = MOCK_TYPE_ENTREPRISES; break;
      case 'situation_matrimoniale': currentMock = MOCK_SITUATION_MATRIMONIALE; break;
      case 'type_emplois': currentMock = MOCK_TYPE_EMPLOIS; break;
      case 'indicateurs': currentMock = MOCK_INDICATEURS; break;
    }

    if (!searchQuery.trim()) return currentMock

    const fuse = new Fuse(currentMock, {
      keys: ['libelle', 'secteur', 'id', 'unite', 'type_valeur'],
      threshold: 0.3,
      ignoreLocation: true
    })
    return fuse.search(searchQuery).map(res => res.item)
  }, [activeTab, searchQuery, secteursData, sousSecteursData, piecesData])

  const isLoading = activeTab === 'secteurs' ? secteursLoading : activeTab === 'sous_secteurs' ? sousSecteursLoading : activeTab === 'pieces_identite' ? piecesLoading : false

  return { columnDefs, data, isLoading }
}
