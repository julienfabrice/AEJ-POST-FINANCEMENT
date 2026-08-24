import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'

import { useDirectionsGrid } from './directions/useDirectionsGrid'
import { useServicesOrgGrid } from './services-org/useServicesOrgGrid'
import { useFonctionsGrid } from './fonctions/useFonctionsGrid'
import { useGuichetsGrid } from './guichets/useGuichetsGrid'
import { useAgencesRegionalesGrid } from './agences-regionales/useAgencesRegionalesGrid'

export type UniteTab = 'agences' | 'guichets' | 'directions' | 'services' | 'fonctions'

export function useUnitesGrid(activeTab: UniteTab, searchQuery: string) {
  const agences = useAgencesRegionalesGrid(searchQuery)
  const guichets = useGuichetsGrid(searchQuery)
  const directions = useDirectionsGrid(searchQuery)
  const services = useServicesOrgGrid(searchQuery)
  const fonctions = useFonctionsGrid(searchQuery)

  const byTab = { agences, guichets, directions, services, fonctions }

  const columnDefs = useMemo<ColDef[]>(() => byTab[activeTab].columnDefs, [activeTab, agences.columnDefs, guichets.columnDefs, directions.columnDefs, services.columnDefs, fonctions.columnDefs])
  const data = byTab[activeTab].data
  const isLoading = byTab[activeTab].isLoading
  const modalNode = byTab[activeTab].modalNode

  return { columnDefs, data, isLoading, modalNode }
}
