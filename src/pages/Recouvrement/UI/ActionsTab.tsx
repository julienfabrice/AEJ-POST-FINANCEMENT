import { useMemo } from 'react'
import { FileText } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { DataGrid } from '@/components/ui/DataGrid'
import { StatusBadge } from '../components/StatusBadge'
import { type ActionRecouvrement, RECOUV_TYPE_LABEL } from '@/mock/recouvrement.mock'

export function ActionsTab({ actions }: { actions: ActionRecouvrement[] }) {
  const columnDefs = useMemo(() => [
    { 
      headerName: "Dossier", 
      field: "projetId", 
      flex: 1, 
      cellRenderer: (params: any) => <b className="text-[#2D6BD4] cursor-pointer hover:underline">{params.value}</b> 
    },
    { 
      headerName: "Action", 
      field: "type", 
      width: 180,
      cellRenderer: (params: any) => {
        const type = params.value as string
        const cls = type === 'CONTENTIEUX' ? 'rd' : (type === 'COURRIER' ? 'am' : 'bl')
        return <StatusBadge text={RECOUV_TYPE_LABEL[type as keyof typeof RECOUV_TYPE_LABEL] || type} cls={cls} />
      }
    },
    { headerName: "Date", field: "date", width: 120 },
    { headerName: "Agent", field: "agent", width: 150, cellClass: "text-[#5A6B80]" },
    { headerName: "Résultat", field: "resultat", flex: 2, cellClass: "text-[#5A6B80]" },
    { 
      headerName: "Pièce", 
      field: "piece", 
      width: 150,
      cellRenderer: (params: any) => params.value ? (
        <span className="text-[#5A6B80] hover:underline cursor-pointer flex items-center gap-1 h-full">
          <FileText size={14} /> {params.value}
        </span>
      ) : <span className="text-[#5A6B80]">—</span>
    }
  ], [])

  return (
    <Card className="p-0 border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)] overflow-hidden">
      <div className="flex items-center gap-3 px-[18px] py-[15px] border-b border-[#EEF2F7]">
        <h3 className="text-[14.5px] font-bold text-[#131C29]">Actions de recouvrement</h3>
        <div className="flex-1" />
        <StatusBadge text={actions.length} cls="am" />
      </div>
      <div className="relative">
        <DataGrid
          rowData={actions}
          columnDefs={columnDefs}
          height="400px"
          rowHeight={45}
          defaultColDef={{ sortable: true, filter: true, resizable: true }}
        />
      </div>
    </Card>
  )
}
