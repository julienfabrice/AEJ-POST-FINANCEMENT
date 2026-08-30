import { useState, useMemo } from 'react'
import {
  MOCK_LOTS,
  MOCK_DOSSIERS_APPROUVES,
  MOCK_DOSSIERS_REJETES,
  MOCK_DECAISSEMENTS, MOCK_GARANTIES,
  MOCK_PLANS
} from '@/mock/espacePartenaireFinancier.mock'

export type TabKey = 'lots' | 'approuves' | 'rejetes' | 'plans' | 'decaissements' | 'remboursements' | 'garanties'

export interface TabConfig {
  id: TabKey
  label: string
  count?: number
}

export function useEspacePartenaire() {
  const [activeTab, setActiveTab] = useState<TabKey>('lots')

  const tabsConfig = useMemo<TabConfig[]>(() => {
    const lotsEnCoursCount = MOCK_LOTS.filter((l) => l.statut !== 'RETOURNE').length
    const plansEnValidation = MOCK_PLANS.filter((p) => p.statut === 'EN_VALIDATION').length

    return [
      { id: 'lots', label: 'Lots reçus', count: lotsEnCoursCount },
      { id: 'approuves', label: 'Dossiers approuvés', count: MOCK_DOSSIERS_APPROUVES.length },
      { id: 'rejetes', label: 'Dossiers rejetés', count: MOCK_DOSSIERS_REJETES.length },
      { id: 'plans', label: 'Plans de décaissement', count: plansEnValidation },
      { id: 'decaissements', label: 'Décaissements', count: MOCK_DECAISSEMENTS.length },
      { id: 'remboursements', label: 'Remboursements' },
      { id: 'garanties', label: 'Rappels de garantie', count: MOCK_GARANTIES.length },
    ]
  }, [])

  return {
    activeTab,
    setActiveTab,
    tabsConfig,
  }
}
