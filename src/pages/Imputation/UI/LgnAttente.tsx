import { Folder } from 'lucide-react'
import { money } from "@/helpers/money"
import { refLabel } from '@/types/referentials.types'
import { Checkbox } from '@/components/ui/checkbox'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import type { AGENCE_REGIONALE_T } from '@/types'

interface LgnAttenteProps {
  d: MICRO_PROJET_T
  agences: AGENCE_REGIONALE_T[]
  isChecked: boolean
  onToggle: (id: number) => void
}

export function LgnAttente({ d, isChecked, onToggle }: LgnAttenteProps) {
  const promoteurName = d.promoteur ? `${d.promoteur.nom} ${d.promoteur.prenom}` : '—'
  const communeLabel = d.commune ? refLabel(d.commune) : null
  const montant = d.montant_total ? Number(d.montant_total) : 0

  return (
    <div 
      className={`flex flex-col md:flex-row md:items-center gap-3 px-[14px] py-[12px] border rounded-[8px] mb-2 bg-white last:mb-0 transition-colors cursor-pointer ${
        isChecked ? 'border-[#E7722B] bg-[#FFF8F3]' : 'border-[#E5EAF1] hover:border-[#cdd6e2]'
      }`}
      onClick={() => onToggle(d.id)}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Checkbox 
          checked={isChecked}
          onCheckedChange={() => onToggle(d.id)}
          className="flex-none data-[state=checked]:bg-[#E7722B] data-[state=checked]:border-[#E7722B]"
          // Stop propagation so clicking checkbox doesn't trigger div onClick twice
          onClick={(e) => e.stopPropagation()}
        />
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

