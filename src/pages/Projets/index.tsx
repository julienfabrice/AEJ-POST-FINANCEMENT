import { ProjetsHeader } from './UI/ProjetsHeader'
import { ProjetsFilters } from './UI/ProjetsFilters'
import { ListZone } from './UI/ListZone'
import { ProjetDetailsSheet } from './UI/ProjetDetailsSheet'

export function ProjetsPage() {
  return (
    <div className="space-y-6">
      <ProjetsHeader />

      <ProjetsFilters />
      
      <ListZone />

      {/* Drawer d'informations détaillées */}
      <ProjetDetailsSheet />
    </div>
  )
}
