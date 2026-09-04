import { Pin } from 'lucide-react'
import { Badge } from '../components/Badge'
import { money } from "@/helpers/money"
import { refLabel } from '@/types/referentials.types'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

export function LgnFait({ d }: { d: MICRO_PROJET_T }) {
  const promoteurName = d.promoteur ? `${d.promoteur.nom} ${d.promoteur.prenom}` : '—'
  const isAgence = Boolean(d.agence || d.agence_id)
  const agenceName = d.agence ? refLabel(d.agence) : (d.agence_id ? `Agence #${d.agence_id}` : 'Direction')
  const montant = d.montant_total ? Number(d.montant_total) : 0

  return (
    <div className="flex items-center gap-3 px-[14px] py-[12px] border border-[#E5EAF1] rounded-[8px] mb-2 bg-white last:mb-0 hover:border-[#cdd6e2] transition-colors">
      <div className="w-[26px] h-[26px] rounded-[8px] bg-[#131C29] text-white grid place-items-center flex-none">
        <Pin size={13} />
      </div>

      <div className="flex-1 min-w-0">
        <b className="block text-[13.5px] text-[#131C29]">
          {d.code} — {d.intitule}
        </b>
        <span className="text-[11.5px] text-[#5A6B80]">
          {promoteurName} · {isAgence ? `Imputé à : ${agenceName}` : 'Géré par la Direction'}
          {montant > 0 && ` · ${money(montant)}`}
          {d.dispositif && ` · ${refLabel(d.dispositif)}`}
        </span>
      </div>

      <Badge
        text={isAgence ? (d.agence ? refLabel(d.agence) : 'Agence') : 'Direction'}
        cls={isAgence ? 'or' : 'bl'}
      />
    </div>
  )
}

