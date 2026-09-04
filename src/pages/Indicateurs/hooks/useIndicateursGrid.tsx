import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'

import { useIndicateurTabGrid } from './indicateurs/useIndicateurTabGrid'
import { useRelevesGrid } from './releves/useRelevesGrid'
import { useFichesGrid } from './fiches/useFichesGrid'
import { useQuestionsGrid } from './questions/useQuestionsGrid'

export type IndicateurTab =  'plan' | 'indicateurs' | 'releves' | 'fiches' | 'questions'

export function useIndicateursGrid(activeTab: IndicateurTab, searchQuery: string = '') {

    const plan = {columnDefs: [], data: [],  isLoading: null, modalNode: null}
    const indicateurs = useIndicateurTabGrid(searchQuery)
    const releves = useRelevesGrid(searchQuery)
    const fiches = useFichesGrid(searchQuery)
    const questions = useQuestionsGrid(searchQuery)

    const byTab = { indicateurs, releves, fiches, questions, plan}

    const columnDefs = useMemo<ColDef[]>(
        () => byTab[activeTab].columnDefs,
        [activeTab])



    const data = byTab[activeTab].data
    const isLoading = byTab[activeTab].isLoading
    const modalNode = byTab[activeTab].modalNode

    console.log(activeTab)

    return { columnDefs, data, isLoading , modalNode }






  // const { columnDefs: indDefs, data: indData, isLoading: indLoading, modalNode: indModalNode } = useIndicateurTabGrid(searchQuery)
  // const { columnDefs: relDefs, data: relData, isLoading: relLoading, modalNode: relModalNode } = useRelevesGrid(searchQuery)
  // const { columnDefs: ficDefs, data: ficData, isLoading: ficLoading, modalNode: ficModalNode } = useFichesGrid(searchQuery)
  // const { columnDefs: qDefs, data: qData, isLoading: qLoading, modalNode: qModalNode } = useQuestionsGrid(searchQuery)
  //
  // const columnDefs = useMemo<ColDef[]>(() => {
  //   switch (activeTab) {
  //     case 'indicateurs': return indDefs
  //     case 'releves': return relDefs
  //     case 'fiches': return ficDefs
  //     case 'questions': return qDefs
  //     default: return []
  //   }
  // }, [activeTab, indDefs, relDefs, ficDefs, qDefs])
  //
  // const data = useMemo(() => {
  //   switch (activeTab) {
  //     case 'indicateurs': return indData
  //     case 'releves': return relData
  //     case 'fiches': return ficData
  //     case 'questions': return qData
  //     default: return []
  //   }
  // }, [activeTab, indData, relData, ficData, qData])
  //
  // const isLoading = activeTab === 'indicateurs' ? indLoading
  //                 : activeTab === 'releves' ? relLoading
  //                 : activeTab === 'fiches' ? ficLoading
  //                 : activeTab === 'questions' ? qLoading
  //                 : false
  //
  //   const modalNode = useMemo(() => {
  //       if (activeTab === 'indicateurs') return indModalNode
  //       if (activeTab === 'releves') return relModalNode
  //       return null
  //   }, [activeTab])
  //
  //
  // return { columnDefs, data, isLoading, modalNode: modalNode }
}
