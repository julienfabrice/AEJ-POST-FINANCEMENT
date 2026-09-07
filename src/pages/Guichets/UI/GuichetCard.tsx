import { Workflow } from 'lucide-react'
import { formatMontant } from '@/helpers/numbers'

export interface GuichetCardData {
  id: number | string
  libelle: string
  code: string
  montant_min: number
  montant_max: number
  taux: number
  cycles: number
  dossiers: number
  color: string
}

interface GuichetCardProps {
  guichet: GuichetCardData
  onClick?: () => void
}

/** Estimation d'exposition financière pour l'affichage, en l'absence de
 *  données réelles agrégées côté API (dossiers = repli sur le nombre de
 *  micro-projets prévus, faute d'un vrai compteur de dossiers en cours). */
function estimateMontant(g: GuichetCardData): string {
  if (!g.dossiers) return '—'
  const moyenne = (g.montant_min + g.montant_max) / 2
  const total = moyenne * g.dossiers
  if (total >= 1_000_000) return `${(total / 1_000_000).toFixed(1)} M`
  return formatMontant(String(total), '')?.trim() ?? '0'
}

export function GuichetCard({ guichet: g, onClick }: GuichetCardProps) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white border border-[#E5EAF1] rounded-[11px] p-5 hover:shadow-md transition-all"
    >
      <div
        className="w-11 h-11 rounded-[10px] flex items-center justify-center text-white mb-3"
        style={{ background: `linear-gradient(150deg, ${g.color}, ${g.color}cc)` }}
      >
        <Workflow className="w-5 h-5" />
      </div>
      <h3 className="text-[17px] font-bold text-[#131C29] leading-tight">{g.libelle}</h3>
      <div className="text-xs text-[#8595A8] mt-1 mb-4">
        {g.code} · {g.cycles ? `${g.cycles} mois · ` : ''}{formatMontant(String(g.montant_min), 'F')?.replace(' F', '')} → {formatMontant(String(g.montant_max), 'F')?.replace(' F', '')}
      </div>
      <div className="flex items-center gap-6 pt-3 border-t border-[#F1F4F8]">
        <div>
          <span className="block text-xs text-[#8595A8]">Dossiers</span>
          <b className="text-[15px] text-[#131C29]">{g.dossiers || '—'}</b>
        </div>
        <div>
          <span className="block text-xs text-[#8595A8]">Montant</span>
          <b className="text-[15px] text-[#131C29]">{estimateMontant(g)}</b>
        </div>
        <div>
          <span className="block text-xs text-[#8595A8]">Taux</span>
          <b className="text-[15px] text-[#131C29]">{g.taux}%</b>
        </div>
      </div>
    </div>
  )
}