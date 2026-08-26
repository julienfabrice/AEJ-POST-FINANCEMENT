import { Link } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Workflow, Edit2, Trash2, ChevronRight, MoreHorizontal, Info } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatMontant } from '@/helpers/numbers'
import type { DISPOSITIF_T } from '@/types'

interface DispositifCardProps {
  dispositif: DISPOSITIF_T
  onEdit?: () => void
  onDelete?: () => void
  onView?: () => void
}

export function DispositifCard({ dispositif: g, onEdit, onDelete, onView }: DispositifCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-all border border-[#E5EAF1] rounded-[11px] bg-white">
      <CardContent >
        <div className="flex items-center gap-[10px] mb-3">
          <div 
            className="w-10 h-10 rounded-[10px] flex items-center justify-center text-white shrink-0 shadow-[0_0_0_1px_rgba(0,0,0,0.06)]"
            style={{ backgroundColor: g.guichet?.couleur || '#3498db' }}
          >
            <Workflow className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0 leading-tight">
            <b className="text-[15px] text-[#2D6BD4] font-bold block truncate">{g.intitule}</b>
            <div className="font-mono text-xs text-[#8595A8] mt-0.5">
              {g.code} {g.workflow_version?.code && `· ${g.workflow_version?.code}`}
            </div>
          </div>
          <div className="flex items-center shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-transparent text-[#5A6B80] bg-white hover:bg-[#F1F5F9] transition-colors">
                  <MoreHorizontal className="w-[18px] h-[18px]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem className="cursor-pointer flex items-center gap-2" onClick={onView}>
                  <Info className="w-4 h-4 text-[#5A6B80]" />
                  <span>Information complète</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer flex items-center gap-2" onClick={onEdit}>
                  <Edit2 className="w-4 h-4 text-[#5A6B80]" />
                  <span>Modification</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-red-600 focus:bg-red-50 focus:text-red-600" onClick={onDelete}>
                  <Trash2 className="w-4 h-4" />
                  <span>Suppression</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[13px] text-[#5A6B80]">
          <span className="flex items-center gap-1 bg-[#F1F5F9] px-2 py-0.5 rounded text-[12px]">
            Montant <b className="text-[#131C29]">{formatMontant(g.montant_min?.toString() || '0', 'F')?.replace(' FCFA', '')} → {formatMontant(g.montant_max?.toString() || '0', 'F')?.replace(' FCFA', '')}</b>
          </span>
          <span className="flex items-center gap-1 bg-[#F1F5F9] px-2 py-0.5 rounded text-[12px]">
            Taux <b className="text-[#131C29]">{g.taux}%</b>
          </span>
          <span className="flex items-center gap-1 bg-[#F1F5F9] px-2 py-0.5 rounded text-[12px]">
            Durée <b className="text-[#131C29]">{g.duree} mois</b>
          </span>
          <span className="flex items-center gap-1 bg-[#F1F5F9] px-2 py-0.5 rounded text-[12px]">
            Dossiers prévus <b className="text-[#131C29]">{g.nbre_micro_projet_prevu}</b>
          </span>
        </div>

        <div className="mt-3.5">
          <Link 
            to="/guichet-workflow/$workflowId" 
            params={{ workflowId: g.workflow_version?.id?.toString() || '1' }}
            className="inline-flex items-center gap-1.5 border border-[#E5EAF1] bg-white text-[#131C29] px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:border-[#cdd6e2] hover:bg-[#fbfcfe] transition-colors cursor-pointer"
          >
            Voir le workflow <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
