import { FolderOpen, ClipboardList, Banknote, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const STATS = [
  { label: 'Total dossiers', value: '1 256', change: '+12 cette semaine', icon: FolderOpen, color: '#E7722B' },
  { label: 'En instruction', value: '127', change: '42 à certifier', icon: ClipboardList, color: '#2D6BD4' },
  { label: 'Financés', value: '874', change: '+8 ce mois', icon: Banknote, color: '#20A83A' },
  { label: 'Taux de couverture', value: '78%', change: '+2,1 pts', icon: TrendingUp, color: '#E0A106' },
]

export function ProjetsStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map((stat, i) => {
        const Icon = stat.icon
        return (
          <Card key={i} className="border-slate-100 shadow-sm">
            <CardContent className="p-5 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#5A6B80] mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-[#131C29]">{stat.value}</h3>
                <p className="text-xs font-medium mt-1" style={{ color: stat.color }}>
                  {stat.change}
                </p>
              </div>
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-opacity-10"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <Icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
