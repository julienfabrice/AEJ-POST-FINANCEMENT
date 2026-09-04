import { useState, useMemo } from 'react'
import { lotsTransmissionServices } from '@/services/lotsTransmission.services'
import { projetsServices } from '@/services/projets.services'
import { planDecaissementServices } from '@/services/planDecaissements.services'
import { decaissementServices } from '@/services/decaissements.services'
import { remboursementServices } from '@/services/remboursements.services'

export type TabKey = 'lots' | 'approuves' | 'rejetes' | 'plans' | 'decaissements' | 'remboursements' | 'garanties'

export interface TabConfig {
  id: TabKey
  label: string
  count?: number
}

export function useEspacePartenaire() {
  const [activeTab, setActiveTab] = useState<TabKey>('lots')

  const { data: lots = [] } = lotsTransmissionServices.useGetAll()
  const { data: approuvesRes } = projetsServices.useGetAll(1, 10, { statut: 'APPROUVE' })
  const { data: rejetesRes } = projetsServices.useGetAll(1, 10, { statut: 'NON_APPROUVE' })
  const { data: plans = [] } = planDecaissementServices.useGetAll()
  const { data: decaissements = [] } = decaissementServices.useGetAll()
  const { data: remboursements = [] } = remboursementServices.useGetAll()

  const tabsConfig = useMemo<TabConfig[]>(() => {
    const lotsCount = Array.isArray(lots) ? lots.length : 0
    const approuvesCount = approuvesRes?.pagination?.total ?? (Array.isArray(approuvesRes?.data) ? approuvesRes.data.length : 0)
    const rejetesCount = rejetesRes?.pagination?.total ?? (Array.isArray(rejetesRes?.data) ? rejetesRes.data.length : 0)
    const plansCount = Array.isArray(plans) ? plans.length : 0
    const decaissementsCount = Array.isArray(decaissements) ? decaissements.length : 0
    const remboursementsCount = Array.isArray(remboursements) ? remboursements.length : 0

    return [
      { id: 'lots', label: 'Lots reçus', count: lotsCount },
      { id: 'approuves', label: 'Dossiers approuvés', count: approuvesCount },
      { id: 'rejetes', label: 'Dossiers rejetés', count: rejetesCount },
      { id: 'plans', label: 'Plans de décaissement', count: plansCount },
      { id: 'decaissements', label: 'Décaissements', count: decaissementsCount },
      { id: 'remboursements', label: 'Remboursements', count: remboursementsCount },
      { id: 'garanties', label: 'Rappels de garantie' },
    ]
  }, [lots, approuvesRes, rejetesRes, plans, decaissements, remboursements])

  return {
    activeTab,
    setActiveTab,
    tabsConfig,
  }
}

