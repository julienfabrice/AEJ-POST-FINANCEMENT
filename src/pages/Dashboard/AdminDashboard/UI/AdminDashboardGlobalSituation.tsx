import { DashboardCard } from '../../shared/components/DashboardCard'
import { DashboardStatCard } from '../../shared/components/DashboardStatCard'
import { MOCK_SITUATION_GLOBALE } from '@/mock'

export function AdminDashboardGlobalSituation() {
  const { sollicite, finance, nbFinances, nbTotal, tauxCouverture } = MOCK_SITUATION_GLOBALE

  const stats = [
    { label: "Montant total sollicité", value: sollicite, suffix: "F", color: '#131C29' },
    { label: "Montant total financé", value: finance, suffix: "F", color: '#20A83A' },
    { label: "Projets financés", value: `${nbFinances}`, suffix: `/ ${nbTotal}`, color: '#2D6BD4' },
    { label: "Taux de couverture", value: `${tauxCouverture}%`, color: '#E7722B' },
  ]

  return (
    <DashboardCard title="Situation globale des financements">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[10px]">
        {stats.map((s, i) => (
          <DashboardStatCard key={i} {...s} />
        ))}
      </div>
    </DashboardCard>
  )
}
