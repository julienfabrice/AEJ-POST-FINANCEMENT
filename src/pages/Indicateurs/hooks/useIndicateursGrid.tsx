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

    return { columnDefs, data, isLoading , modalNode }

}
