import { AdminDashboardKpis } from './UI/AdminDashboardKpis'
import { AdminDashboardGlobalSituation } from './UI/AdminDashboardGlobalSituation'
import { AdminDashboardCharts } from './UI/AdminDashboardCharts'
import { AdminDashboardEntreprises } from './UI/AdminDashboardEntreprises'
import { AdminDashboardBottom } from './UI/AdminDashboardBottom'
import { DashboardCard } from '../shared/components/DashboardCard'

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <AdminDashboardKpis />
      <AdminDashboardGlobalSituation />
      <AdminDashboardCharts />
      <DashboardCard title="Entreprises & Emplois">
        <AdminDashboardEntreprises />
      </DashboardCard>
      <AdminDashboardBottom />
    </div>
  )
}

