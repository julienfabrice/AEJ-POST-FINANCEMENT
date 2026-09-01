import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { DashboardProjectsGrid } from '../../shared/components/DashboardProjectsGrid'
import { projetsServices } from '@/services/projets.services'

interface Props {
  agencyId?: string | null
}

export function AgentDashboardRecentFiles({ agencyId }: Props) {
  const [filterDispositif, setFilterDispositif] = useState<string>('tous')

  const { data, isLoading } = projetsServices.useGetAll(1, 5, {
    agence_id: agencyId || undefined,
    dispositif_id: filterDispositif !== 'tous' ? filterDispositif : undefined,
  })

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Dossiers récents</CardTitle>
            <CardDescription>Les 5 derniers dossiers enregistrés sur la plateforme</CardDescription>
          </div>
          <Select defaultValue="tous" onValueChange={setFilterDispositif}>
            <SelectTrigger className="w-[180px] h-8 text-xs">
              <SelectValue placeholder="Filtrer par dispositif" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les dispositifs</SelectItem>
              <SelectItem value="1">AGR Classique</SelectItem>
              <SelectItem value="2">MEPS</SelectItem>
              <SelectItem value="3">MPE</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0 border-t border-slate-100">
        <DashboardProjectsGrid projects={data?.data ?? []} isLoading={isLoading} />
      </CardContent>
    </Card>
  )
}
