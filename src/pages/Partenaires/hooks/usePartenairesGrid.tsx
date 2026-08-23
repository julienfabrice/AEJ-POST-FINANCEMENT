import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'

import { useOrganismesGrid } from './organismes/useOrganismesGrid'
import { useTypeOrganismesGrid } from './type-organismes/useTypeOrganismesGrid'

export type PartenaireTab = 'partenaires' | 'types'

export function usePartenairesGrid(activeTab: PartenaireTab, searchQuery: string) {
  const partenaires = useOrganismesGrid(searchQuery)
  const types = useTypeOrganismesGrid(searchQuery)

  const byTab = { partenaires, types }

  const columnDefs = useMemo<ColDef[]>(() => byTab[activeTab].columnDefs, [activeTab, partenaires.columnDefs, types.columnDefs])
  const data = byTab[activeTab].data
  const isLoading = byTab[activeTab].isLoading
  const modalNode = byTab[activeTab].modalNode

  return { columnDefs, data, isLoading, modalNode }
}
