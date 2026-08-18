import { FolderOpen, ClipboardList, Banknote, TrendingUp } from 'lucide-react'
import { KPICard } from '@/components/ui/KPICard'

const STATS = [
  { label: 'Total dossiers', value: '1 256', change: '+12 cette semaine', icon: FolderOpen, color: '#E7722B' },
  { label: 'En instruction', value: '127', change: '42 à certifier', icon: ClipboardList, color: '#2D6BD4' },
  { label: 'Financés', value: '874', change: '+8 ce mois', icon: Banknote, color: '#20A83A' },
  { label: 'Taux de couverture', value: '78%', change: '+2,1 pts', icon: TrendingUp, color: '#E0A106' },
]

export function ProjetsStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map((stat, i) => (
        <KPICard
          key={i}
          label={stat.label}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  )
}
