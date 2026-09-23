import { SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import type { MICRO_PROJET_T } from '@/types/promoteurs.types'

interface ExaminerHeaderProps {
  projet: MICRO_PROJET_T | null
  statutConfig: { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
  handleClose: () => void
}

export function ExaminerHeader({ projet, statutConfig, handleClose }: ExaminerHeaderProps) {
  return (
    <SheetHeader className="sticky top-0 z-10 bg-white border-b border-slate-100 px-5 py-4 gap-1 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <code className="text-xs font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              {projet?.code ?? 'N/A'}
            </code>
            <span className="text-xs text-slate-400">· plan de décaissement · voie Agence</span>
            <Badge variant={statutConfig.variant} className="text-[11px]">
              {statutConfig.label}
            </Badge>
          </div>
          <SheetTitle className="text-[16px] font-bold text-slate-900 leading-snug">
            {projet?.intitule ?? 'Projet sans titre'}
          </SheetTitle>
          <p className="text-[12.5px] text-slate-500 mt-0.5">
            {projet?.promoteur ? `${projet.promoteur.prenom} ${projet.promoteur.nom}` : 'Promoteur inconnu'} · {projet?.agence?.libelle || projet?.agence?.nom || 'Agence inconnue'}
          </p>
        </div>
        <button
          onClick={handleClose}
          className="w-8 h-8 flex-none rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors mt-0.5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </SheetHeader>
  )
}
