import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardProjectsGrid } from '../../shared/components/DashboardProjectsGrid'
import { usePartnerLots } from '../hooks/usePartnerLots'

export function PartnerDashboardLots() {
  const { data, isLoading } = usePartnerLots()

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle>Dossiers récents</CardTitle>
      </CardHeader>
      <CardContent className="p-0 border-t border-slate-100">
        <DashboardProjectsGrid projects={data} isLoading={isLoading} />
      </CardContent>
    </Card>
  )
}
