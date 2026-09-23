import { useMemo } from 'react'
import { tableauAmortissementServices } from '@/services/tableauAmortissements.services'
import { formatDate } from '@/helpers/date'
import { money } from '@/helpers/money'
import { Badge } from '@/components/ui/badge'
import { DataGrid } from '@/components/ui/DataGrid'
import type { ColDef } from 'ag-grid-community'

interface TableauAmortissementSectionProps {
  planRemboursementId?: number
}

export function TableauAmortissementSection({ planRemboursementId }: TableauAmortissementSectionProps) {
  const { data: amortissements, isLoading } = tableauAmortissementServices.useGetAll(planRemboursementId)

  const totals = useMemo(() => {
    if (!amortissements) return null
    return amortissements.reduce(
      (acc, curr) => ({
        montant: acc.montant + Number(curr.montant_echeance || 0),
        capital: acc.capital + Number(curr.amortissement_capital || 0),
        interets: acc.interets + Number(curr.interets || 0),
      }),
      { montant: 0, capital: 0, interets: 0 }
    )
  }, [amortissements])

  const pinnedBottomRowData = useMemo(() => {
    if (!totals) return []
    return [{
      periode: 'Total',
      date_echeance: null,
      montant_echeance: totals.montant,
      amortissement_capital: totals.capital,
      interets: totals.interets,
      capital_restant: null,
      statut: null,
    }]
  }, [totals])

  const getStatutBadge = (statut: string | null) => {
    if (!statut) return null
    switch (statut) {
      case 'PAYE':
        return <Badge className="bg-aej-green-soft text-aej-green-deep hover:bg-aej-green-soft shadow-none border-0 px-2 py-0.5 text-[11px]">Payé</Badge>
      case 'PARTIEL':
        return <Badge className="bg-orange-50 text-orange-600 hover:bg-orange-50 shadow-none border-0 px-2 py-0.5 text-[11px]">Partiel</Badge>
      case 'NON_PAYE':
        return <Badge className="bg-red-50 text-red-600 hover:bg-red-50 shadow-none border-0 px-2 py-0.5 text-[11px]">Non payé</Badge>
      default:
        return <Badge className="bg-aej-line-2 text-aej-ink-3 hover:bg-aej-line shadow-none border-0 px-2 py-0.5 text-[11px]">{statut}</Badge>
    }
  }

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: 'periode',
        headerName: 'Pér.',
        width: 80,
        pinned: 'left',
        cellRenderer: (params: any) => {
          if (params.node.rowPinned) {
            return <span className="font-bold text-aej-ink">{params.value}</span>
          }
          return <span className="font-medium text-aej-ink">{params.value}</span>
        }
      },
      {
        field: 'date_echeance',
        headerName: "Date d'échéance",
        flex: 1,
        minWidth: 150,
        valueFormatter: (params) => params.value ? formatDate(params.value) : '',
      },
      {
        field: 'montant_echeance',
        headerName: 'Montant',
        flex: 1,
        minWidth: 160,
        type: 'numericColumn',
        cellRenderer: (params: any) => {
          const val = params.value != null ? Number(params.value) : null
          const content = val != null ? money(val) : '—'
          if (params.node.rowPinned) {
            return <span className="font-bold text-aej-ink">{content}</span>
          }
          return <span className="font-semibold text-aej-ink">{content}</span>
        }
      },
      {
        field: 'amortissement_capital',
        headerName: 'Capital remb.',
        flex: 1,
        minWidth: 160,
        type: 'numericColumn',
        cellRenderer: (params: any) => {
          const val = params.value != null ? Number(params.value) : null
          const content = val != null ? money(val) : '—'
          if (params.node.rowPinned) {
            return <span className="font-bold text-aej-ink">{content}</span>
          }
          return <span className="text-aej-ink-3">{content}</span>
        }
      },
      {
        field: 'interets',
        headerName: 'Intérêts',
        flex: 1,
        minWidth: 150,
        type: 'numericColumn',
        cellRenderer: (params: any) => {
          const val = params.value != null ? Number(params.value) : null
          const content = val != null ? money(val) : '—'
          if (params.node.rowPinned) {
            return <span className="font-bold text-aej-ink">{content}</span>
          }
          return <span className="text-aej-ink-3">{content}</span>
        }
      },
      {
        field: 'capital_restant',
        headerName: 'Capital restant',
        flex: 1,
        minWidth: 160,
        type: 'numericColumn',
        valueFormatter: (params) => {
          const val = params.value != null ? Number(params.value) : null
          return val != null ? money(val) : '—'
        },
        cellClass: params => params.node.rowPinned ? '' : 'text-aej-ink-3'
      },
      {
        field: 'statut',
        headerName: 'Statut',
        width: 130,
        pinned: 'right',
        cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
        cellRenderer: (params: any) => getStatutBadge(params.value)
      },
    ],
    []
  )

  if (!planRemboursementId) {
    return null
  }

  return (
    <div className="mb-7">
      <h3 className="text-[12px] font-bold text-aej-ink-2 mb-3 uppercase tracking-wider">
        Tableau d'amortissement
      </h3>
      
      {isLoading ? (
        <div className="text-sm text-aej-ink-3 bg-white border border-aej-line rounded-lg p-6 text-center">
          Chargement du tableau...
        </div>
      ) : !amortissements || amortissements.length === 0 ? (
        <div className="text-sm text-aej-ink-3 bg-white border border-aej-line rounded-lg p-6 text-center">
          Aucun échéancier enregistré.
        </div>
      ) : (
        <div className="w-full">
          <DataGrid
            rowData={amortissements}
            columnDefs={columnDefs}
            height="400px"
            pinnedBottomRowData={pinnedBottomRowData}
            pagination={false}
          />
        </div>
      )}
    </div>
  )
}
