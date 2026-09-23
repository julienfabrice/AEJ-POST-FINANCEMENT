import { SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

interface ProjetSheetHeaderProps {
  projet: MICRO_PROJET_T
  onClose: () => void
}

export function ProjetSheetHeader({ projet, onClose }: ProjetSheetHeaderProps) {
  return (
    <SheetHeader className="shrink-0 bg-white px-6 py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="text-[12px] text-aej-slate font-medium uppercase tracking-wide mb-1 flex items-center gap-1.5">
            <span>{projet.code ?? 'N/A'}</span>
            <span>·</span>
            <span>{projet.type_projet}</span>
            <span>·</span>
            <span>{projet?.dispositif?.code || projet?.dispositif?.libelle}</span>
          </div>
          <SheetTitle className="text-xl font-bold text-aej-ink leading-tight">
            {projet.intitule}
          </SheetTitle>
          <div className="text-[13px] text-aej-slate mt-1.5">
            {projet.promoteur?.prenom} {projet.promoteur?.nom} {projet.secteur?.libelle && <>· {projet.secteur.libelle}</>}
          </div>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <Badge className="bg-aej-orange-soft text-aej-orange-deep hover:bg-aej-orange-soft shadow-none border-0 text-[13px] font-medium px-3 py-1.5 whitespace-nowrap rounded-md">
            {projet.statut}
          </Badge>
          <button
            onClick={onClose}
            className="w-9 h-9 flex-none rounded-md border border-aej-line bg-white flex items-center justify-center text-aej-slate hover:text-aej-ink hover:bg-aej-bg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </SheetHeader>
  )
}
