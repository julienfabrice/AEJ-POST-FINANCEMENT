import { useState, useMemo } from 'react'
import {
  MOCK_LOTS,
  MOCK_DOSSIERS_APPROUVES,
  MOCK_DOSSIERS_REJETES,
  MOCK_DECAISSEMENTS,
  MOCK_REMBOURSEMENTS,
  MOCK_GARANTIES,
  MOCK_PLANS,
} from '@/mock/espacePartenaireFinancier.mock'

export type TabKey = 'lots' | 'approuves' | 'rejetes' | 'plans' | 'decaissements' | 'remboursements' | 'garanties'

export interface TabConfig {
  id: TabKey
  label: string
  count?: number
}

export function useEspacePartenaire() {
  const [activeTab, setActiveTab] = useState<TabKey>('lots')

  const kpis = useMemo(() => {
    const lotsEnCoursCount = MOCK_LOTS.filter((l) => l.statut !== 'RETOURNE').length
    const plansEnValidation = MOCK_PLANS.filter((p) => p.statut === 'EN_VALIDATION').length
    const impayes = MOCK_REMBOURSEMENTS.filter((r) => r.statut !== 'A_JOUR').length
    
    return {
      lotsEnCoursCount,
      lotsTotal: MOCK_LOTS.length,
      dossiersApprouvesCount: MOCK_DOSSIERS_APPROUVES.length,
      dossiersTotal: MOCK_LOTS.flatMap((l) => l.dossiers).length,
      plansEnValidation,
      plansTotal: MOCK_PLANS.length,
      impayes,
    }
  }, [])

  const tabsConfig = useMemo<TabConfig[]>(() => [
    { id: 'lots', label: 'Lots reçus', count: kpis.lotsEnCoursCount },
    { id: 'approuves', label: 'Dossiers approuvés', count: MOCK_DOSSIERS_APPROUVES.length },
    { id: 'rejetes', label: 'Dossiers rejetés', count: MOCK_DOSSIERS_REJETES.length },
    { id: 'plans', label: 'Plans de décaissement', count: kpis.plansEnValidation },
    { id: 'decaissements', label: 'Décaissements', count: MOCK_DECAISSEMENTS.length },
    { id: 'remboursements', label: 'Remboursements' },
    { id: 'garanties', label: 'Rappels de garantie', count: MOCK_GARANTIES.length },
  ], [kpis])

  return {
    activeTab,
    setActiveTab,
    kpis,
    tabsConfig,
  }
}
