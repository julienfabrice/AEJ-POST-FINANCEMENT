import { useState } from 'react'
import { Folder } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { money } from "@/helpers/money"
import { refLabel } from '@/types/referentials.types'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'
import type { AGENCE_REGIONALE_T } from '@/types'

interface LgnAttenteProps {
  d: MICRO_PROJET_T
  agences: AGENCE_REGIONALE_T[]
  onImputer: (id: number, agId: number) => void
  onDirection: (id: number) => void
  isImputing?: boolean
}

export function LgnAttente({ d, agences, onImputer, onDirection, isImputing }: LgnAttenteProps) {
  const [agId, setAgId] = useState<string>(agences.length > 0 ? String(agences[0].id) : '')

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

      <div className="flex flex-wrap items-center gap-2">
        <Select value={agId} onValueChange={setAgId}>
          <SelectTrigger className="w-[210px] h-8 text-[12.5px] border-[#E5EAF1] bg-slate-50">
            <SelectValue placeholder="Choisir une agence" />
          </SelectTrigger>
          <SelectContent>
            {agences.map((a) => (
              <SelectItem key={a.id} value={String(a.id)} className="text-[12.5px]">
                {a.nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          size="sm"
          className="h-8 text-[12px] bg-[#E7722B] hover:bg-[#C85E18] text-white"
          disabled={!agId || isImputing}
          onClick={() => onImputer(d.id, Number(agId))}
        >
          Imputer
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-8 text-[12px] border-[#E5EAF1] text-[#131C29]"
          disabled={isImputing}
          onClick={() => onDirection(d.id)}
        >
          Conserver à la Direction
        </Button>
      </div>
    </div>
  )
}

