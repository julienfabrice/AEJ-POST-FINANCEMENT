import { useState, useMemo } from 'react'
import {
  MOCK_PROJETS_RECOUVREMENT,
  MOCK_ACTIONS_RECOUVREMENT,
  MOCK_GARANTIES,
  type RecouvrementTab
} from '@/mock/recouvrement.mock'

export function useRecouvrement() {
  const [activeTab, setActiveTab] = useState<RecouvrementTab>('portefeuille')
  const [projets, setProjets] = useState(MOCK_PROJETS_RECOUVREMENT)

  // Categorize for Portefeuille
  const aJour = useMemo(() => projets.filter((p) => !p.contentieux && p.nbImpayes === 0), [projets])
  const leger = useMemo(() => projets.filter((p) => !p.contentieux && p.nbImpayes > 0 && p.nbImpayes <= 3), [projets])
  const lourd = useMemo(() => projets.filter((p) => !p.contentieux && p.nbImpayes > 3), [projets])
  
  // Contentieux
  const contentieux = useMemo(() => projets.filter((p) => p.contentieux), [projets])

  function handleActionAmiable(id: string) {
    // Dans la maquette ça ouvre une modale. Pour l'instant on fait juste une alerte.
    alert(`Ouvrir modale d'action pour le dossier ${id}`)
  }

  function handleSortirPortefeuille(id: string) {
    if (confirm(`Sortir ce dossier du portefeuille et saisir l'avocat de l'AEJ ?`)) {
      setProjets((prev) =>
        prev.map((p) => (p.id === id ? { ...p, contentieux: true } : p))
      )
    }
  }

  return {
    activeTab,
    setActiveTab,
    projets,
    aJour,
    leger,
    lourd,
    contentieux,
    actions: MOCK_ACTIONS_RECOUVREMENT,
    garanties: MOCK_GARANTIES,
    handleActionAmiable,
    handleSortirPortefeuille
  }
}
