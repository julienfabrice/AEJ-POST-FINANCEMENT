import { useState, useCallback } from 'react'
import { MOCK_DISPOSITIFS_OPTS, MOCK_PROJETS_A_REPARTIR } from '@/mock/transmission.mock'

export function useTransmission() {
  const [activeTab, setActiveTab] = useState<'composer' | 'lots'>('composer')
  const [selectedGuichet, setSelectedGuichet] = useState(MOCK_DISPOSITIFS_OPTS[0].value)
  const [selectedDossiers, setSelectedDossiers] = useState<Set<string>>(new Set())

  const handleSelectAll = useCallback(() => {
    setSelectedDossiers(new Set(MOCK_PROJETS_A_REPARTIR.map((p) => p.id)))
  }, [])

  const toggleDossier = useCallback((id: string) => {
    setSelectedDossiers((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  return {
    activeTab,
    setActiveTab,
    selectedGuichet,
    setSelectedGuichet,
    selectedDossiers,
    handleSelectAll,
    toggleDossier,
  }
}
