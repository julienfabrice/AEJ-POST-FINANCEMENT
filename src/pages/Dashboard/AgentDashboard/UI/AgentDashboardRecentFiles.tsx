import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataGrid } from '@/components/ui/DataGrid'
import { useTableData } from '../hooks/useTableData'

import { MOCK_RECENT_PROJECTS } from '@/mock'

export function AgentDashboardRecentFiles() {
  const { columnDefs } = useTableData()

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Dossiers récents</CardTitle>
            <CardDescription>Les 5 derniers dossiers enregistrés sur la plateforme</CardDescription>
          </div>
          <Select defaultValue="tous">
            <SelectTrigger className="w-[180px] h-8 text-xs">
              <SelectValue placeholder="Filtrer par dispositif" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les dispositifs</SelectItem>
              <SelectItem value="agr">AGR Classique</SelectItem>
              <SelectItem value="meps">MEPS</SelectItem>
              <SelectItem value="mpe">MPE</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0 border-t border-slate-100">
        <DataGrid 
          rowData={MOCK_RECENT_PROJECTS} 
          columnDefs={columnDefs} 
          height="320px"
          rowHeight={55}
          pagination={false}
          defaultColDef={{
            sortable: true,
            filter: false,
            resizable: true,
          }}
        />
      </CardContent>
    </Card>
  )
}
