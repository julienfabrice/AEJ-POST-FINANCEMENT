import { AgentDashboardHeader } from './UI/AgentDashboardHeader'
import { AgentDashboardStats } from './UI/AgentDashboardStats'
import { AgentDashboardRecentFiles } from './UI/AgentDashboardRecentFiles'

export function AgentDashboard() {
  return (
    <div className="space-y-6">
      <AgentDashboardHeader />
      <AgentDashboardStats />
      <AgentDashboardRecentFiles />
    </div>
  )
}
