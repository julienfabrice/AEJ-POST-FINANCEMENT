import type { ICellRendererParams } from 'ag-grid-community'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { remboursementServices } from '@/services/remboursements.services'
import type { REMBOURSEMENT_T, REMBOURSEMENT_STATUT_T } from '@/types'

const STATUT_STYLES: Record<REMBOURSEMENT_STATUT_T, string> = {
  EN_ATTENTE: 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-0',
  PAYE: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0',
  PARTIEL: 'bg-sky-100 text-sky-700 hover:bg-sky-100 border-0',
  NON_PAYE: 'bg-red-100 text-red-700 hover:bg-red-100 border-0',
}

const STATUT_LABELS: Record<REMBOURSEMENT_STATUT_T, string> = {
  EN_ATTENTE: 'En attente',
  PAYE: 'Payé',
  PARTIEL: 'Partiel',
  NON_PAYE: 'Non payé',
}

export const RemboursementStatutCellRenderer = (params: ICellRendererParams<REMBOURSEMENT_T>) => {
  const { mutate: validate, isPending } = remboursementServices.useValidate()
  const statut = params.value as REMBOURSEMENT_STATUT_T
  const remboursementId = params.data?.id

  return (
    <div className="flex items-center gap-2 h-full">
      <Badge className={STATUT_STYLES[statut]}>{STATUT_LABELS[statut]}</Badge>
      {statut === 'EN_ATTENTE' && remboursementId && (
        <button
          title="Marquer payé"
          disabled={isPending}
          onClick={() => validate({ id: remboursementId, statut: 'PAYE' })}
          className="flex items-center justify-center w-6 h-6 rounded text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
