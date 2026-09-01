import { PartnerDashboardHeader } from './UI/PartnerDashboardHeader'
import { PartnerDashboardKpis } from './UI/PartnerDashboardKpis'
import { PartnerDashboardLots } from './UI/PartnerDashboardLots'
import { PartnerDashboardEtapes } from './UI/PartnerDashboardEtapes'

export function PartnerDashboard() {
  return (
    <div className="space-y-6">
      <PartnerDashboardHeader />
      <PartnerDashboardKpis />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PartnerDashboardLots />
        </div>
        <div className="lg:col-span-1">
          <PartnerDashboardEtapes />
        </div>
      </div>
    </div>
  )
}
