import { useState } from 'react'

export function useTransmission() {
  const [activeTab, setActiveTab] = useState<'composer' | 'lots'>('composer')

  return {
    activeTab,
    setActiveTab,
  }
}