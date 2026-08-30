import { Pin } from 'lucide-react'
import { Badge } from '../components/Badge'
import { type DossierImpute } from '@/mock/imputation.mock'
import { agenceLibelle } from "@/helpers/agenceLibelle"

export function LgnFait({ d }: { d: DossierImpute }) {
  return (
    <div className="flex items-center gap-3 px-[14px] py-[12px] border border-[#E5EAF1] rounded-[8px] mb-2 bg-white last:mb-0 cursor-pointer hover:border-[#cdd6e2] transition-colors">
      <div className="w-[26px] h-[26px] rounded-[8px] bg-[#131C29] text-white grid place-items-center flex-none">
        <Pin size={13} />
      </div>

      <div className="flex-1 min-w-0">
        <b className="block text-[13.5px] text-[#131C29]">
          {d.code} — {d.titre}
        </b>
        <span className="text-[11.5px] text-[#5A6B80]">
          {d.gere_par === 'DIRECTION'
            ? 'Géré par la Direction'
            : agenceLibelle(d.agence_id!)}
          {' · '}plan de décaissement {d.plan_label}
        </span>
      </div>

      <Badge
        text={d.gere_par === 'DIRECTION' ? 'Direction' : 'Agence'}
        cls={d.gere_par === 'DIRECTION' ? 'bl' : 'or'}
      />
    </div>
  )
}
