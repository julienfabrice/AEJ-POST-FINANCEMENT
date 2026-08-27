import { FileText } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { MOCK_DOSSIERS_APPROUVES, MOCK_DOSSIERS_REJETES } from '@/mock/financement.mock'
import { StatusBadge, approbationBadge } from '../components/StatusBadge'
import { money } from '../utils/money'

interface Props {
  type: 'APPROUVE' | 'REJETE'
}

export function TabListeDecision({ type }: Props) {
  const list = type === 'APPROUVE' ? MOCK_DOSSIERS_APPROUVES : MOCK_DOSSIERS_REJETES
  const badge = approbationBadge(type)

  if (list.length === 0) {
    return (
      <div className="text-center py-14 text-[#5A6B80]">
        <FileText size={40} className="mx-auto mb-3 opacity-40" />
        <b className="block text-[#131C29] text-[15px] mb-1 font-['Archivo']">
          {type === 'APPROUVE' ? 'Aucun dossier approuvé' : 'Aucun dossier rejeté'}
        </b>
      </div>
    )
  }

  return (
    <Card className="p-0 overflow-hidden border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)]">
      {/* En-tête */}
      <div className="flex items-center gap-3 px-[18px] py-[15px] border-b border-[#EEF2F7]">
        <h3 className="text-[14.5px] font-bold text-[#131C29]">
          {type === 'APPROUVE' ? 'Dossiers approuvés' : 'Dossiers rejetés'}
        </h3>
        <div className="flex-1" />
        <StatusBadge label={String(list.length)} variant={badge.variant} />
      </div>

      {/* Corps */}
      <div className="px-[18px] py-[16px]">
        {list.map((d) => (
          <div
            key={d.id}
            className="flex items-start gap-3 border border-[#E5EAF1] rounded-[8px] px-[14px] py-3 bg-white mb-2 cursor-pointer hover:bg-[#fafbfe] transition-colors"
          >
            {/* icône */}
            <div className="w-[26px] h-[26px] rounded-[8px] bg-[#131C29] text-white grid place-items-center flex-none mt-0.5">
              <FileText size={13} />
            </div>

            {/* info */}
            <div className="flex-1 min-w-0">
              <b className="block text-[13px] text-[#131C29]">
                {d.code} — {d.titre}
              </b>
              <span className="text-[11.5px] text-[#5A6B80]">
                {d.promoteur}
                {d.motif_rejet && ` · ${d.motif_rejet}`}
              </span>
            </div>

            {/* montant */}
            <span className="text-[13px] font-semibold text-[#131C29] whitespace-nowrap font-mono">
              {money(d.montant_credit ?? d.montant)}
            </span>

            {/* badges pièces */}
            {d.piece_convention && (
              <StatusBadge label="Convention" variant="gy" />
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
