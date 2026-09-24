import type { ICellRendererParams } from 'ag-grid-community'
import { budgetServices } from '@/services/budgets.services'
import type { REMBOURSEMENT_DECLARATION_T } from '@/types'

export function BudgetDeclarationCellRenderer(
  params: ICellRendererParams<REMBOURSEMENT_DECLARATION_T>
) {
  const budgetId = params.value ?? params.data?.budget_id
  const { data: budget, isLoading } = budgetServices.useGetOne(
    budgetId ? Number(budgetId) : null
  )

  if (!budgetId) {
    return (
      <div className="flex items-center h-full">
        <span className="text-xs text-slate-400">—</span>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center h-full">
        <span className="text-xs text-slate-400 animate-pulse">Chargement…</span>
      </div>
    )
  }

  if (!budget) {
    return (
      <div className="flex items-center h-full">
        <span className="font-mono text-xs text-slate-500">#{budgetId}</span>
      </div>
    )
  }

  const projet = budget.micro_projet

  return (
    <div className="flex flex-col justify-center min-w-0 leading-tight py-1">
      <span
        className="font-semibold text-[#131C29] text-[13px] truncate"
        title={budget.intitule}
      >
        {budget.intitule || `Budget #${budget.id}`}
      </span>
      {projet ? (
        <span
          className="text-xs text-[#2D6BD4] font-medium truncate"
          title={`${projet.code} - ${projet.intitule}`}
        >
          {projet.code} · {projet.intitule}
        </span>
      ) : (
        <span className="font-mono text-[11px] text-slate-400">
          Budget #{budget.id}
        </span>
      )}
    </div>
  )
}
