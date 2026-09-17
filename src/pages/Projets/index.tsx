import { useEffect } from 'react'
import { useSearch } from '@tanstack/react-router'
import { ProjetsHeader } from './UI/ProjetsHeader'
import { ProjetsFilters } from './UI/ProjetsFilters'
import { ListZone } from './UI/ListZone'
import { ProjetDetailsSheet } from './UI/ProjetDetailsSheet'
import { JoindrePlanModal } from './UI/JoindrePlanModal'
import { DecaissementModal } from './UI/DecaissementModal'
import { useProjetsStore } from '@/store/useProjetsStore'

export function ProjetsPage() {
  const { guichet_id } = useSearch({ from: '/_authenticated/_agent/projets' })
  const { setFilters } = useProjetsStore()

  // Synchronise le guichet_id de l'URL dans les filtres du store au montage
  useEffect(() => {
    if (guichet_id) {
      setFilters({ guichet_id })
    } else {
      // Quand on arrive sans guichet_id (via sidebar), on retire le filtre guichet
      setFilters({ guichet_id: undefined })
    }
  }, [guichet_id, setFilters])

  return (
    <div className="space-y-6">
      <ProjetsHeader />

      <ProjetsFilters />
      
      <ListZone />

      {/* Drawer d'informations détaillées */}
      <ProjetDetailsSheet />

      {/* Modals pour les actions sur les projets */}
      <JoindrePlanModal />
      <DecaissementModal />
    </div>
  )
}
