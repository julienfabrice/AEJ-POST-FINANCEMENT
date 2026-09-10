import type { ICellRendererParams } from 'ag-grid-community'
import { Badge } from '@/components/ui/badge'
import { Send, CheckCheck, Undo2 } from 'lucide-react'
import { decaissementDeclarationServices } from '@/services/decaissementsDeclarations.services'
import type { DECAISSEMENT_DECLARATION_T, DECAISSEMENT_DECLARATION_STATUT_T } from '@/types'

const STATUT_STYLES: Record<DECAISSEMENT_DECLARATION_STATUT_T, string> = {
  BROUILLON: 'bg-slate-100 text-slate-700 hover:bg-slate-100 border-0',
  SOUMIS: 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-0',
  TRAITE: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0',
}

const STATUT_LABELS: Record<DECAISSEMENT_DECLARATION_STATUT_T, string> = {
  BROUILLON: 'Brouillon',
  SOUMIS: 'Soumis',
  TRAITE: 'Traité',
}

export const DecaissementDeclarationStatutCellRenderer = (params: ICellRendererParams<DECAISSEMENT_DECLARATION_T>) => {
  const { mutate: validate, isPending } = decaissementDeclarationServices.useValidate()
  const statut = params.value as DECAISSEMENT_DECLARATION_STATUT_T
  const id = params.data?.id

  return (
    <div className="flex items-center gap-2 h-full">
      <Badge className={STATUT_STYLES[statut]}>{STATUT_LABELS[statut]}</Badge>
      {id && statut === 'BROUILLON' && (
        <button
          title="Soumettre"
          disabled={isPending}
          onClick={() => validate({ id, statut: 'SOUMIS' })}
          className="flex items-center justify-center w-6 h-6 rounded text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      )}
      {id && statut === 'SOUMIS' && (
        <div className="flex items-center gap-1">
          <button
            title="Marquer comme traité"
            disabled={isPending}
            onClick={() => validate({ id, statut: 'TRAITE' })}
            className="flex items-center justify-center w-6 h-6 rounded text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50"
          >
            <CheckCheck className="w-3.5 h-3.5" />
          </button>
          <button
            title="Renvoyer en brouillon"
            disabled={isPending}
            onClick={() => validate({ id, statut: 'BROUILLON' })}
            className="flex items-center justify-center w-6 h-6 rounded text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
