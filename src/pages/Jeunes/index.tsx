import { Card } from '@/components/ui/card'
import { DataGrid } from '@/components/ui/DataGrid'

import { JeunesHeader } from './UI/JeunesHeader'
import { JeunesFilters } from './UI/JeunesFilters'
import { useJeunesGrid } from './hooks/useJeunesGrid'

import { MOCK_JEUNES } from '@/mock'

export function JeunesPage() {
  const { columnDefs } = useJeunesGrid()

  return (
    <div className="space-y-6">
      <JeunesHeader />
      
      <JeunesFilters />

      <Card className="p-0 overflow-hidden border-slate-200">
        <DataGrid 
          rowData={MOCK_JEUNES} 
          columnDefs={columnDefs} 
          height="calc(100vh - 300px)"
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
