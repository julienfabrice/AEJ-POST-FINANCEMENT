import { KPICard } from '@/components/ui/KPICard'
import { MOCK_DASHBOARD_STATS } from '@/mock'

export function AgentDashboardStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {MOCK_DASHBOARD_STATS.map((stat, i) => (
        <KPICard
          key={i}
          label={stat.label}
          value={stat.value}
          change={stat.change + ' ce mois'}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  )
}
