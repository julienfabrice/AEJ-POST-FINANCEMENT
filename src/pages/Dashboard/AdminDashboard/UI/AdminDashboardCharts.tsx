import { DashboardCard } from '../../shared/components/DashboardCard'
import { DashboardBarChart } from '../../shared/components/DashboardBarChart'
import { DashboardHBarChart } from '../../shared/components/DashboardHBarChart'
import { DashboardStatCard } from '../../shared/components/DashboardStatCard'
import { useAdminCharts } from '../hooks/useAdminCharts'

export function AdminDashboardCharts() {
  const { etapeItems, regionItems, agenceItems, suiviStats, isLoading } = useAdminCharts()

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Micro-projets par étape du parcours">
          {isLoading ? (
            <div className="h-[170px] flex items-center justify-center text-sm text-gray-500">Chargement...</div>
          ) : (
            <DashboardBarChart items={etapeItems} />
          )}
        </DashboardCard>

        <DashboardCard title="Projets financés par région">
          <DashboardHBarChart items={regionItems} />
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Projets financés par agence">
          <DashboardHBarChart items={agenceItems} />
        </DashboardCard>

        <DashboardCard title="Situation du suivi terrain">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px]">
            {suiviStats.map((s, i) => (
              <DashboardStatCard key={i} label={s.label} value={s.value} color={s.color} />
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  )
}
