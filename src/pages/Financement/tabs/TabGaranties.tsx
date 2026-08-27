import { Shield, Flag } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { MOCK_GARANTIES } from '@/mock/financement.mock'
import { StatusBadge } from '../components/StatusBadge'
import { money } from '../utils/money'

export function TabGaranties() {
  return (
    <Card className="p-0 overflow-hidden border-[#E5EAF1] shadow-[0_1px_2px_rgba(18,28,41,.05),_0_6px_20px_rgba(18,28,41,.06)]">
      {/* En-tête */}
      <div className="flex items-center gap-3 px-[18px] py-[15px] border-b border-[#EEF2F7]">
        <h3 className="text-[14.5px] font-bold text-[#131C29]">Rappels de garantie</h3>
        <div className="flex-1" />
        <StatusBadge label={String(MOCK_GARANTIES.length)} variant="rd" />
      </div>

      <div className="px-[18px] py-[16px]">
        {MOCK_GARANTIES.length === 0 ? (
          <div className="text-center py-10 text-[#5A6B80]">
            <Shield size={40} className="mx-auto mb-3 opacity-30" />
            <b className="block text-[#131C29] text-[15px] mb-1 font-['Archivo']">
              Aucun rappel de garantie
            </b>
          </div>
        ) : (
          MOCK_GARANTIES.map((g) => (
            <div
              key={g.id}
              className="flex items-start gap-3 border border-[#FBE7E5] rounded-[8px] px-[14px] py-3 bg-[#FBE7E5]/30 mb-2"
            >
              {/* icône */}
              <div className="w-[26px] h-[26px] rounded-[8px] bg-[#D6453B] text-white grid place-items-center flex-none mt-0.5">
                <Flag size={13} />
              </div>

              {/* info */}
              <div className="flex-1 min-w-0">
                <b className="block text-[13px] text-[#131C29]">
                  {g.code} — {g.titre}
                </b>
                <span className="text-[11.5px] text-[#5A6B80] block">
                  {g.promoteur} · {g.partenaire} · {g.motif}
                </span>
                <span className="text-[11.5px] text-[#D6453B] font-semibold">
                  Date du rappel : {g.date_rappel}
                </span>
              </div>

              {/* montant */}
              <span className="text-[13px] font-mono font-semibold text-[#D6453B] whitespace-nowrap">
                {money(g.montant_appele)}
              </span>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
