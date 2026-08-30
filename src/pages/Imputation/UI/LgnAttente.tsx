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
import { MOCK_AGENCES_IMPUTATION, type DossierAImputer } from '@/mock/imputation.mock'
import { money } from "@/helpers/money"

interface LgnAttenteProps {
  d: DossierAImputer
  onImputer: (id: string, agId: string) => void
  onDirection: (id: string) => void
}

export function LgnAttente({ d, onImputer, onDirection }: LgnAttenteProps) {
  const [agId, setAgId] = useState(d.agence_suggestion)

  return (
    <div className="flex items-center gap-3 px-[14px] py-[12px] border border-[#E5EAF1] rounded-[8px] mb-2 bg-white last:mb-0">
      <div className="w-[26px] h-[26px] rounded-[8px] bg-[#131C29] text-white grid place-items-center flex-none">
        <Folder size={13} />
      </div>

      <div className="flex-1 min-w-0">
        <b className="block text-[13.5px] text-[#131C29]">
          {d.code} — {d.titre}
        </b>
        <span className="text-[11.5px] text-[#5A6B80]">
          {d.jeune} · {d.commune} · crédit {money(d.montant_credit)} · rattachement {d.rattachement}
        </span>
      </div>

      <Select value={agId} onValueChange={setAgId}>
        <SelectTrigger className="min-w-[210px] h-8 text-[12.5px] border-[#E5EAF1]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MOCK_AGENCES_IMPUTATION.map((a) => (
            <SelectItem key={a.id} value={a.id} className="text-[12.5px]">
              {a.libelle}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        size="sm"
        className="h-8 text-[12px] bg-[#E7722B] hover:bg-[#C85E18] border-[#E7722B] text-white"
        onClick={() => onImputer(d.id, agId)}
      >
        Imputer
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="h-8 text-[12px] border-[#E5EAF1] text-[#131C29]"
        onClick={() => onDirection(d.id)}
      >
        Conserver à la Direction
      </Button>
    </div>
  )
}
