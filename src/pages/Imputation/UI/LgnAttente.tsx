import { Folder } from 'lucide-react'
import { money } from "@/helpers/money"
import { refLabel } from '@/types/referentials.types'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import type { AGENCE_REGIONALE_T } from '@/types'

interface LgnAttenteProps {
  d: MICRO_PROJET_T
  agences: AGENCE_REGIONALE_T[]
}

export function LgnAttente({ d }: LgnAttenteProps) {
  const promoteurName = d.promoteur ? `${d.promoteur.nom} ${d.promoteur.prenom}` : '—'
  const communeLabel = d.commune ? refLabel(d.commune) : null
  const montant = d.montant_total ? Number(d.montant_total) : 0

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 px-[14px] py-[12px] border border-[#E5EAF1] rounded-[8px] mb-2 bg-white last:mb-0 hover:border-[#cdd6e2] transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-[26px] h-[26px] rounded-[8px] bg-[#131C29] text-white grid place-items-center flex-none">
          <Folder size={13} />
        </div>

        <div className="flex-1 min-w-0">
          <b className="block text-[13.5px] text-[#131C29]">
            {d.code} — {d.intitule}
          </b>
          <span className="text-[11.5px] text-[#5A6B80]">
            {promoteurName}
            {communeLabel && ` · ${communeLabel}`}
            {montant > 0 && ` · crédit ${money(montant)}`}
            {d.dispositif && ` · ${refLabel(d.dispositif)}`}
          </span>
        </div>
      </div>
    </div>
  )
}

