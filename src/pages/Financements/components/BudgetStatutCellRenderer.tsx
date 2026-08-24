import type { ICellRendererParams } from 'ag-grid-community'
import { Badge } from '@/components/ui/badge'
import { Check, X } from 'lucide-react'
import { budgetServices } from '@/services/budgets.services'
import type { BUDGET_T, BUDGET_STATUT_T } from '@/types'

const STATUT_STYLES: Record<BUDGET_STATUT_T, string> = {
  EN_ATTENTE: 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-0',
  APPROUVE: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0',
  NON_APPROUVE: 'bg-red-100 text-red-700 hover:bg-red-100 border-0',
}

const STATUT_LABELS: Record<BUDGET_STATUT_T, string> = {
  EN_ATTENTE: 'En attente',
  APPROUVE: 'Approuvé',
  NON_APPROUVE: 'Non approuvé',
}

export const BudgetStatutCellRenderer = (params: ICellRendererParams<BUDGET_T>) => {
  const { mutate: validate, isPending } = budgetServices.useValidate()
  const statut = params.value as BUDGET_STATUT_T
  const budgetId = params.data?.id

  return (
    <div className="flex items-center gap-2 h-full">
      <Badge className={STATUT_STYLES[statut]}>{STATUT_LABELS[statut]}</Badge>
      {statut === 'EN_ATTENTE' && budgetId && (
        <div className="flex items-center gap-1">
          <button
            title="Approuver"
            disabled={isPending}
            onClick={() => validate({ id: budgetId, statut: 'APPROUVE' })}
            className="flex items-center justify-center w-6 h-6 rounded text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            title="Rejeter"
            disabled={isPending}
            onClick={() => validate({ id: budgetId, statut: 'NON_APPROUVE' })}
            className="flex items-center justify-center w-6 h-6 rounded text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
