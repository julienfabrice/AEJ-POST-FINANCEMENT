import { Card } from '@/components/ui/card'
import { DataGrid } from '@/components/ui/DataGrid'

import { ProjetsHeader } from './UI/ProjetsHeader'
import { ProjetsStats } from './UI/ProjetsStats'
import { ProjetsFilters } from './UI/ProjetsFilters'
import { useTableData } from './hooks/useTableData'

import { MOCK_PROJETS } from '@/mock'

export function ProjetsPage() {
  const { columnDefs } = useTableData()

  return (
    <div className="space-y-6">
      <ProjetsHeader />

      <ProjetsStats />

      <ProjetsFilters />

      <Card className="p-0 overflow-hidden border-slate-200">
        <DataGrid
          rowData={MOCK_PROJETS}
          columnDefs={columnDefs}
          height="calc(100vh - 400px)"
          rowHeight={60}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
          }}
        />
      </Card>
    </div>
  )
}
