import type { ICellRendererParams } from 'ag-grid-community'
import { Badge } from '@/components/ui/badge'
import { Check, X } from 'lucide-react'
import { decaissementServices } from '@/services/decaissements.services'
import type { DECAISSEMENT_T, DECAISSEMENT_STATUT_T } from '@/types'

const STATUT_STYLES: Record<DECAISSEMENT_STATUT_T, string> = {
  EN_ATTENTE: 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-0',
  VALIDE: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0',
  NON_VALIDE: 'bg-red-100 text-red-700 hover:bg-red-100 border-0',
}

const STATUT_LABELS: Record<DECAISSEMENT_STATUT_T, string> = {
  EN_ATTENTE: 'En attente',
  VALIDE: 'Validé',
  NON_VALIDE: 'Non validé',
}

export const DecaissementStatutCellRenderer = (params: ICellRendererParams<DECAISSEMENT_T>) => {
  const { mutate: validate, isPending } = decaissementServices.useValidate()
  const statut = params.value as DECAISSEMENT_STATUT_T
  const decaissementId = params.data?.id

  return (
    <div className="flex items-center gap-2 h-full">
      <Badge className={STATUT_STYLES[statut]}>{STATUT_LABELS[statut]}</Badge>
      {statut === 'EN_ATTENTE' && decaissementId && (
        <div className="flex items-center gap-1">
          <button
            title="Valider"
            disabled={isPending}
            onClick={() => validate({ id: decaissementId, statut: 'VALIDE' })}
            className="flex items-center justify-center w-6 h-6 rounded text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            title="Rejeter"
            disabled={isPending}
            onClick={() => validate({ id: decaissementId, statut: 'NON_VALIDE' })}
            className="flex items-center justify-center w-6 h-6 rounded text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
