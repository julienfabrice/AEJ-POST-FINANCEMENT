import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { DataGrid } from '@/components/ui/DataGrid'
import { StatusBadge } from '../components/StatusBadge'
import { type Garantie } from '@/mock/recouvrement.mock'
import { money } from '@/helpers/money'

export function GarantiesTab({ garanties }: { garanties: Garantie[] }) {
  const columnDefs = useMemo(() => [
    { 
      headerName: "Dossier", 
      field: "projetId", 
      flex: 1, 
      cellRenderer: (params: any) => <b className="text-[#2D6BD4] cursor-pointer hover:underline">{params.value}</b> 
    },
    { 
      headerName: "Montant appelé", 
      field: "montantAppele", 
      width: 180,
      cellRenderer: (params: any) => <span className="font-mono text-[#D6453B]">{money(params.value)}</span>
    },
    { headerName: "Date du rappel", field: "dateRappel", width: 150 },
    { headerName: "Saisi par", field: "saisiPar", flex: 1, cellClass: "text-[#5A6B80]" },
  ], [])

  return (
    <Card className="p-0 border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)] overflow-hidden">
      <div className="flex items-center gap-3 px-[18px] py-[15px] border-b border-[#EEF2F7]">
        <h3 className="text-[14.5px] font-bold text-[#131C29]">Rappels de garantie</h3>
        <div className="flex-1" />
        <StatusBadge text={garanties.length} cls="gr" />
      </div>
      <div className="relative">
        <DataGrid
          rowData={garanties}
          columnDefs={columnDefs}
          height="400px"
          rowHeight={45}
          defaultColDef={{ sortable: true, filter: true, resizable: true }}
        />
      </div>
    </Card>
  )
}
