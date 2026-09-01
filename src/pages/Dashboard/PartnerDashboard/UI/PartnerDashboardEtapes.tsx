import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardBarChart } from '../../shared/components/DashboardBarChart'
import { MOCK_PF_ETAPES } from '@/mock'

export function PartnerDashboardEtapes() {
  const items = MOCK_PF_ETAPES.map(s => ({ label: s.label, value: s.value }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Projets par étape</CardTitle>
      </CardHeader>
      <CardContent>
        <DashboardBarChart items={items} height="180px" />
      </CardContent>
    </Card>
  )
}
