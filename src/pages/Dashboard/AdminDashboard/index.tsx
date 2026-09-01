import { AdminDashboardKpis } from './UI/AdminDashboardKpis'
import { AdminDashboardGlobalSituation } from './UI/AdminDashboardGlobalSituation'
import { AdminDashboardCharts } from './UI/AdminDashboardCharts'
import { AdminDashboardBottom } from './UI/AdminDashboardBottom'

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <AdminDashboardKpis />
      <AdminDashboardGlobalSituation />
      <AdminDashboardCharts />
      <AdminDashboardBottom />
    </div>
  )
}
