import { AgentDashboardHeader } from './UI/AgentDashboardHeader'
import { AgentDashboardStats } from './UI/AgentDashboardStats'
import { AgentDashboardRecentFiles } from './UI/AgentDashboardRecentFiles'

interface Props {
  agencyId?: string | null
}

export function AgentDashboard({ agencyId }: Props) {
  return (
    <div className="space-y-6">
      <AgentDashboardHeader agencyId={agencyId} />
      <AgentDashboardStats agencyId={agencyId} />
      <AgentDashboardRecentFiles agencyId={agencyId} />
    </div>
  )
}
