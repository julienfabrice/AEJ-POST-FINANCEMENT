import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'
import Fuse from 'fuse.js'

import { useSecteursGrid } from './useSecteursGrid'
import { useSousSecteursGrid } from './useSousSecteursGrid'
import { usePiecesIdentiteGrid } from './usePiecesIdentiteGrid'
import { useSituationsMatrimonialesGrid } from './useSituationsMatrimonialesGrid'
import { useIndicateursGrid } from './useIndicateursGrid'
import { useTypeEntreprisesGrid } from './useTypeEntreprisesGrid'
import { useTypeEmploisGrid } from './useTypeEmploisGrid'

import {
  MOCK_TYPE_EMPLOIS,
  
} from '@/mock'

export type ReferentielTab = 'secteurs' | 'sous_secteurs' | 'type_entreprises' | 'pieces_identite' | 'situation_matrimoniale' | 'type_emplois' | 'indicateurs'

export function useReferentielsGrid(activeTab: ReferentielTab, searchQuery: string) {
  // Hooks spécifiques
  const { columnDefs: secteursDefs, data: secteursData, isLoading: secteursLoading, modalNode: secteursModal } = useSecteursGrid(searchQuery)
  const { columnDefs: sousSecteursDefs, data: sousSecteursData, isLoading: sousSecteursLoading, modalNode: sousSecteursModal } = useSousSecteursGrid(searchQuery)
  const { columnDefs: piecesDefs, data: piecesData, isLoading: piecesLoading } = usePiecesIdentiteGrid(searchQuery)
  const { columnDefs: situationsDefs, data: situationsData, isLoading: situationsLoading, modalNode: situationsModal } = useSituationsMatrimonialesGrid(searchQuery)
  const { columnDefs: indicateursDefs, data: indicateursData, isLoading: indicateursLoading, modalNode: indicateursModal } = useIndicateursGrid(searchQuery)
  const { columnDefs: typeEntreprisesDefs, data: typeEntreprisesData, isLoading: typeEntreprisesLoading, modalNode: typeEntreprisesModal } = useTypeEntreprisesGrid(searchQuery)
  const { columnDefs: typeEmploisDefs, data: typeEmploisData, isLoading: typeEmploisLoading, modalNode: typeEmploisModal } = useTypeEmploisGrid(searchQuery)

  const columnDefs = useMemo<ColDef[]>(() => {
    
    switch (activeTab) {
      case 'secteurs': return secteursDefs
      case 'sous_secteurs': return sousSecteursDefs
      case 'type_entreprises': return typeEntreprisesDefs
      case 'pieces_identite': return piecesDefs
      case 'situation_matrimoniale': return situationsDefs
      case 'type_emplois': return typeEmploisDefs
      case 'indicateurs': return indicateursDefs
      default: return []
    }
  }, [activeTab, secteursDefs, sousSecteursDefs, piecesDefs, situationsDefs, indicateursDefs, typeEntreprisesDefs, typeEmploisDefs])

  // Données et recherche pour les onglets qui utilisent encore les mocks
  const data = useMemo(() => {
    if (activeTab === 'secteurs') return secteursData
    if (activeTab === 'sous_secteurs') return sousSecteursData
    if (activeTab === 'pieces_identite') return piecesData
    if (activeTab === 'situation_matrimoniale') return situationsData
    if (activeTab === 'indicateurs') return indicateursData
    if (activeTab === 'type_entreprises') return typeEntreprisesData
    if (activeTab === 'type_emplois') return typeEmploisData

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
  }, [activeTab, searchQuery, secteursData, sousSecteursData, piecesData, situationsData, indicateursData, typeEntreprisesData, typeEmploisData])

  const isLoading = activeTab === 'secteurs' ? secteursLoading : activeTab === 'sous_secteurs' ? sousSecteursLoading : activeTab === 'pieces_identite' ? piecesLoading : activeTab === 'situation_matrimoniale' ? situationsLoading : activeTab === 'indicateurs' ? indicateursLoading : activeTab === 'type_entreprises' ? typeEntreprisesLoading : activeTab === 'type_emplois' ? typeEmploisLoading : false

  
  const modalNode = useMemo(() => {
    if (activeTab === 'type_entreprises') return typeEntreprisesModal
    if (activeTab === 'type_emplois') return typeEmploisModal
    if (activeTab === 'indicateurs') return indicateursModal
    if (activeTab === 'secteurs') return secteursModal
    if (activeTab === 'sous_secteurs') return sousSecteursModal
    if (activeTab === 'situation_matrimoniale') return situationsModal
    return null
  }, [activeTab, typeEntreprisesModal, secteursModal, sousSecteursModal, situationsModal, typeEmploisModal, indicateursModal])

  return { columnDefs, data, isLoading, modalNode }
}
