import { useMemo } from 'react'

import { useDivisionsGrid } from './divisions/useDivisionsGrid'
import { useVillesGrid } from './villes/useVillesGrid'
import { useCommunesGrid } from './communes/useCommunesGrid'
import { useLieuxGrid } from './lieux/useLieuxGrid'

export type LocaliteTab = 'divisions' | 'villes' | 'communes' | 'lieux'

export function useLocalitesGrid(activeTab: LocaliteTab, searchQuery: string) {
  const divisions = useDivisionsGrid(searchQuery)
  const villes = useVillesGrid(searchQuery)
  const communes = useCommunesGrid(searchQuery)
  const lieux = useLieuxGrid(searchQuery)

  const current = useMemo(() => {
    switch (activeTab) {
      case 'divisions': return divisions
      case 'villes': return villes
      case 'communes': return communes
      case 'lieux': return lieux
      default: return divisions
    }
  }, [activeTab, divisions, villes, communes, lieux])

  return { 
    columnDefs: current.columnDefs, 
    data: current.data, 
    isLoading: current.isLoading, 
    isError: current.isError, 
    error: current.error 
  }
}
