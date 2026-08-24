import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'

import { useIndicateurTabGrid } from './indicateurs/useIndicateurTabGrid'
import { useRelevesGrid } from './releves/useRelevesGrid'
import { useFichesGrid } from './fiches/useFichesGrid'
import { useQuestionsGrid } from './questions/useQuestionsGrid'

export type IndicateurTab = 'plan' | 'ind' | 'rel' | 'fic' | 'q'

export function useIndicateursGrid(activeTab: IndicateurTab, searchQuery: string = '') {
  const { columnDefs: indDefs, data: indData, isLoading: indLoading } = useIndicateurTabGrid(searchQuery)
  const { columnDefs: relDefs, data: relData, isLoading: relLoading } = useRelevesGrid(searchQuery)
  const { columnDefs: ficDefs, data: ficData, isLoading: ficLoading } = useFichesGrid(searchQuery)
  const { columnDefs: qDefs, data: qData, isLoading: qLoading } = useQuestionsGrid(searchQuery)

  const columnDefs = useMemo<ColDef[]>(() => {
    switch (activeTab) {
      case 'ind': return indDefs
      case 'rel': return relDefs
      case 'fic': return ficDefs
      case 'q': return qDefs
      default: return []
    }
  }, [activeTab, indDefs, relDefs, ficDefs, qDefs])

  const data = useMemo(() => {
    switch (activeTab) {
      case 'ind': return indData
      case 'rel': return relData
      case 'fic': return ficData
      case 'q': return qData
      default: return []
    }
  }, [activeTab, indData, relData, ficData, qData])

  const isLoading = activeTab === 'ind' ? indLoading 
                  : activeTab === 'rel' ? relLoading 
                  : activeTab === 'fic' ? ficLoading 
                  : activeTab === 'q' ? qLoading 
                  : false

  return { columnDefs, data, isLoading, modalNode: null }
}
