import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardBarChart } from '../../shared/components/DashboardBarChart'
import { usePartnerEtapes } from '../hooks/usePartnerEtapes'

export function PartnerDashboardEtapes() {
  const { etapeItems, isLoading } = usePartnerEtapes()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Projets par étape</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[180px] flex items-center justify-center text-sm text-gray-500">Chargement...</div>
        ) : (
          <DashboardBarChart items={etapeItems} height="180px" />
        )}
      </CardContent>
    </Card>
  )
}
