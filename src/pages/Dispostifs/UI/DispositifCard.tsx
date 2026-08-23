import { Card, CardContent } from '@/components/ui/card'
import { Workflow, Edit2, Trash2, ChevronRight } from 'lucide-react'
import { formatMontant } from '@/helpers/numbers'

type Dispositif = {
  id: number | string
  libelle: string
  code: string
  version: string
  montant_min: number
  montant_max: number
  taux: number
  duree: number
  cycles: number
  dossiers: number
  color: string
}

interface DispositifCardProps {
  dispositif: Dispositif
}

export function DispositifCard({ dispositif: d }: DispositifCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-all border border-[#E5EAF1] rounded-[11px] bg-white">
      <CardContent >
        <div className="flex items-center gap-[10px] mb-3">
          <div 
            className="w-10 h-10 rounded-[10px] flex items-center justify-center text-white shrink-0 shadow-[0_0_0_1px_rgba(0,0,0,0.06)]"
            style={{ backgroundColor: d.color }}
          >
            <Workflow className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0 leading-tight">
            <b className="text-[15px] text-[#2D6BD4] font-bold block truncate">{d.libelle}</b>
            <div className="font-mono text-xs text-[#8595A8] mt-0.5">
              {d.code} · v{d.version}
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5EAF1] text-[#5A6B80] bg-white hover:text-[#131C29] hover:border-[#cdd6e2] transition-colors" title="Modifier">
              <Edit2 className="w-[15px] h-[15px]" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5EAF1] text-[#5A6B80] bg-white hover:text-[#D6453B] hover:bg-[#FBE7E5] hover:border-[#FBE7E5] transition-colors" title="Supprimer">
              <Trash2 className="w-[15px] h-[15px]" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-[#5A6B80]">
          <span className="flex items-center gap-1">Montant <b className="text-[#131C29] font-bold">{formatMontant(d.montant_min.toString(), 'F')?.replace(' FCFA', '')} → {formatMontant(d.montant_max.toString(), 'F')?.replace(' FCFA', '')}</b></span>
          <span className="flex items-center gap-1">Taux <b className="text-[#131C29] font-bold">{d.taux}%</b></span>
          <span className="flex items-center gap-1">Durée <b className="text-[#131C29] font-bold">{d.duree} mois</b></span>
          <span className="flex items-center gap-1">Cycles <b className="text-[#131C29] font-bold">{d.cycles}</b></span>
          <span className="flex items-center gap-1">Dossiers <b className="text-[#131C29] font-bold">{d.dossiers}</b></span>
        </div>

        <div className="mt-3.5">
          <span className="inline-flex items-center gap-1.5 border border-[#E5EAF1] bg-white text-[#131C29] px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:border-[#cdd6e2] hover:bg-[#fbfcfe] transition-colors cursor-pointer">
            Voir le workflow <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
