import { useState } from 'react'

export function useFinancements() {
  const [activeTab, setActiveTab] = useState<'budgets' | 'depenses'>('budgets')

  return {
    activeTab,
    setActiveTab,
  }
}
